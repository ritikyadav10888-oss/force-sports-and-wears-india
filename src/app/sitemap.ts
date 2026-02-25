import { MetadataRoute } from 'next';
import { api } from '@/lib/api-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://forcesports.in';

    // Static routes
    const routes = [
        '',
        '/collections/men',
        '/collections/women',
        '/collections/accessories',
        '/about',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // Dynamic Application Routes - Products
        // Note: Assuming api.getProducts() returns { products: [] }
        const { products } = await api.getProducts().catch(() => ({ products: [] }));

        const productRoutes = products.map((product: any) => ({
            url: `${baseUrl}/product/${product.id}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        return [...routes, ...productRoutes];
    } catch (error) {
        console.error('Failed to generate product sitemap:', error);
        return routes;
    }
}
