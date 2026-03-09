'use client';

import React from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { ShoppingCart, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toBackendAssetUrl } from '@/lib/api/assets';

const CartDrawer: React.FC<{ show: boolean; onHide: () => void }> = ({ show, onHide }) => {
  const { cart, removeFromCart, updateQuantity } = useApp();
  const router = useRouter();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>კალათა</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {cart.length === 0 ? (
          <div className="text-center py-5">
            <ShoppingCart size={48} className="text-muted mb-3" />
            <p>კალათა ცარიელია</p>
            <Button variant="outline-primary" onClick={onHide}>საყიდლებზე დაბრუნება</Button>
          </div>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto">
              {cart.map((item) => (
                <div key={item.id} className="d-flex gap-3 mb-4 border-bottom pb-3">
                  <img src={toBackendAssetUrl(item.image)} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover' }} className="rounded" />
                  <div className="flex-grow-1">
                    <h6 className="mb-1 small">{item.name}</h6>
                    <p className="text-muted small mb-2">{item.price} ₾</p>
                    <div className="d-flex align-items-center gap-2">
                      <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                      <Button size="sm" variant="link" className="text-danger ms-auto p-0" onClick={() => removeFromCart(item.id)}>
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-top">
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">ჯამი:</span>
                <span className="fw-bold">{total} ₾</span>
              </div>
              <Button variant="primary" className="w-100 py-2 mb-2" onClick={() => { onHide(); router.push('/checkout'); }}>
                გაფორმება
              </Button>
              <Button variant="outline-secondary" className="w-100 py-2" onClick={() => { onHide(); router.push('/cart'); }}>
                კალათის ნახვა
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartDrawer;
