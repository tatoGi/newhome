'use client';

import React from 'react';
import { Container, Row, Col, Card, Badge, Breadcrumb, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { allProjects } from '@/lib/data';

export default function ProjectsPage() {
  return (
    <Container className="py-5">
      <Breadcrumb>
        <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
        <Breadcrumb.Item active>პროექტები</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 className="fw-bold mb-2">განხორციელებული პროექტები</h1>
          <p className="text-muted mb-0">ჩვენი ნამუშევრები, რომლებიც ამაყად წარმოადგენენ ჩვენს ხარისხს</p>
        </div>
        <div className="d-none d-md-flex gap-2">
          <Button variant="outline-primary" size="sm">ყველა</Button>
          <Button variant="outline-secondary" size="sm">საცხოვრებელი</Button>
          <Button variant="outline-secondary" size="sm">კომერციული</Button>
        </div>
      </div>

      <Row className="gy-4">
        {allProjects.map((project, index) => (
          <Col key={project.id} md={6}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="position-relative overflow-hidden">
                  <Link href={`/project/${project.id}`}>
                    <Card.Img variant="top" src={project.image} style={{ height: '400px', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                  </Link>
                  <div className="position-absolute top-0 start-0 m-3">
                    <Badge bg="primary" className="px-3 py-2">{project.category}</Badge>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Link href={`/project/${project.id}`} className="fw-bold fs-4 mb-0 text-dark text-decoration-none hover-primary">
                      {project.title}
                    </Link>
                    <span className="text-primary fw-bold">{project.year}</span>
                  </div>
                  <p className="text-muted mb-0">{project.location}</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
