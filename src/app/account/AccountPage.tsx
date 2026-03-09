'use client';

import { Card, Col, Container, Row } from 'react-bootstrap';
import AuthPanel from '@/components/AuthPanel';

export default function AccountPage() {
  return (
    <Container className="py-5 auth-account-page">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Body className="p-4 p-md-5">
              <AuthPanel />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
