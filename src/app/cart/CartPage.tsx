'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api/client';
import { slugify } from '@/lib/slugify';
import { toBackendAssetUrl } from '@/lib/api/assets';

export default function CartPage() {
  const searchParams = useSearchParams();
  const { cart, removeFromCart, updateQuantity, refreshCart } = useApp();
  const { token } = useAuth();
  const [checkoutMessage, setCheckoutMessage] = useState<{ variant: 'success' | 'danger' | 'warning'; text: string; } | null>(null);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout_status');
    const orderId = searchParams.get('order_id');
    const externalOrderId = searchParams.get('external_order_id');

    if (!checkoutStatus || !token || (!orderId && !externalOrderId)) {
      return;
    }

    api.getCheckoutResult(token, { order_id: orderId, external_order_id: externalOrderId })
      .then(async (response) => {
        await refreshCart();

        const status = response.payment.status.toLowerCase();
        if (['completed', 'approved', 'succeeded'].includes(status)) {
          setCheckoutMessage({
            variant: 'success',
            text: response.payment.save_card_requested
              ? 'გადახდა წარმატებით დასრულდა და ბარათი დამახსოვრდა.'
              : 'გადახდა წარმატებით დასრულდა.',
          });
          return;
        }

        if (['failed', 'rejected', 'cancelled', 'error'].includes(status)) {
          setCheckoutMessage({
            variant: 'danger',
            text: 'გადახდა ვერ შესრულდა. გთხოვთ სცადოთ ხელახლა.',
          });
          return;
        }

        setCheckoutMessage({
          variant: 'warning',
          text: 'გადახდის სტატუსი ჯერ მუშავდება. გვერდი განაახლეთ რამდენიმე წამში.',
        });
      })
      .catch(() => {
        setCheckoutMessage({
          variant: 'warning',
          text: 'გადახდის შედეგის დადასტურება ვერ მოხერხდა.',
        });
      });
  }, [refreshCart, searchParams, token]);

  return (
    <Container className="py-5">
      {checkoutMessage ? (
        <Alert variant={checkoutMessage.variant} className="rounded-4 mb-4">
          {checkoutMessage.text}
        </Alert>
      ) : null}

      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div>
          <h1 className="mb-2">კალათა</h1>
          <p className="text-muted mb-0">არჩეული პროდუქტები და რაოდენობები.</p>
        </div>
        <Link href="/products" className="btn btn-outline-secondary">
          პროდუქციის ნახვა
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-5 rounded-4 border bg-light-subtle">
          <ShoppingCart size={44} className="text-muted mb-3" />
          <h2 className="h5 mb-2">კალათა ცარიელია</h2>
          <p className="text-muted mb-4">დაამატეთ პროდუქტები მთავარი გვერდიდან ან კატალოგიდან.</p>
          <Link href="/products" className="btn btn-primary">
            პროდუქციის ნახვა
          </Link>
        </div>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              {cart.map((item) => (
                <div key={item.id} className="border rounded-4 p-3 p-md-4 bg-white shadow-sm">
                  <div className="d-flex gap-3 align-items-start">
                    <Link href={item.slug ? `/product/${slugify(item.slug)}` : '/products'} className="flex-shrink-0">
                      <img
                        src={toBackendAssetUrl(item.image)}
                        alt={item.name}
                        className="rounded-4"
                        style={{ width: 120, height: 120, objectFit: 'cover' }}
                      />
                    </Link>

                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between gap-3 flex-wrap">
                        <div>
                          <h2 className="h5 mb-1">{item.name}</h2>
                          <p className="text-muted small mb-2">{item.category}</p>
                          <div className="fw-semibold">{item.price} ₾</div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="კალათიდან წაშლა"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
                        <div className="d-inline-flex align-items-center border rounded-pill overflow-hidden">
                          <button type="button" className="btn btn-link text-dark text-decoration-none px-3" onClick={() => updateQuantity(item.id, -1)}>
                            -
                          </button>
                          <span className="px-3 fw-semibold">{item.quantity}</span>
                          <button type="button" className="btn btn-link text-dark text-decoration-none px-3" onClick={() => updateQuantity(item.id, 1)}>
                            +
                          </button>
                        </div>

                        <div className="fw-bold">{item.price * item.quantity} ₾</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            <div className="border rounded-4 p-4 bg-white shadow-sm">
              <h2 className="h5 mb-3">შეჯამება</h2>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">პროდუქტები</span>
                <span>{cart.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-muted">ჯამი</span>
                <span className="fw-bold">{total} ₾</span>
              </div>
              <Link href="/checkout" className="btn btn-primary w-100">
                შეკვეთის გაგრძელება
              </Link>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}
