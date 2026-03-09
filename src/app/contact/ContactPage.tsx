'use client';

import React from 'react';
import { Container, Row, Col, Form, Button, Breadcrumb, Card } from 'react-bootstrap';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Block } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';

interface ContactPageProps {
  pageTitle?: string;
  pageDescription?: string;
  blocks?: Block[];
}

export default function ContactPage({ pageTitle, pageDescription, blocks }: ContactPageProps) {
  const heroBlock = [...(blocks ?? [])]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .find((block) => block.type === 'page_hero' || block.type === 'main_banner' || block.type === 'banner');

  const heroTitle = String(heroBlock?.data?.banner_title ?? heroBlock?.data?.title ?? pageTitle ?? 'კონტაქტი');
  const heroDescription = String(
    heroBlock?.data?.banner_desc ??
    heroBlock?.data?.banner_description ??
    heroBlock?.data?.description ??
    pageDescription ??
    ''
  );
  const heroImage = toBackendAssetUrl(heroBlock?.data?.banner_image ?? heroBlock?.data?.image ?? '');

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
            {heroDescription ? <p className="mb-0 opacity-75" style={{ maxWidth: '720px' }}>{heroDescription}</p> : null}
          </div>
        </div>
      ) : null}

      <Row className="gy-5">
        <Col lg={5}>
          <h1 className="fw-bold mb-4">{heroTitle}</h1>
          {heroDescription ? <p className="text-muted mb-5">{heroDescription}</p> : null}

          {[
            { icon: <MapPin size={24} />, title: 'მისამართი', text: 'თბილისი, ი. ჭავჭავაძის გამზირი 37' },
            { icon: <Phone size={24} />, title: 'ტელეფონი', text: '+995 555 12 34 56' },
            { icon: <Mail size={24} />, title: 'ელ-ფოსტა', text: 'info@newhome.ge' },
            { icon: <Clock size={24} />, title: 'სამუშაო საათები', text: 'ორშაბათი - შაბათი: 10:00 - 19:00' },
          ].map((item, i) => (
            <div key={i} className="mb-4 d-flex gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary" style={{ height: 'fit-content' }}>
                {item.icon}
              </div>
              <div>
                <h6 className="fw-bold mb-1">{item.title}</h6>
                <p className="text-muted mb-0">{item.text}</p>
              </div>
            </div>
          ))}
        </Col>

        <Col lg={7}>
          <Card className="border-0 shadow-sm p-4 p-md-5">
            <h3 className="fw-bold mb-4">მოგვწერეთ შეტყობინება</h3>
            <Form>
              <Row className="gy-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>სახელი და გვარი</Form.Label>
                    <Form.Control type="text" placeholder="თქვენი სახელი" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>ელ-ფოსტა</Form.Label>
                    <Form.Control type="email" placeholder="example@mail.com" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>ტელეფონი</Form.Label>
                    <Form.Control type="tel" placeholder="+995" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>შეტყობინება</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="როგორ შეგვიძლია დაგეხმაროთ?" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Button variant="primary" size="lg" className="w-100 mt-3">გაგზავნა</Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      <div className="mt-5 pt-5">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m2!1m1!1s0x40440cd7e64f6241%3A0x400cc4259978273!2sTbilisi!5e0!3m2!1sen!2sge!4v1710000000000!5m2!1sen!2sge"
          width="100%"
          height="450"
          style={{ border: 0, borderRadius: '16px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Container>
  );
}
