'use client';

import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Offcanvas, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, Menu, User, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const Header: React.FC = () => {
  const { cart, wishlist } = useApp();
  const [showCart, setShowCart] = React.useState(false);
  const [showProducts, setShowProducts] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowProducts(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowProducts(false), 300);
  };

  return (
    <>
      <header className="sticky-top shadow-sm bg-white">
        {/* Top Header */}
        <div className="border-bottom py-3">
          <Container>
            <div className="d-flex justify-content-between align-items-center">
              {/* Logo */}
              <Link href="/" className="text-decoration-none p-0">
                <img
                  src="/logo.png"
                  alt="NewHome Logo"
                  style={{ height: '60px', width: 'auto' }}
                  className="d-inline-block align-top"
                />
              </Link>

              {/* Search Bar (Desktop) */}
              <div className="d-none d-md-flex mx-4 flex-grow-1" style={{ maxWidth: '500px' }}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-0 shadow-none px-3 py-2"
                    placeholder="ძიება თავის სახლში..."
                    style={{ borderRadius: '8px 0 0 8px' }}
                  />
                  <button className="btn bg-light border-0 px-3" style={{ borderRadius: '0 8px 8px 0' }}>
                    <Search size={20} className="text-muted" />
                  </button>
                </div>
              </div>

              {/* Icons */}
              <div className="d-flex align-items-center gap-2 gap-md-3">
                <Link href="/wishlist" className="position-relative icon-link text-decoration-none">
                  <Heart size={20} />
                  {wishlist.length > 0 && (
                    <Badge pill bg="none" className="position-absolute top-0 start-100 translate-middle bg-accent text-white" style={{ fontSize: '0.6rem' }}>
                      {wishlist.length}
                    </Badge>
                  )}
                </Link>

                <button onClick={() => setShowCart(true)} className="btn btn-link position-relative icon-link border-0 text-decoration-none p-0">
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <Badge pill bg="none" className="position-absolute top-0 start-100 translate-middle bg-primary text-white" style={{ fontSize: '0.6rem' }}>
                      {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </Badge>
                  )}
                </button>

                <Link href="/account" className="icon-link text-decoration-none">
                  <User size={20} />
                </Link>

                <Navbar expand="lg" className="p-0 d-lg-none">
                  <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 p-0 ms-2">
                    <Menu size={24} />
                  </Navbar.Toggle>
                </Navbar>
              </div>
            </div>
          </Container>
        </div>

        {/* Bottom Navigation */}
        <Navbar bg="white" expand="lg" className="py-2">
          <Container>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto gap-lg-4 align-items-center fw-medium">
                <Nav.Link as={Link} href="/about" className="text-nowrap">ჩვენს შესახებ</Nav.Link>
                <NavDropdown
                  title="პროდუქცია"
                  id="products-dropdown"
                  show={showProducts}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavDropdown.Item as={Link} href="/products/lighting" className="d-flex align-items-center gap-2">
                    <span className="dot bg-accent"></span> განათება
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/products/furniture" className="d-flex align-items-center gap-2">
                    <span className="dot bg-primary"></span> ავეჯი
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} href="/products">ყველა პროდუქტი</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} href="/services" className="text-nowrap">სერვისები</Nav.Link>
                <Nav.Link as={Link} href="/projects" className="text-nowrap">პროექტები</Nav.Link>
                <Nav.Link as={Link} href="/contact" className="text-nowrap">კონტაქტი</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <CartDrawer show={showCart} onHide={() => setShowCart(false)} />
    </>
  );
};

const CartDrawer: React.FC<{ show: boolean; onHide: () => void }> = ({ show, onHide }) => {
  const { cart, removeFromCart, updateQuantity } = useApp();
  const router = useRouter();
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
              <Button variant="primary" className="w-100 py-2 mb-2" onClick={() => { onHide(); router.push('/checkout'); }}>
                გაფორმება
              </Button>
              <Button variant="outline-secondary" className="w-100 py-2" onClick={() => { onHide(); router.push('/cart'); }}>
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
