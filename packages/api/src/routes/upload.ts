import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { authenticate, requireAdmin } from '../middleware/authenticate';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const uuid = crypto.randomUUID();
        const ext = path.extname(file.originalname);
        cb(null, `${uuid}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Wrap upload middleware to handle errors
const uploadMiddleware = (req: any, res: any, next: any) => {
    const uploadSingle = upload.single('image');
    uploadSingle(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
             return res.status(400).json({ error: err.message });
        } else if (err) {
             return res.status(400).json({ error: err.message });
        }
        next();
    });
};

router.post('/', authenticate, requireAdmin, uploadMiddleware, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Construct URL based on host (e.g. localhost:5000/uploads/filename.jpg)
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

export default router;
