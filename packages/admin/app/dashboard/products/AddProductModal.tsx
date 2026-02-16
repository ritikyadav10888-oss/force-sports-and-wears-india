"use client";
import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: any;
}

export const AddProductModal = ({ isOpen, onClose, onSuccess, product }: AddProductModalProps) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: ''
    });
    const [imageUrls, setImageUrls] = useState<string[]>(['']);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (product) {
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    category: product.category || '',
                    stock: product.stock || ''
                });
                setImageUrls(product.images && product.images.length > 0 ? product.images : ['']);
            } else {
                setFormData({ name: '', description: '', price: '', category: '', stock: '' });
                setImageUrls(['']);
            }
            setError('');
        }
    }, [isOpen, product]);

    if (!isOpen) return null;

    const handleAddImage = () => {
        if (imageUrls.length < 4) setImageUrls([...imageUrls, '']);
    };

    const handleImageChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const handleRemoveImage = (index: number) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls.length ? newUrls : ['']);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        try {
            setUploading(true);
            const data = await adminAPI.uploadImage(file);

            // Add to list
            if (imageUrls[0] === '' && imageUrls.length === 1) {
                setImageUrls([data.imageUrl]);
            } else if (imageUrls.length < 4) {
                setImageUrls([...imageUrls, data.imageUrl]);
            } else {
                setError("Max 4 images allowed");
            }
        } catch (err: any) {
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const validImages = imageUrls.filter(url => url.trim() !== '');

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: validImages
            };

            if (product?.id) {
                await adminAPI.updateProduct(product.id, payload);
            } else {
                await adminAPI.createProduct(payload);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || `Failed to ${product ? 'update' : 'create'} product`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-background w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/20 sticky top-0 backdrop-blur-md z-10">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                        {product ? 'Edit Product' : 'New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-medium"
                            placeholder="e.g. Pro Cricket Bat"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-medium resize-none"
                            placeholder="Product details..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price (INR)</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-medium"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full p-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-medium"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</label>
                            <input
                                required
                                type="text"
                                list="categories"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-medium"
                                placeholder="Select or Type..."
                            />
                            <datalist id="categories">
                                <option value="Cricket" />
                                <option value="Badminton" />
                                <option value="Running" />
                                <option value="Football" />
                                <option value="Training" />
                                <option value="Pickleball" />
                            </datalist>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Product Images (Max 4)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="text-[10px] font-bold text-accent hover:underline uppercase flex items-center gap-1 disabled:opacity-50"
                                    >
                                        {uploading ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />} Upload
                                    </button>
                                    {imageUrls.length < 4 && (
                                        <button type="button" onClick={handleAddImage} className="text-[10px] font-bold text-accent hover:underline uppercase flex items-center gap-1">
                                            <Plus size={12} /> Add URL
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <div className="relative flex-1">
                                            <input
                                                type="url"
                                                value={url}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                                className="w-full p-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-accent/50 outline-none font-medium pr-12"
                                                placeholder="https://..."
                                            />
                                            {url && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg overflow-hidden border border-border bg-white">
                                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        {imageUrls.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveImage(index)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] border border-border hover:bg-secondary transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading || uploading} className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-accent text-white hover:bg-accent/90 disabled:opacity-50 transition-colors flex items-center gap-2">
                            {loading && <Loader2 className="animate-spin" size={14} />}
                            {loading ? `${product ? 'Update' : 'Create'} Product` : (product ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
