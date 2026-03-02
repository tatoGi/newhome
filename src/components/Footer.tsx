import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer pt-5 pb-3">
      <Container>
        <Row className="gy-4">
          <Col lg={4}>
            <h4 className="mb-4 fw-bold">New<span className="text-primary">Home</span></h4>
            <p className="text-muted mb-4">
              თანამედროვე დიზაინის ავეჯი და განათება თქვენი კომფორტისთვის. ჩვენ ვქმნით გარემოს, სადაც თავს ბედნიერად იგრძნობთ.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-dark"><Facebook size={20} /></a>
              <a href="#" className="text-dark"><Instagram size={20} /></a>
              <a href="#" className="text-dark"><Linkedin size={20} /></a>
            </div>
          </Col>
          <Col lg={2} md={4}>
            <h6 className="fw-bold mb-4">ნავიგაცია</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none">ჩვენს შესახებ</Link></li>
              <li className="mb-2"><Link to="/products" className="text-muted text-decoration-none">პროდუქცია</Link></li>
              <li className="mb-2"><Link to="/services" className="text-muted text-decoration-none">სერვისები</Link></li>
              <li className="mb-2"><Link to="/projects" className="text-muted text-decoration-none">პროექტები</Link></li>
            </ul>
          </Col>
          <Col lg={2} md={4}>
            <h6 className="fw-bold mb-4">კატეგორიები</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/products/lighting" className="text-muted text-decoration-none">განათება</Link></li>
              <li className="mb-2"><Link to="/products/furniture" className="text-muted text-decoration-none">ავეჯი</Link></li>
              <li className="mb-2"><Link to="/products/new" className="text-muted text-decoration-none">სიახლეები</Link></li>
              <li className="mb-2"><Link to="/products/sale" className="text-muted text-decoration-none">ფასდაკლებები</Link></li>
            </ul>
          </Col>
          <Col lg={4} md={4}>
            <h6 className="fw-bold mb-4">კონტაქტი</h6>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex gap-2 text-muted">
                <MapPin size={18} className="text-primary flex-shrink-0" />
                თბილისი, საქართველო
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
            <Link to="/privacy" className="text-muted small text-decoration-none">კონფიდენციალურობა</Link>
            <Link to="/terms" className="text-muted small text-decoration-none">წესები და პირობები</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
