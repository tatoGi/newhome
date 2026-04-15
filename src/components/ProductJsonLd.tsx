interface ProductJsonLdProps {
  id: number | string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  images: string[];
  description?: string;
}

export default function ProductJsonLd({ product }: { product: ProductJsonLdProps }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: `NH-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'HomeSpace',
    },
    offers: {
      '@type': 'Offer',
      url: `https://homespace.ge/product/${product.slug}`,
      priceCurrency: 'GEL',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'HomeSpace.ge',
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
