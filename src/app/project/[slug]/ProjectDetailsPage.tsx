'use client';

import React from 'react';
import { Container, Row, Col, Badge, Carousel } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight, Calendar, MapPin, Maximize, Target } from 'lucide-react';
import { Project } from '@/lib/data';

export default function ProjectDetailsPage({ project }: { project: Project }) {
  return (
    <div className="pb-5 bg-light min-vh-100">
      <Container className="pt-4">
        <div className="mb-4 d-flex align-items-center text-muted small">
          <Link href="/" className="text-muted text-decoration-none hover-primary">მთავარი</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/projects" className="text-muted text-decoration-none hover-primary">პროექტები</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-dark fw-medium">{project.title}</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white p-4 p-md-5 rounded shadow-sm mb-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end mb-4 gap-3">
            <div>
              <Badge bg="primary" className="mb-2 px-3 py-2">{project.category}</Badge>
              <h1 className="fw-bold mb-0 display-5">{project.title}</h1>
            </div>
            <div className="d-flex gap-4 text-muted border-start ps-4">
              <div>
                <span className="d-block small text-uppercase">წელი</span>
                <span className="fs-5 fw-bold text-dark">{project.year}</span>
              </div>
            </div>
          </div>

          <div className="mb-5 rounded overflow-hidden shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
            <Carousel slide={true} indicators={true}>
              {project.images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img src={img} alt={`${project.title} ${idx + 1}`} className="w-100"
                    style={{ height: '600px', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>

          <Row className="gy-5">
            <Col lg={8}>
              <h3 className="fw-bold mb-4">პროექტის შესახებ</h3>
              <p className="text-muted lh-lg fs-5" style={{ textAlign: 'justify' }}>{project.desc}</p>
              <Row className="mt-5 g-4">
                <Col sm={6}>
                  <img src={project.images[1]} alt="Interior detail" className="w-100 rounded shadow-sm" style={{ height: '300px', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                </Col>
                <Col sm={6}>
                  <img src={project.images[2]} alt="Interior detail" className="w-100 rounded shadow-sm" style={{ height: '300px', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                </Col>
              </Row>
            </Col>

            <Col lg={4}>
              <div className="bg-light p-4 rounded border">
                <h4 className="fw-bold mb-4">დეტალები</h4>
                <div className="d-flex flex-column gap-4">
                  {[
                    { icon: <MapPin size={24} />, label: 'ლოკაცია', value: project.location },
                    { icon: <Maximize size={24} />, label: 'ფართობი', value: project.area },
                    { icon: <Calendar size={24} />, label: 'ხანგრძლივობა', value: project.duration },
                    { icon: <Target size={24} />, label: 'დამკვეთი', value: project.client },
                  ].map((item, i) => (
                    <div key={i} className="d-flex align-items-center gap-3">
                      <div className="bg-white p-2 rounded shadow-sm text-primary">{item.icon}</div>
                      <div>
                        <span className="d-block small text-muted">{item.label}</span>
                        <span className="fw-medium text-dark">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
}
