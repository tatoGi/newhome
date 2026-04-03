'use client';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { allProducts } from '@/lib/data';
import { ProductRelation } from '@/lib/api/types';
import { useBootstrap } from '@/context/BootstrapContext';
import { toBackendAssetUrl } from '@/lib/api/assets';

function resolveProductImage(p: ProductRelation): string {
  const galleryBlock = p.blocks?.find((b) => b.type === 'product_gallery');
  const images: unknown[] = galleryBlock?.data?.product_images ?? [];
  const first = Array.isArray(images) && images.length > 0 ? String(images[0]) : '';
  return toBackendAssetUrl(first || p.feature_image || '') || '/placeholder.jpg';
}

interface FeaturedProductsSectionProps {
  products?: ProductRelation[];
}

export default function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const { routeMap } = useBootstrap();
  const productsPage = routeMap?.find((r) => r.template === 'products' || r.template === 'shop');
  const allProductsHref = productsPage ? `/${productsPage.slug}` : '/products';

  const items = products && products.length > 0
    ? products.map((p) => ({ id: p.id, name: p.title, price: p.price, image: resolveProductImage(p), category: p.category, slug: p.slug }))
    : allProducts.slice(0, 4);

  return (
    <section className="py-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="d-flex justify-content-between align-items-end mb-4"
        >
          <div>
            <h2 className="fw-bold mb-2">რჩეული პროდუქცია</h2>
            <p className="text-muted mb-0">აღმოაჩინეთ ჩვენი ყველაზე პოპულარული მოდელები</p>
          </div>
          <Button as={Link as any} href={allProductsHref} variant="link" className="text-primary text-decoration-none d-flex align-items-center gap-2">
            ყველას ნახვა <ArrowRight size={18} />
          </Button>
        </motion.div>
        <Row className="gy-4">
          {items.map((product, index) => (
            <Col key={product.id} sm={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
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
