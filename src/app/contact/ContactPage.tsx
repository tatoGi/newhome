'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Alert, Breadcrumb, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { api } from '@/lib/api/client';
import { Block } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';

const LeafletContactMap = dynamic(() => import('@/components/LeafletContactMap'), {
  ssr: false,
  loading: () => (
    <div
      className="d-flex align-items-center justify-content-center rounded-4 border bg-light text-muted"
      style={{ minHeight: '420px' }}
    >
      რუკა იტვირთება...
    </div>
  ),
});

interface ContactPageProps {
  pageTitle?: string;
  pageDescription?: string;
  blocks?: Block[];
}

type ContactInfoKind = 'address' | 'phone' | 'email' | 'hours';

type ContactInfoItem = {
  label: string;
  text: string;
  kind: ContactInfoKind;
};

const DEFAULT_CONTACT_ITEMS: ContactInfoItem[] = [
  { kind: 'address', label: 'მისამართი', text: 'თბილისი, ი. ჭავჭავაძის გამზირი 37' },
  { kind: 'phone', label: 'ტელეფონი', text: '+995 555 12 34 56' },
  { kind: 'email', label: 'ელ-ფოსტა', text: 'info@newhome.ge' },
  { kind: 'hours', label: 'სამუშაო საათები', text: 'ორშაბათი - შაბათი: 10:00 - 19:00' },
];

function contactIcon(kind: ContactInfoKind) {
  switch (kind) {
    case 'address':
      return <MapPin size={24} />;
    case 'phone':
      return <Phone size={24} />;
    case 'hours':
      return <Clock size={24} />;
    default:
      return <Mail size={24} />;
  }
}

function inferContactKind(label: string): ContactInfoKind {
  const normalized = label.toLowerCase();

  if (
    normalized.includes('მისამართ') ||
    normalized.includes('address') ||
    normalized.includes('location')
  ) {
    return 'address';
  }

  if (
    normalized.includes('ტელეფონ') ||
    normalized.includes('phone') ||
    normalized.includes('mobile')
  ) {
    return 'phone';
  }

  if (
    normalized.includes('საათ') ||
    normalized.includes('სამუშაო') ||
    normalized.includes('hour') ||
    normalized.includes('time')
  ) {
    return 'hours';
  }

  return 'email';
}

function resolveContactItems(blocks?: Block[]): ContactInfoItem[] {
  const processBlocks = [...(blocks ?? [])]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .filter((block) => block.type === 'process_steps' || block.type === 'page_process');

  const itemsByKind = new Map<ContactInfoKind, ContactInfoItem>();
  const seen = new Set<string>();

  const pushItem = (label?: unknown, text?: unknown) => {
    const normalizedLabel = String(label ?? '').trim();
    const normalizedText = String(text ?? '').trim();

    if (!normalizedLabel || !normalizedText) {
      return;
    }

    const key = `${normalizedLabel}::${normalizedText}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    const item: ContactInfoItem = {
      label: normalizedLabel,
      text: normalizedText,
      kind: inferContactKind(normalizedLabel),
    };

    if (!itemsByKind.has(item.kind)) {
      itemsByKind.set(item.kind, item);
    }
  };

  processBlocks.forEach((block) => {
    const steps = Array.isArray(block.data?.steps) ? block.data.steps : [];

    if (steps.length > 0) {
      steps.forEach((step: Record<string, unknown>) => {
        pushItem(step.title ?? step.label, step.description ?? step.value);
      });

      return;
    }

    pushItem(
      block.data?.contact_info ?? block.data?.contact_ifno ?? block.data?.title,
      block.data?.value ?? block.data?.description,
    );
  });

  const resolvedItems = DEFAULT_CONTACT_ITEMS.map((fallbackItem) => itemsByKind.get(fallbackItem.kind) ?? fallbackItem);
  const hasRealCmsCoverage = itemsByKind.size > 0;

  return hasRealCmsCoverage ? resolvedItems : DEFAULT_CONTACT_ITEMS;
}

export default function ContactPage({ pageTitle, pageDescription, blocks }: ContactPageProps) {
  const sortedBlocks = [...(blocks ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const heroBlock = sortedBlocks.find((block) => block.type === 'page_hero' || block.type === 'main_banner' || block.type === 'banner');

  const heroTitle = String(heroBlock?.data?.banner_title ?? heroBlock?.data?.title ?? pageTitle ?? 'კონტაქტი');
  const heroDescription = String(
    heroBlock?.data?.banner_desc ??
    heroBlock?.data?.banner_description ??
    heroBlock?.data?.description ??
    pageDescription ??
    '',
  );
  const heroImage = toBackendAssetUrl(heroBlock?.data?.banner_image ?? heroBlock?.data?.image ?? '');
  const contactItems = resolveContactItems(sortedBlocks);
  const addressItem = contactItems.find((item) => item.kind === 'address');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      const segments = pathname.split('/').filter(Boolean);

      const response = await api.submitContact({
        ...formData,
        locale: typeof document !== 'undefined' ? document.documentElement.lang : undefined,
        form_name: 'contact_page',
        page_slug: segments[segments.length - 1] ?? 'contact',
        page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      });

      setSubmitSuccess(response.message || 'შეტყობინება წარმატებით გაიგზავნა.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'შეტყობინების გაგზავნა ვერ მოხერხდა.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>{heroTitle}</Breadcrumb.Item>
      </Breadcrumb>

      {heroImage ? (
        <div
          className="position-relative overflow-hidden rounded-4 mb-5"
          style={{ minHeight: '260px', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.18))' }} />
          <div className="position-relative text-white d-flex flex-column justify-content-end h-100 p-4 p-md-5">
            <h1 className="fw-bold display-5 mb-2">{heroTitle}</h1>
            {heroDescription ? <div className="mb-0 opacity-75" style={{ maxWidth: '720px' }} dangerouslySetInnerHTML={{ __html: heroDescription }} /> : null}
          </div>
        </div>
      ) : null}

      <Row className="gy-5">
        <Col lg={5}>
          <h1 className="fw-bold mb-4">{heroTitle}</h1>
          {heroDescription ? <div className="text-muted mb-5" dangerouslySetInnerHTML={{ __html: heroDescription }} /> : null}

          {contactItems.map((item, index) => (
            <div key={`${item.label}-${index}`} className="mb-4 d-flex gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary" style={{ height: 'fit-content' }}>
                {contactIcon(item.kind)}
              </div>
              <div>
                <h6 className="fw-bold mb-1">{item.label}</h6>
                <div className="text-muted mb-0" dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
            </div>
          ))}
        </Col>

        <Col lg={7}>
          <Card className="border-0 shadow-sm p-4 p-md-5">
            <h3 className="fw-bold mb-4">მოგვწერეთ შეტყობინება</h3>
            {submitSuccess ? <Alert variant="success">{submitSuccess}</Alert> : null}
            {submitError ? <Alert variant="danger">{submitError}</Alert> : null}

            <Form onSubmit={handleSubmit}>
              <Row className="gy-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>სახელი და გვარი</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="თქვენი სახელი"
                      value={formData.name}
                      onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                      disabled={isSubmitting}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>ელ-ფოსტა</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                      disabled={isSubmitting}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>ტელეფონი</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="+995"
                      value={formData.phone}
                      onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                      disabled={isSubmitting}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>შეტყობინება</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="როგორ შეგვიძლია დაგეხმაროთ?"
                      value={formData.message}
                      onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                      disabled={isSubmitting}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Button variant="primary" size="lg" className="w-100 mt-3" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'იგზავნება...' : 'გაგზავნა'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      <div className="mt-5 pt-5">
        <LeafletContactMap address={addressItem?.text} title={heroTitle} />
      </div>
    </Container>
  );
}
