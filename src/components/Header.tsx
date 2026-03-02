import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Offcanvas, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { cart, wishlist } = useApp();
  const [showCart, setShowCart] = React.useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fs-3 text-dark">
            New<span className="text-primary">Home</span>
          </Navbar.Brand>

          <div className="d-flex order-lg-3 align-items-center gap-3">
            <Nav.Link as={Link} to="/search" className="d-none d-md-block">
              <Search size={20} />
            </Nav.Link>
            <Nav.Link as={Link} to="/wishlist" className="position-relative">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6rem' }}>
                  {wishlist.length}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link onClick={() => setShowCart(true)} className="position-relative">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <Badge pill bg="primary" className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6rem' }}>
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link as={Link} to="/account">
              <User size={20} />
            </Nav.Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 p-0 ms-2">
              <Menu size={24} />
            </Navbar.Toggle>
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className="order-lg-2">
            <Nav className="mx-auto gap-lg-4">
              <Nav.Link as={Link} to="/about">ჩვენს შესახებ</Nav.Link>
              <NavDropdown title="პროდუქცია" id="products-dropdown">
                <NavDropdown.Item as={Link} to="/products/lighting">განათება</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products/furniture">ავეჯი</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/products">ყველა პროდუქტი</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/services">სერვისები</Nav.Link>
              <Nav.Link as={Link} to="/projects">პროექტები</Nav.Link>
              <Nav.Link as={Link} to="/contact">კონტაქტი</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <CartDrawer show={showCart} onHide={() => setShowCart(false)} />
    </>
  );
};

const CartDrawer: React.FC<{ show: boolean; onHide: () => void }> = ({ show, onHide }) => {
  const { cart, removeFromCart, updateQuantity } = useApp();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>კალათა</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {cart.length === 0 ? (
          <div className="text-center py-5">
            <ShoppingCart size={48} className="text-muted mb-3" />
            <p>კალათა ცარიელია</p>
            <Button variant="outline-primary" onClick={onHide}>საყიდლებზე დაბრუნება</Button>
          </div>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto">
              {cart.map(item => (
                <div key={item.id} className="d-flex gap-3 mb-4 border-bottom pb-3">
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} className="rounded" />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="text-muted small mb-2">{item.price} ₾</p>
                    <div className="d-flex align-items-center gap-2">
                      <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                      <Button size="sm" variant="link" className="text-danger ms-auto p-0" onClick={() => removeFromCart(item.id)}>
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-top">
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">ჯამი:</span>
                <span className="fw-bold">{total} ₾</span>
              </div>
              <Button variant="primary" className="w-full py-2 mb-2" onClick={() => { onHide(); navigate('/checkout'); }}>
                გაფორმება
              </Button>
              <Button variant="outline-secondary" className="w-full py-2" onClick={() => { onHide(); navigate('/cart'); }}>
                კალათის ნახვა
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Header;
