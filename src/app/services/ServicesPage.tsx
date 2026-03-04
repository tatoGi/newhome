'use client';

import React from 'react';
import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { allServices } from '@/lib/data';

export default function ServicesPage() {
  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>სერვისები</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center mb-5">
        <h1 className="fw-bold display-4 mb-3">ჩვენი სერვისები</h1>
        <p className="text-muted lead mx-auto" style={{ maxWidth: '700px' }}>
          ჩვენ გთავაზობთ სრულ სერვისს თქვენი საცხოვრებელი სივრცის მოსაწყობად - იდეიდან შესრულებამდე.
        </p>
      </div>

      <Row className="gy-4">
        {allServices.map((service, index) => (
          <Col key={service.id} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-0 shadow-sm overflow-hidden h-100">
                <Row className="g-0 h-100">
                  <Col md={5}>
                    <Link href={`/service/${service.id}`} className="d-block h-100">
                      <img src={service.image} alt={service.title} className="img-fluid h-100 w-100"
                        style={{ objectFit: 'cover', minHeight: '200px' }} referrerPolicy="no-referrer" />
                    </Link>
                  </Col>
                  <Col md={7}>
                    <Card.Body className="p-4 d-flex flex-column h-100">
                      <Link href={`/service/${service.id}`} className="fw-bold mb-3 fs-5 text-dark text-decoration-none">{service.title}</Link>
                      <Card.Text className="text-muted mb-4">{service.desc}</Card.Text>
                      <Link href={`/service/${service.id}`} className="btn btn-link text-primary p-0 mt-auto text-decoration-none d-flex align-items-center gap-2" style={{ width: 'max-content' }}>
                        დაწვრილებით <ArrowRight size={18} />
                      </Link>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
