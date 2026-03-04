import { Product } from '@/lib/data';

export default function ProductJsonLd({ product }: { product: Product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: `NH-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'NewHome',
    },
    offers: {
      '@type': 'Offer',
      url: `https://newhome.ge/product/${product.id}`,
      priceCurrency: 'GEL',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'NewHome.ge',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
