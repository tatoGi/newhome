'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';

interface AuthPanelProps {
  initialMode?: 'login' | 'register';
  variant?: 'page' | 'modal';
  onAuthenticated?: () => void;
}

export default function AuthPanel({
  initialMode = 'login',
  variant = 'page',
  onAuthenticated,
}: AuthPanelProps) {
  const { user, isLoading, login, register, updateProfile, logout } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await login({
        email: String(formData.get('email') || ''),
        password: String(formData.get('password') || ''),
      });
      setSuccess('სისტემაში შესვლა წარმატებით შესრულდა.');
      onAuthenticated?.();
    } catch {
      setError('შესვლა ვერ შესრულდა. გადაამოწმეთ ელფოსტა და პაროლი.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await register({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        address: String(formData.get('address') || ''),
        password: String(formData.get('password') || ''),
        password_confirmation: String(formData.get('password_confirmation') || ''),
      });
      setSuccess('ანგარიში წარმატებით შეიქმნა.');
      onAuthenticated?.();
    } catch {
      setError('რეგისტრაცია ვერ შესრულდა. გადაამოწმეთ შევსებული ველები.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await updateProfile({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        address: String(formData.get('address') || ''),
      });
      setSuccess('პროფილი განახლდა.');
    } catch {
      setError('პროფილის განახლება ვერ შესრულდა.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const panelClassName = variant === 'modal' ? 'auth-panel auth-panel-modal' : 'auth-panel auth-panel-page';

  if (isLoading) {
    return (
      <div className={`${panelClassName} py-5 text-center`}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className={panelClassName}>
      <div className={`mb-4 ${variant === 'modal' ? 'text-center' : ''}`}>
        <h2 className={variant === 'modal' ? 'h4 mb-2' : 'h3 mb-2'}>პირადი კაბინეტი</h2>
        {user ? (
          <p className="text-muted mb-0">აქ შეინახავთ თქვენს საკონტაქტო და მისამართის მონაცემებს შეკვეთებისთვის.</p>
        ) : null}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {user ? (
        <form onSubmit={handleProfileUpdate}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>სახელი და გვარი</Form.Label>
              <Form.Control name="name" defaultValue={user.name} required />
            </Col>
            <Col md={6}>
              <Form.Label>ელფოსტა</Form.Label>
              <Form.Control name="email" type="email" defaultValue={user.email} required />
            </Col>
            <Col md={6}>
              <Form.Label>ტელეფონი</Form.Label>
              <Form.Control name="phone" defaultValue={user.phone} required />
            </Col>
            <Col xs={12}>
              <Form.Label>მისამართი</Form.Label>
              <Form.Control as="textarea" rows={variant === 'modal' ? 2 : 3} name="address" defaultValue={user.address} required />
            </Col>
          </Row>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'ინახება...' : 'შენახვა'}
            </Button>
            <Button variant="outline-secondary" type="button" onClick={() => logout()}>
              გასვლა
            </Button>
            {variant === 'modal' ? (
              <Link href="/account" className="btn btn-link px-0 text-decoration-none">
                სრული პროფილი
              </Link>
            ) : null}
          </div>
        </form>
      ) : (
        <div className={variant === 'modal' ? 'auth-entry auth-entry-modal' : 'auth-entry'}>
          <div className="auth-form-shell">
            {mode === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="auth-form-heading mb-4">
                  <h3 className="h5 mb-2">შედით თქვენს ანგარიშში</h3>
                  {variant === 'page' ? (
                    <p className="text-muted mb-0">შეიყვანეთ ელფოსტა და პაროლი.</p>
                  ) : null}
                </div>

                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Label>ელფოსტა</Form.Label>
                    <Form.Control name="email" type="email" required />
                  </Col>
                  <Col xs={12}>
                    <Form.Label>პაროლი</Form.Label>
                    <Form.Control name="password" type="password" required />
                  </Col>
                </Row>
                <Button className="mt-4 auth-submit-button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'იტვირთება...' : 'შესვლა'}
                </Button>
                <div className="auth-inline-switch">
                  <span className="text-muted">არ გაქვთ ანგარიში?</span>
                  <button
                    type="button"
                    className="btn btn-link auth-inline-switch-link"
                    onClick={() => {
                      setMode('register');
                      resetMessages();
                    }}
                  >
                    შექმენი
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="auth-form-heading mb-4">
                  <h3 className="h5 mb-2">შექმენით ახალი ანგარიში</h3>
                  {variant === 'page' ? (
                    <p className="text-muted mb-0">შეავსეთ ძირითადი ინფორმაცია და დაასრულეთ რეგისტრაცია.</p>
                  ) : null}
                </div>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>სახელი და გვარი</Form.Label>
                    <Form.Control name="name" required />
                  </Col>
                  <Col md={6}>
                    <Form.Label>ელფოსტა</Form.Label>
                    <Form.Control name="email" type="email" required />
                  </Col>
                  <Col md={6}>
                    <Form.Label>ტელეფონი</Form.Label>
                    <Form.Control name="phone" required />
                  </Col>
                  <Col xs={12}>
                    <Form.Label>მისამართი</Form.Label>
                    <Form.Control as="textarea" rows={variant === 'modal' ? 2 : 3} name="address" required />
                  </Col>
                  <Col md={6}>
                    <Form.Label>პაროლი</Form.Label>
                    <Form.Control name="password" type="password" required />
                  </Col>
                  <Col md={6}>
                    <Form.Label>გაიმეორეთ პაროლი</Form.Label>
                    <Form.Control name="password_confirmation" type="password" required />
                  </Col>
                </Row>
                <Button className="mt-4 auth-submit-button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'იქმნება...' : 'რეგისტრაცია'}
                </Button>
                <div className="auth-inline-switch">
                  <span className="text-muted">უკვე გაქვთ ანგარიში?</span>
                  <button
                    type="button"
                    className="btn btn-link auth-inline-switch-link"
                    onClick={() => {
                      setMode('login');
                      resetMessages();
                    }}
                  >
                    შესვლა
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
