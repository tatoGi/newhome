import React from 'react';
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    id: 1,
    title: "ინტერიერის დიზაინი",
    desc: "პროფესიონალური დიზაინ-პროექტის მომზადება თქვენი სახლისთვის ან ოფისისთვის.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "ავეჯის დამზადება",
    desc: "ინდივიდუალური შეკვეთით ავეჯის დამზადება უმაღლესი ხარისხის მასალებით.",
    image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "განათების დაგეგმარება",
    desc: "სწორი განათების შერჩევა და მონტაჟი იდეალური ატმოსფეროს შესაქმნელად.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "რემონტი და ზედამხედველობა",
    desc: "სრული სარემონტო სამუშაოების მართვა და ხარისხის კონტროლი.",
    image: "https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&w=800&q=80"
  }
];

const Services: React.FC = () => {
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
        {services.map((service, index) => (
          <Col key={service.id} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm overflow-hidden h-100">
                <Row className="g-0 h-100">
                  <Col md={5}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="img-fluid h-100 w-100"
                      style={{ objectFit: 'cover', minHeight: '200px' }}
                      referrerPolicy="no-referrer"
                    />
                  </Col>
                  <Col md={7}>
                    <Card.Body className="p-4 d-flex flex-column h-100">
                      <Card.Title className="fw-bold mb-3">{service.title}</Card.Title>
                      <Card.Text className="text-muted mb-4">{service.desc}</Card.Text>
                      <Button variant="link" className="text-primary p-0 mt-auto text-decoration-none d-flex align-items-center gap-2">
                        დაწვრილებით <ArrowRight size={18} />
                      </Button>
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
};

export default Services;
