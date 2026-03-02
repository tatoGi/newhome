import React from 'react';
import { Container, Row, Col, Card, Badge, Breadcrumb, Button } from 'react-bootstrap';
import { motion } from 'motion/react';

const projects = [
  { id: 1, title: "თანამედროვე აპარტამენტი ვაკეში", location: "თბილისი", year: "2025", category: "საცხოვრებელი", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "ოფისი 'Tech Hub'", location: "ბათუმი", year: "2024", category: "კომერციული", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "ვილა საგურამოში", location: "მცხეთა", year: "2025", category: "საცხოვრებელი", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "რესტორანი 'Gusto'", location: "თბილისი", year: "2024", category: "კომერციული", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" },
];

const Projects: React.FC = () => {
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
        {projects.map((project, index) => (
          <Col key={project.id} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm overflow-hidden group">
                <div className="position-relative overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={project.image}
                    style={{ height: '400px', objectFit: 'cover' }}
                    className="transition-transform duration-500 hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    <Badge bg="primary" className="px-3 py-2">{project.category}</Badge>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="fw-bold fs-4 mb-0">{project.title || project.name}</Card.Title>
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
};

export default Projects;
