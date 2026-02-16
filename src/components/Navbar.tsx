"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useCurrency } from "@/store/useCurrency";
import { useCart } from "@/store/useCart";
import { useSearch } from "@/store/useSearch";
import { useAuth } from "@/store/useAuth";
import { SearchOverlay } from "./SearchOverlay";
import { BrandLogo } from "./BrandLogo";
import { LoginModal } from "./LoginModal";

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const { isOpen: searchOpen, closeSearch, openSearch } = useSearch();
    const { detectCurrency } = useCurrency();
    const { items, toggleCart } = useCart();
    const { user, isAuthenticated, logout } = useAuth();

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        detectCurrency();
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />
            <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

            {/* Top Utility Bar */}
            <div className={cn(
                "fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-transform duration-300",
                isScrolled ? "-translate-y-full" : "translate-y-0"
            )}>
                <div className="max-w-[1920px] mx-auto px-6 py-2 flex justify-end items-center gap-6 text-[11px] font-medium">
                    <Link href="/help" className="hover:text-foreground/60 transition-colors">Help</Link>
                    <span className="text-border">|</span>
                    {isAuthenticated ? (
                        <span className="text-foreground/60">Hi, {user?.firstName || 'User'}</span>
                    ) : (
                        <>
                            <Link href="/signup" className="hover:text-foreground/60 transition-colors">Sign Up</Link>
                            <span className="text-border">|</span>
                            <button onClick={() => setLoginModalOpen(true)} className="hover:text-foreground/60 transition-colors">Log In</button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Navbar */}
            <nav className={cn(
                "fixed left-0 right-0 z-50 bg-background border-b border-border transition-all duration-300",
                isScrolled ? "top-0 shadow-md" : "top-[38px]"
            )}>
                <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <BrandLogo size="sm" showImage={true} />
                    </Link>

                    {/* Center Navigation - Keep your existing links */}
                    <div className="hidden lg:flex items-center justify-center flex-1 gap-8 text-[15px] font-medium">
                        <Link href="/" className="hover:text-foreground/60 transition-colors">Shop</Link>
                        <Link href="/new" className="hover:text-foreground/60 transition-colors">New Arrivals</Link>
                        <Link href="/collections" className="hover:text-foreground/60 transition-colors">Collections</Link>
                        <Link href="/about" className="hover:text-foreground/60 transition-colors">About</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-2 bg-secondary hover:bg-secondary/80 rounded-full px-4 py-2 transition-colors">
                            <Search size={20} className="text-foreground/60" />
                            <input
                                type="text"
                                placeholder="Search"
                                onClick={openSearch}
                                readOnly
                                className="bg-transparent border-none outline-none text-sm w-32 lg:w-48 cursor-pointer placeholder:text-foreground/40"
                            />
                        </div>

                        {/* Mobile Search */}
                        <button
                            onClick={openSearch}
                            className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full transition-all"
                        >
                            <Search size={20} />
                        </button>

                        {/* Favorites */}

                        {/* User Menu */}
                        <div className="relative">
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all relative"
                                    >
                                        <User size={18} />
                                    </button>

                                    {/* User Dropdown */}
                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50"
                                            >
                                                <div className="p-4 border-b border-border">
                                                    <p className="text-sm font-medium">{user?.firstName || 'User'}</p>
                                                    <p className="text-xs text-muted-foreground">{user?.countryCode} {user?.phone}</p>
                                                </div>
                                                <div className="py-2">
                                                    <Link
                                                        href="/account"
                                                        className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        My Account
                                                    </Link>
                                                    <Link
                                                        href="/orders"
                                                        className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        Orders
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            setUserMenuOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors text-red-500"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <button
                                    onClick={() => setLoginModalOpen(true)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full transition-all relative"
                                >
                                    <User size={18} />
                                </button>
                            )}
                        </div>


                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full transition-all relative"
                        >
                            <ShoppingBag size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full transition-all"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-0 z-[60] bg-background flex flex-col"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-border">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                    <BrandLogo size="sm" showImage={true} />
                                </Link>
                                <button
                                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-1 p-6">
                                {[
                                    { label: "Shop", href: "/" },
                                    { label: "New Arrivals", href: "/new" },
                                    { label: "Collections", href: "/collections" },
                                    { label: "About", href: "/about" }
                                ].map((item, index) => (
                                    <Link
                                        key={`${item.href}-${index}`}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-2xl font-medium py-3 hover:text-foreground/60 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};
