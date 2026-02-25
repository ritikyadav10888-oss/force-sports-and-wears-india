import { Metadata } from 'next';
import { api } from '@/lib/api-client';
import { ProductView } from '@/components/ProductView';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { id } = await params;
        const { product } = await api.getProduct(id);
        if (!product) {
            return {
                title: 'Product Not Found | Force Sports',
                description: 'The requested product could not be found.'
            }
        }

        const images = product.images && product.images.length > 0
            ? product.images
            : ['/placeholder-product.png'];

        return {
            title: product.name,
            description: product.description,
            openGraph: {
                title: product.name,
                description: product.description,
                images: images,
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description: product.description,
                images: images,
            }
        };
    } catch (e) {
        return {
            title: 'Force Sports India',
            description: 'Premium Sports Gear',
        }
    }
}

export default async function Page({ params }: Props) {
    let product = null;
    let relatedProducts: any[] = [];

    try {
        // Fetch product and all products for related items
        // We handle errors gracefully to avoid crushing the page if API is down, 
        // though ProductView handles null product.
        const { id } = await params;
        const productData = await api.getProduct(id).catch(() => ({ product: null }));
        product = productData.product;

        if (product) {
            const allProductsData = await api.getProducts().catch(() => ({ products: [] }));
            const allProducts = allProductsData.products || [];
            relatedProducts = allProducts
                .filter((p: any) => p.category === product.category && p.id !== product.id)
                .slice(0, 4);
        }
    } catch (error) {
        console.error("Error fetching product data:", error);
    }

    // JSON-LD Structured Data
    const jsonLd = product ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images,
        description: product.description,
        sku: product.id,
        brand: {
            '@type': 'Brand',
            name: 'Force Sports'
        },
        offers: {
            '@type': 'Offer',
            url: `https://forcesports.in/product/${product.id}`,
            priceCurrency: 'INR',
            price: product.price,
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductView product={product} relatedProducts={relatedProducts} />
        </>
    );
}
