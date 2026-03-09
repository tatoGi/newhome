'use client';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Phone } from 'lucide-react';
import { Service } from '@/lib/data';

export default function ServiceDetailsPage({ service }: { service: Service }) {
  return (
    <div className="pb-5 bg-light min-vh-100">
      {/* Hero Banner */}
      <div className="position-relative d-flex align-items-center justify-content-center"
        style={{ height: '400px', backgroundImage: `url(${service.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.6 }} />
        <div className="position-relative z-1 text-center text-white px-3">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="display-4 fw-bold mb-3">{service.title}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>{service.desc}</motion.p>
        </div>
      </div>

      <Container className="mt-n4 position-relative z-2">
        <div className="bg-white p-4 p-md-5 rounded shadow-sm">
          <div className="mb-5 d-flex align-items-center text-muted small border-bottom pb-3">
            <Link href="/" className="text-muted text-decoration-none hover-primary">მთავარი</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/services" className="text-muted text-decoration-none hover-primary">სერვისები</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-dark fw-medium">{service.title}</span>
          </div>

          <Row className="gy-5">
            <Col lg={7}>
              <h2 className="fw-bold mb-4">მომსახურების შესახებ</h2>
              <p className="text-muted lh-lg fs-5 mb-5" style={{ textAlign: 'justify' }}>{service.fullDesc}</p>

              <h3 className="fw-bold mb-4 mt-5">რას მოიცავს სერვისი?</h3>
              <div className="d-flex flex-column gap-3">
                {service.features.map((feature, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                    className="d-flex align-items-center gap-3 bg-light p-3 rounded">
                    <CheckCircle2 className="text-success flex-shrink-0" size={24} />
                    <span className="fs-5 text-dark">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </Col>

            <Col lg={5}>
              <div className="bg-primary text-white p-4 p-xl-5 rounded h-100 d-flex flex-column justify-content-center position-relative overflow-hidden">
                <div className="position-relative z-1">
                  <h3 className="fw-bold mb-4">გაქვთ შეკითხვები?</h3>
                  <p className="mb-4 opacity-75 lh-lg">ჩვენი გუნდი მზად არის გაგიწიოთ კონსულტაცია და შეგირჩიოთ საუკეთესო ვარიანტი.</p>
                  <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-white bg-opacity-10 rounded text-white">
                    <Phone className="opacity-75" />
                    <span className="fs-4 fw-medium">+995 555 12 34 56</span>
                  </div>
                  <Link href="/contact" className="btn btn-light btn-lg w-100 fw-bold text-primary text-uppercase mt-2">
                    დაგვიკავშირდით
                  </Link>
                </div>
                <div className="position-absolute end-0 bottom-0 bg-white opacity-10 rounded-circle" style={{ width: '250px', height: '250px', marginRight: '-100px', marginBottom: '-100px' }} />
                <div className="position-absolute start-0 top-0 bg-white opacity-10 rounded-circle" style={{ width: '150px', height: '150px', marginLeft: '-50px', marginTop: '-50px' }} />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
