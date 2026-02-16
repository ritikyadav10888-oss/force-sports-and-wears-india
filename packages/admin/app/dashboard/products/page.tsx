'use client';

import React, { useEffect, useState } from 'react';
import { Package, Search, Filter, Plus, Edit2, Trash2, Tag, Layers, Loader2 } from 'lucide-react';
import { adminAPI } from '@/lib/admin-api-client';

import { AddProductModal } from './AddProductModal';

const statusStyles: any = {
    'In Stock': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Low Stock': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'Out of Stock': 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getProducts();
            setProducts(data.products || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const getStatus = (stock: number) => {
        if (stock <= 0) return 'Out of Stock';
        if (stock < 10) return 'Low Stock';
        return 'In Stock';
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setIsAddModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            setLoading(true);
            await adminAPI.deleteProduct(id);
            await fetchProducts();
        } catch (err: any) {
            setError(err.message || 'Failed to delete product');
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsAddModalOpen(true);
    };

    if (loading && !products.length) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10">
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProducts}
                product={selectedProduct}
            />

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 md:space-y-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none gradient-text">
                        Inventory
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs flex items-center gap-2 md:gap-3 flex-wrap">
                        <span>Product Catalog</span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-accent underline underline-offset-4 decoration-2">Warehouse Node</span>
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleAdd}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-accent/30 transition-all hover:scale-105"
                    >
                        <Plus size={14} /> Add Product
                    </button>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="CATALOG SEARCH (SKU, NAME, TAGS)..."
                        className="w-full bg-white/50 border border-border/30 rounded-xl px-12 py-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/50 transition-colors">
                        <Filter size={14} /> Category
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
                    {error}
                </div>
            )}

            {/* Products Grid Copied by Category */}
            <div className="space-y-12 md:space-y-16">
                {products.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest">
                        No products found in database.
                    </div>
                ) : (
                    Object.entries(products.reduce((acc: any, product) => {
                        const cat = product.category || 'Uncategorized';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(product);
                        return acc;
                    }, {})).map(([category, items]: any) => (
                        <div key={category} className="space-y-6 md:space-y-8">
                            <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                                <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-foreground/80">
                                    {category}
                                </h2>
                                <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full border border-accent/20">
                                    {items.length} Items
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {items.map((product: any) => {
                                    const status = getStatus(product.stock);
                                    return (
                                        <div key={product.id} className="glass-card group hover:border-accent/30 transition-all duration-300">
                                            <div className="h-48 bg-muted/30 relative overflow-hidden flex items-center justify-center">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <Package className="text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500" size={64} />
                                                )}
                                                <div className="absolute top-4 right-4">
                                                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusStyles[status]}`}>
                                                        {status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 md:p-8 space-y-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest">
                                                        <Tag size={10} /> {product.category}
                                                    </div>
                                                    <h3 className="text-xl font-black italic uppercase tracking-tight group-hover:text-accent transition-colors underline decoration-transparent group-hover:decoration-accent/30 line-clamp-1">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">ID: {product.id}</p>
                                                </div>

                                                <div className="flex items-center justify-between pt-6 border-t border-border/30">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</p>
                                                        <p className="font-black text-xl italic">₹{Number(product.price).toLocaleString()}</p>
                                                    </div>
                                                    <div className="text-right space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Allocation</p>
                                                        <div className="flex items-center gap-2 text-sm font-bold">
                                                            <Layers size={14} className="text-accent" />
                                                            {product.stock} units
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 pt-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="flex items-center justify-center gap-2 p-3 md:p-4 bg-white border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all"
                                                    >
                                                        <Edit2 size={12} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="flex items-center justify-center gap-2 p-3 md:p-4 bg-red-500/5 border border-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <Trash2 size={12} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
