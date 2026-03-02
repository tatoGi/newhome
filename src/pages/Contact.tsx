import React from 'react';
import { Container, Row, Col, Form, Button, Breadcrumb, Card } from 'react-bootstrap';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>კონტაქტი</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="gy-5">
        <Col lg={5}>
          <h1 className="fw-bold mb-4">დაგვიკავშირდით</h1>
          <p className="text-muted mb-5">
            გაქვთ კითხვები ან გსურთ კონსულტაცია? მოგვწერეთ და ჩვენი გუნდი მალე დაგიკავშირდებათ.
          </p>

          <div className="mb-4 d-flex gap-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary h-fit">
              <MapPin size={24} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">მისამართი</h6>
              <p className="text-muted mb-0">თბილისი, ი. ჭავჭავაძის გამზირი 37</p>
            </div>
          </div>

          <div className="mb-4 d-flex gap-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary h-fit">
              <Phone size={24} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">ტელეფონი</h6>
              <p className="text-muted mb-0">+995 555 12 34 56</p>
            </div>
          </div>

          <div className="mb-4 d-flex gap-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary h-fit">
              <Mail size={24} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">ელ-ფოსტა</h6>
              <p className="text-muted mb-0">info@newhome.ge</p>
            </div>
          </div>

          <div className="mb-4 d-flex gap-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary h-fit">
              <Clock size={24} />
            </div>
            <div>
              <h6 className="fw-bold mb-1">სამუშაო საათები</h6>
              <p className="text-muted mb-0">ორშაბათი - შაბათი: 10:00 - 19:00</p>
            </div>
          </div>
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
        ></iframe>
      </div>
    </Container>
  );
};

export default Contact;
