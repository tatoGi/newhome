'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer pt-5 pb-3">
      <Container>
        <Row className="gy-4">
          <Col lg={4}>
            <div className="mb-4">
              <img src="/logo.png" alt="NewHome Logo" style={{ height: '100px', width: 'auto' }} />
            </div>
            <p className="text-muted mb-4">
              თანამედროვე დიზაინის ავეჯი და განათება თქვენი კომფორტისთვის. ჩვენ ვქმნით გარემოს, სადაც თავს ბედნიერად იგრძნობთ.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-dark" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="text-dark" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="text-dark" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </Col>

          <Col lg={2} md={4}>
            <h3 className="fw-bold mb-4 fs-6">ნავიგაცია</h3>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/about" className="text-muted text-decoration-none">ჩვენს შესახებ</Link></li>
              <li className="mb-2"><Link href="/products" className="text-muted text-decoration-none">პროდუქცია</Link></li>
              <li className="mb-2"><Link href="/services" className="text-muted text-decoration-none">სერვისები</Link></li>
              <li className="mb-2"><Link href="/projects" className="text-muted text-decoration-none">პროექტები</Link></li>
            </ul>
          </Col>

          <Col lg={2} md={4}>
            <h3 className="fw-bold mb-4 fs-6">კატეგორიები</h3>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/products/lighting" className="text-muted text-decoration-none">განათება</Link></li>
              <li className="mb-2"><Link href="/products/furniture" className="text-muted text-decoration-none">ავეჯი</Link></li>
              <li className="mb-2"><Link href="/products/new" className="text-muted text-decoration-none">სიახლეები</Link></li>
              <li className="mb-2"><Link href="/products/sale" className="text-muted text-decoration-none">ფასდაკლებები</Link></li>
            </ul>
          </Col>

          <Col lg={4} md={4}>
            <h3 className="fw-bold mb-4 fs-6">კონტაქტი</h3>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex gap-2 text-muted">
                <MapPin size={18} className="text-primary flex-shrink-0" />
                თბილისი, ი. ჭავჭავაძის გამზირი 37
              </li>
              <li className="mb-3 d-flex gap-2 text-muted">
                <Phone size={18} className="text-primary flex-shrink-0" />
                +995 555 12 34 56
              </li>
              <li className="mb-3 d-flex gap-2 text-muted">
                <Mail size={18} className="text-primary flex-shrink-0" />
                info@newhome.ge
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="text-muted small mb-0">© 2026 NewHome. ყველა უფლება დაცულია.</p>
          <div className="d-flex gap-4">
            <Link href="/privacy" className="text-muted small text-decoration-none">კონფიდენციალურობა</Link>
            <Link href="/terms" className="text-muted small text-decoration-none">წესები და პირობები</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
