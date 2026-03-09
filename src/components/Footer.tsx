'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MapPin } from 'lucide-react';
import { useBootstrap } from '@/context/BootstrapContext';
import { toBackendAssetUrl } from '@/lib/api/assets';

const Footer: React.FC = () => {
  const { navigation, settings } = useBootstrap();
  const footerLogo = toBackendAssetUrl(settings.footerLogo) || '/logo.png';
  const contactText = settings.footerContactText?.trim() || '';

  return (
    <footer className="footer pt-5 pb-3">
      <Container>
        <Row className="gy-4">
          <Col lg={4}>
            <div className="mb-4">
              <img src={footerLogo} alt="NewHome Logo" style={{ height: '100%', width: '100%', maxWidth: '220px' }} />
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

          <Col lg={4} md={8}>
            <h3 className="fw-bold mb-4 fs-6">ნავიგაცია</h3>
            <ul className="list-unstyled row g-2">
              {navigation.footer.map((item) => (
                <li key={item.url} className="col-6 mb-2">
                  <Link href={item.url} className="text-muted text-decoration-none">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={4} md={4}>
            <h3 className="fw-bold mb-4 fs-6">კონტაქტი</h3>
            {contactText !== '' ? (
              <div className="d-flex gap-2 text-muted" style={{ whiteSpace: 'pre-line' }}>
                <MapPin size={18} className="text-primary flex-shrink-0 mt-1" />
                <span>{contactText}</span>
              </div>
            ) : null}
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
