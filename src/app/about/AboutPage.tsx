'use client';

import React from 'react';
import { Container, Row, Col, Card, Breadcrumb } from 'react-bootstrap';
import { Target, Users, Award, History } from 'lucide-react';

export default function AboutPage() {
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
            {[
              { icon: <History size={40} className="text-primary mb-3 mx-auto" />, num: '10+', label: 'წელი გამოცდილება' },
              { icon: <Users size={40} className="text-primary mb-3 mx-auto" />, num: '500+', label: 'კმაყოფილი კლიენტი' },
              { icon: <Target size={40} className="text-primary mb-3 mx-auto" />, num: '1200+', label: 'დასრულებული პროექტი' },
              { icon: <Award size={40} className="text-primary mb-3 mx-auto" />, num: '15+', label: 'საერთაშორისო ჯილდო' },
            ].map((item, i) => (
              <Col md={3} key={i}>
                <Card className="border-0 text-center p-4 shadow-sm h-100">
                  {item.icon}
                  <h3 className="fw-bold">{item.num}</h3>
                  <p className="text-muted mb-0">{item.label}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">ჩვენი ღირებულებები</h2>
          </div>
          <Row className="gy-4">
            {[
              { title: 'ხარისხი', desc: 'ჩვენ არასდროს მივდივართ კომპრომისზე ხარისხთან დაკავშირებით. თითოეული ნივთი გადის მკაცრ კონტროლს.' },
              { title: 'ინოვაცია', desc: 'მუდმივად ვადევნებთ თვალს მსოფლიო ტრენდებს და ვნერგავთ თანამედროვე ტექნოლოგიებს.' },
              { title: 'პასუხისმგებლობა', desc: 'ჩვენ პასუხს ვაგებთ თითოეულ დაპირებაზე და ვზრუნავთ ჩვენს მომხმარებლებზე.' },
            ].map((item, i) => (
              <Col md={4} key={i}>
                <div className="p-4">
                  <h4 className="fw-bold mb-3">{item.title}</h4>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
}
