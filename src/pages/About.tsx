import React from 'react';
import { Container, Row, Col, Card, Breadcrumb, Button } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Target, Users, Award, History } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div>
      <section className="py-5 bg-light">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">მთავარი</Breadcrumb.Item>
            <Breadcrumb.Item active>ჩვენს შესახებ</Breadcrumb.Item>
          </Breadcrumb>
          <Row className="align-items-center gy-5">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">NewHome - ჩვენ ვქმნით თქვენს კომფორტს</h1>
              <p className="lead text-muted mb-4">
                ჩვენი კომპანია დაარსდა 2015 წელს და მას შემდეგ ვეხმარებით ადამიანებს თავიანთი საოცნებო სახლის მოწყობაში.
              </p>
              <p className="text-muted">
                ჩვენი გუნდი შედგება პროფესიონალი დიზაინერებისგან და ხელოსნებისგან, რომლებიც ორიენტირებულნი არიან ხარისხსა და ინოვაციაზე. ჩვენ გვჯერა, რომ ყველა დეტალს აქვს მნიშვნელობა.
              </p>
            </Col>
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80"
                alt="Our Team"
                className="img-fluid rounded-4 shadow-lg"
                referrerPolicy="no-referrer"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="gy-4">
            <Col md={3}>
              <Card className="border-0 text-center p-4 shadow-sm h-100">
                <History size={40} className="text-primary mb-3 mx-auto" />
                <h3 className="fw-bold">10+</h3>
                <p className="text-muted mb-0">წელი გამოცდილება</p>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 text-center p-4 shadow-sm h-100">
                <Users size={40} className="text-primary mb-3 mx-auto" />
                <h3 className="fw-bold">500+</h3>
                <p className="text-muted mb-0">კმაყოფილი კლიენტი</p>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 text-center p-4 shadow-sm h-100">
                <Target size={40} className="text-primary mb-3 mx-auto" />
                <h3 className="fw-bold">1200+</h3>
                <p className="text-muted mb-0">დასრულებული პროექტი</p>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 text-center p-4 shadow-sm h-100">
                <Award size={40} className="text-primary mb-3 mx-auto" />
                <h3 className="fw-bold">15+</h3>
                <p className="text-muted mb-0">საერთაშორისო ჯილდო</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">ჩვენი ღირებულებები</h2>
          </div>
          <Row className="gy-4">
            <Col md={4}>
              <div className="p-4">
                <h4 className="fw-bold mb-3">ხარისხი</h4>
                <p className="text-muted">ჩვენ არასდროს მივდივართ კომპრომისზე ხარისხთან დაკავშირებით. თითოეული ნივთი გადის მკაცრ კონტროლს.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4">
                <h4 className="fw-bold mb-3">ინოვაცია</h4>
                <p className="text-muted">მუდმივად ვადევნებთ თვალს მსოფლიო ტრენდებს და ვნერგავთ თანამედროვე ტექნოლოგიებს.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4">
                <h4 className="fw-bold mb-3">პასუხისმგებლობა</h4>
                <p className="text-muted">ჩვენ პასუხს ვაგებთ თითოეულ დაპირებაზე და ვზრუნავთ ჩვენს მომხმარებლებზე.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
