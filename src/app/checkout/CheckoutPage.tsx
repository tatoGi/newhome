'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, Star, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api/client';
import { SavedCard } from '@/lib/api/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token, openAuthModal } = useAuth();
  const { cart, isCartLoading } = useApp();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    save_card: false,
  });

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      router.replace('/cart');
      return;
    }

    setFormState({
      customer_name: user.name || '',
      customer_email: user.email || '',
      customer_phone: user.phone || '',
      delivery_address: user.address || '',
      save_card: false,
    });
  }, [openAuthModal, router, user]);

  useEffect(() => {
    if (!token) {
      setSavedCards([]);
      setSelectedCardId(null);
      setIsCardsLoading(false);
      return;
    }

    setIsCardsLoading(true);

    api.getCheckoutSummary(token)
      .then((response) => {
        setSavedCards(response.cards);
        setSelectedCardId(response.cards.find((card) => card.is_default)?.id ?? response.cards[0]?.id ?? null);
      })
      .catch(() => {
        setSavedCards([]);
        setSelectedCardId(null);
      })
      .finally(() => {
        setIsCardsLoading(false);
      });
  }, [token]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!token) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.startCheckout(token, {
        customer_name: formState.customer_name,
        customer_email: formState.customer_email,
        customer_phone: formState.customer_phone,
        delivery_address: formState.delivery_address,
        save_card: formState.save_card,
      });

      window.location.href = response.redirect_url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout ვერ შესრულდა.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavedCardCheckout = async () => {
    if (!token || !selectedCardId) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.startSavedCardCheckout(token, { card_id: selectedCardId });
      window.location.href = response.redirect_url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'ბარათით გადახდა ვერ შესრულდა.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefaultCard = async (cardId: number) => {
    if (!token) {
      return;
    }

    const response = await api.setDefaultSavedCard(token, cardId);
    setSavedCards(response.cards);
    setSelectedCardId(cardId);
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!token) {
      return;
    }

    const response = await api.deleteSavedCard(token, cardId);
    setSavedCards(response.cards);
    setSelectedCardId(response.cards.find((card) => card.is_default)?.id ?? response.cards[0]?.id ?? null);
  };

  if (isCartLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="rounded-4">
          checkout-ის გასაგრძელებლად გთხოვთ გაიაროთ ავტორიზაცია.
        </Alert>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center py-5 rounded-4 border bg-light-subtle">
          <h1 className="h4 mb-3">კალათა ცარიელია</h1>
          <p className="text-muted mb-4">checkout-ისთვის ჯერ დაამატეთ პროდუქტი.</p>
          <Link href="/products" className="btn btn-primary">
            პროდუქციის ნახვა
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div>
          <h1 className="mb-2">შეკვეთის გაფორმება</h1>
          <p className="text-muted mb-0">შეავსეთ საკონტაქტო მონაცემები ან გამოიყენეთ შენახული ბარათი.</p>
        </div>
        <Link href="/cart" className="btn btn-outline-secondary">
          კალათაში დაბრუნება
        </Link>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <div className="checkout-card-surface border rounded-4 p-4 bg-white shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <CreditCard size={18} className="text-primary" />
                  <h2 className="h5 mb-0">შენახული ბარათები</h2>
                </div>
                <p className="text-muted mb-0">თუ ადრე შეინახეთ ბარათი, აქედან სწრაფად გადაიხდით.</p>
              </div>
              {savedCards.length > 0 ? <Badge bg="light" text="dark">{savedCards.length} ბარათი</Badge> : null}
            </div>

            {isCardsLoading ? (
              <div className="py-3 text-center">
                <Spinner animation="border" size="sm" />
              </div>
            ) : savedCards.length === 0 ? (
              <div className="checkout-empty-state">
                <ShieldCheck size={20} className="text-primary" />
                <span>შენახული ბარათი ჯერ არ გაქვთ. მონიშნეთ "ბარათის დამახსოვრება" პირველ გადახდაზე.</span>
              </div>
            ) : (
              <>
                <div className="d-flex flex-column gap-3">
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className={`saved-card-item ${selectedCardId === card.id ? 'is-selected' : ''}`}
                    >
                      <label className="saved-card-main">
                        <input
                          type="radio"
                          name="saved_card"
                          checked={selectedCardId === card.id}
                          onChange={() => setSelectedCardId(card.id)}
                        />
                        <div className="saved-card-copy">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <strong>{card.card_mask || '**** **** ****'}</strong>
                            <span className="text-muted small">{card.card_brand || card.card_type || 'ბარათი'}</span>
                            {card.is_default ? <Badge bg="dark">ძირითადი</Badge> : null}
                          </div>
                          <div className="small text-muted">
                            ვადა: {card.formatted_expiry || '--/--'}
                            {card.card_holder_name ? ` • ${card.card_holder_name}` : ''}
                          </div>
                        </div>
                      </label>

                      <div className="saved-card-actions">
                        {!card.is_default ? (
                          <button type="button" className="btn btn-link btn-sm" onClick={() => void handleSetDefaultCard(card.id)}>
                            <Star size={14} className="me-1" />
                            ძირითადად დაყენება
                          </button>
                        ) : null}
                        <button type="button" className="btn btn-link btn-sm text-danger" onClick={() => void handleDeleteCard(card.id)}>
                          <Trash2 size={14} className="me-1" />
                          წაშლა
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline-dark"
                  className="mt-3"
                  onClick={() => void handleSavedCardCheckout()}
                  disabled={isSubmitting || !selectedCardId}
                >
                  {isSubmitting ? 'იტვირთება...' : 'შენახული ბარათით გადახდა'}
                </Button>
              </>
            )}
          </div>

          <div className="border rounded-4 p-4 bg-white shadow-sm">
            {error ? <Alert variant="danger">{error}</Alert> : null}

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>სახელი და გვარი</Form.Label>
                  <Form.Control
                    value={formState.customer_name}
                    onChange={(event) => setFormState((current) => ({ ...current, customer_name: event.target.value }))}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>ელფოსტა</Form.Label>
                  <Form.Control
                    type="email"
                    value={formState.customer_email}
                    onChange={(event) => setFormState((current) => ({ ...current, customer_email: event.target.value }))}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>ტელეფონი</Form.Label>
                  <Form.Control
                    value={formState.customer_phone}
                    onChange={(event) => setFormState((current) => ({ ...current, customer_phone: event.target.value }))}
                    required
                  />
                </Col>
                <Col xs={12}>
                  <Form.Label>მისამართი</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formState.delivery_address}
                    onChange={(event) => setFormState((current) => ({ ...current, delivery_address: event.target.value }))}
                    required
                  />
                </Col>
                <Col xs={12}>
                  <Form.Check
                    id="save-card"
                    type="checkbox"
                    label="ბარათის დამახსოვრება შემდეგი გადახდებისთვის"
                    checked={formState.save_card}
                    onChange={(event) => setFormState((current) => ({ ...current, save_card: event.target.checked }))}
                  />
                </Col>
              </Row>

              <Button type="submit" className="mt-4 px-4" disabled={isSubmitting}>
                {isSubmitting ? 'იტვირთება...' : 'BOG გადახდაზე გადასვლა'}
              </Button>
            </Form>
          </div>
        </Col>

        <Col lg={5}>
          <div className="border rounded-4 p-4 bg-white shadow-sm">
            <h2 className="h5 mb-3">შეკვეთის შეჯამება</h2>
            <div className="d-flex flex-column gap-3">
              {cart.map((item) => (
                <div key={item.id} className="d-flex gap-3 align-items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded-3"
                    style={{ width: 64, height: 64, objectFit: 'cover' }}
                  />
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{item.name}</div>
                      <div className="small text-muted">{item.quantity} x {item.price} ₾</div>
                    </div>
                  <div className="fw-semibold">{item.price * item.quantity} ₾</div>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">პროდუქტები</span>
              <span>{cart.length}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>ჯამი</span>
              <span>{total} ₾</span>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
