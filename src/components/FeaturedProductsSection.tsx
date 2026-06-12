'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductRelation } from '@/lib/api/types';
import { useBootstrap, useFallbackLogo } from '@/context/BootstrapContext';
import { resolveImageOrFallback } from '@/lib/api/assets';
import { getUiText } from '@/lib/i18n/ui';

function resolveProductImage(p: ProductRelation, fallbackLogo: string): string {
  const galleryBlock = p.blocks?.find((b) => b.type === 'product_gallery');
  const images: unknown[] = galleryBlock?.data?.images ?? galleryBlock?.data?.product_images ?? [];
  const first = Array.isArray(images) && images.length > 0 ? String(images[0]) : '';
  return resolveImageOrFallback(first || p.feature_image || '', fallbackLogo);
}

interface FeaturedProductsSectionProps {
  products?: ProductRelation[];
  title?: string;
  subtitle?: string;
}

export default function FeaturedProductsSection({ products, title, subtitle }: FeaturedProductsSectionProps) {
  const { routeMap, locale } = useBootstrap();
  const fallbackLogo = useFallbackLogo();
  const productsPage = routeMap?.find((r) => r.template === 'products' || r.template === 'shop');
  const allProductsHref = productsPage ? `/${productsPage.slug}` : '/products';

  if (!products || products.length === 0) return null;

  const resolvedTitle = title || getUiText(locale, 'featured_products.title');
  const resolvedSubtitle = subtitle || getUiText(locale, 'featured_products.subtitle');
  const viewAllLabel = getUiText(locale, 'featured_products.view_all');

  const items = products.map((p) => ({
    id: p.id,
    name: p.title,
    price: p.price,
    image: resolveProductImage(p, fallbackLogo),
    category: p.category,
    slug: p.slug,
    featured: p.is_featured,
    sale: p.on_sale,
    oldPrice: p.old_price ?? undefined,
    colors: p.colors ?? [],
  }));

  return (
    <section className="py-5 bg-light">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-end gap-3 mb-5"
        >
          <div>
            <span className="text-uppercase fw-bold text-accent mb-2 d-inline-block small" style={{ letterSpacing: '0.15em', fontSize: '0.72rem' }}>
              {locale === 'ka' ? 'რჩეული კოლექცია' : 'FEATURED COLLECTION'}
            </span>
            <h2 className="fw-bold mb-2 text-primary display-6" style={{ fontFamily: '"Noto Serif Georgian", serif' }}>{resolvedTitle}</h2>
            <p className="text-muted mb-0 fs-6" style={{ maxWidth: '600px' }}>{resolvedSubtitle}</p>
          </div>
          <Button
            as={Link as any}
            href={allProductsHref}
            className="btn-outline-primary-custom d-inline-flex align-items-center justify-content-center gap-2 px-3 px-md-4 py-2 rounded-pill fw-semibold text-decoration-none align-self-start align-self-sm-auto text-nowrap small"
          >
            {viewAllLabel} <ArrowRight size={16} className="arrow-icon" />
          </Button>
        </motion.div>
        <Row className="gy-4">
          {items.map((product, index) => (
            <Col key={product.id} sm={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-100"
              >
                <ProductCard product={product as any} />
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
