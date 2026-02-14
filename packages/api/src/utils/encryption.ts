import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
    console.warn('⚠️  WARNING: ENCRYPTION_KEY must be at least 32 characters long for production use');
}

export const encrypt = (text: string): string => {
    if (!ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY not configured');
    }
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

export const decrypt = (ciphertext: string): string => {
    if (!ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY not configured');
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Encrypt sensitive fields
export const encryptSensitiveData = (data: {
    phone?: string;
    address?: string;
    [key: string]: any;
}) => {
    const encrypted: any = { ...data };

    if (data.phone) {
        encrypted.phone = encrypt(data.phone);
    }

    if (data.address) {
        encrypted.address = encrypt(data.address);
    }

    return encrypted;
};

// Decrypt sensitive fields
export const decryptSensitiveData = (data: {
    phone?: string;
    address?: string;
    [key: string]: any;
}) => {
    const decrypted: any = { ...data };

    if (data.phone) {
        try {
            decrypted.phone = decrypt(data.phone);
        } catch (error) {
            console.error('Failed to decrypt phone');
        }
    }

    if (data.address) {
        try {
            decrypted.address = decrypt(data.address);
        } catch (error) {
            console.error('Failed to decrypt address');
        }
    }

    return decrypted;
};
