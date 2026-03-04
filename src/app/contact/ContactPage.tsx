'use client';

import React from 'react';
import { Container, Row, Col, Form, Button, Breadcrumb, Card } from 'react-bootstrap';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>კონტაქტი</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="gy-5">
        <Col lg={5}>
          <h1 className="fw-bold mb-4">დაგვიკავშირდით</h1>
          <p className="text-muted mb-5">გაქვთ კითხვები ან გსურთ კონსულტაცია? მოგვწერეთ და ჩვენი გუნდი მალე დაგიკავშირდებათ.</p>

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
          width="100%" height="450"
          style={{ border: 0, borderRadius: '16px' }}
          allowFullScreen loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </Container>
  );
}
