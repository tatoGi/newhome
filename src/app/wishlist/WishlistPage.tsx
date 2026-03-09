'use client';

import Link from 'next/link';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { slugify } from '@/lib/slugify';
import { toBackendAssetUrl } from '@/lib/api/assets';

export default function WishlistPage() {
  const { wishlist, addToCart, removeFromWishlist } = useApp();

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div>
          <h1 className="mb-2">სურვილების სია</h1>
          <p className="text-muted mb-0">შენახული პროდუქტები სწრაფი დაბრუნებისთვის.</p>
        </div>
        <Link href="/products" className="btn btn-outline-secondary">
          პროდუქციის ნახვა
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-5 rounded-4 border bg-light-subtle">
          <Heart size={44} className="text-muted mb-3" />
          <h2 className="h5 mb-2">სურვილების სია ცარიელია</h2>
          <p className="text-muted mb-4">დაამატეთ პროდუქტები heart აიქონიდან.</p>
          <Link href="/products" className="btn btn-primary">
            პროდუქციის ნახვა
          </Link>
        </div>
      ) : (
        <Row className="g-4">
          {wishlist.map((item) => (
            <Col key={item.id} sm={6} lg={4}>
              <div className="h-100 border rounded-4 p-3 bg-white shadow-sm d-flex flex-column">
                <Link href={item.slug ? `/product/${slugify(item.slug)}` : '/products'} className="text-decoration-none text-dark">
                  <img
                    src={toBackendAssetUrl(item.image)}
                    alt={item.name}
                    className="w-100 rounded-4 mb-3"
                    style={{ height: 260, objectFit: 'cover' }}
                  />
                  <h2 className="h5 mb-1">{item.name}</h2>
                </Link>
                <p className="text-muted small mb-2">{item.category}</p>
                <div className="fw-bold mb-4">{item.price} ₾</div>

                <div className="mt-auto d-flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-grow-1"
                    onClick={() => addToCart(item)}
                  >
                    <ShoppingCart size={16} className="me-2" />
                    კალათაში
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => removeFromWishlist(item.id)}
                    aria-label="სურვილებიდან წაშლა"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
