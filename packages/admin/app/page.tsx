'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminHomePage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Force Admin Panel
                </h1>
                <p className="text-gray-600 mb-8">
                    Secure dashboard for store management.
                </p>
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">🔒 Features</h2>
                        <ul className="text-left text-sm text-gray-600 space-y-1">
                            <li>✅ Secure Login</li>
                            <li>✅ Data Protection</li>
                            <li>✅ Access Control</li>
                            <li>✅ Activity Monitoring</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
}
