'use client';

import React, { useState } from 'react';
import { Nav, Container, NavDropdown, Badge, Offcanvas, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Search, Menu, User, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const Header: React.FC = () => {
  const { cart, wishlist } = useApp();
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowProducts(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowProducts(false), 300);
  };

  const closeMenu = () => setShowMenu(false);

  return (
    <>
      <header className="sticky-top shadow-sm bg-white">
        {/* Top row */}
        <div className="border-bottom py-2 py-md-3">
          <Container>
            <div className="d-flex justify-content-between align-items-center gap-2">

              {/* Logo */}
              <Link href="/" className="text-decoration-none flex-shrink-0">
                <img src="/logo.png" alt="NewHome" style={{ height: '50px', width: 'auto' }} />
              </Link>

              {/* Search — desktop only */}
              <div className="d-none d-md-flex flex-grow-1 mx-3" style={{ maxWidth: 500 }}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-0 shadow-none px-3 py-2"
                    placeholder="ძიება..."
                    style={{ borderRadius: '8px 0 0 8px' }}
                  />
                  <button className="btn bg-light border-0 px-3" style={{ borderRadius: '0 8px 8px 0' }} aria-label="ძიება">
                    <Search size={18} className="text-muted" />
                  </button>
                </div>
              </div>

              {/* Icons */}
              <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
                <Link href="/wishlist" className="position-relative icon-link text-decoration-none text-dark" aria-label="სურვილების სია">
                  <Heart size={20} />
                  {wishlist.length > 0 && (
                    <Badge pill className="position-absolute top-0 start-100 translate-middle bg-danger text-white" style={{ fontSize: '0.55rem' }}>
                      {wishlist.length}
                    </Badge>
                  )}
                </Link>

                <button
                  onClick={() => setShowCart(true)}
                  className="btn btn-link position-relative icon-link border-0 text-dark text-decoration-none p-0"
                  aria-label="კალათა"
                >
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <Badge pill className="position-absolute top-0 start-100 translate-middle bg-primary text-white" style={{ fontSize: '0.55rem' }}>
                      {cart.reduce((a, i) => a + i.quantity, 0)}
                    </Badge>
                  )}
                </button>

                <Link href="/account" className="icon-link text-decoration-none text-dark d-none d-md-inline-flex" aria-label="ანგარიში">
                  <User size={20} />
                </Link>

                {/* Burger — mobile only */}
                <button
                  className="btn btn-link border-0 p-0 text-dark d-lg-none"
                  onClick={() => setShowMenu(true)}
                  aria-label="მენიუ"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* Desktop nav — hidden on mobile */}
        <div className="d-none d-lg-block border-bottom py-1">
          <Container>
            <Nav className="justify-content-center gap-4 fw-medium">
              <Nav.Link as={Link} href="/about">ჩვენს შესახებ</Nav.Link>
              <NavDropdown
                title="პროდუქცია"
                id="products-dd"
                show={showProducts}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <NavDropdown.Item as={Link} href="/products/lighting" className="d-flex align-items-center gap-2">
                  <span className="dot bg-accent" /> განათება
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/products/furniture" className="d-flex align-items-center gap-2">
                  <span className="dot bg-primary" /> ავეჯი
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} href="/products">ყველა პროდუქტი</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} href="/services">სერვისები</Nav.Link>
              <Nav.Link as={Link} href="/projects">პროექტები</Nav.Link>
              <Nav.Link as={Link} href="/contact">კონტაქტი</Nav.Link>
            </Nav>
          </Container>
        </div>
      </header>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={showMenu} onHide={closeMenu} placement="start" style={{ width: 280 }}>
        <Offcanvas.Header closeButton className="border-bottom">
          <img src="/logo.png" alt="NewHome" style={{ height: 40 }} />
        </Offcanvas.Header>
        <Offcanvas.Body className="px-3 py-4">
          {/* Mobile search */}
          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control bg-light border-0 shadow-none"
              placeholder="ძიება..."
            />
            <button className="btn bg-light border-0 px-3">
              <Search size={16} className="text-muted" />
            </button>
          </div>

          <Nav className="flex-column">
            {[
              { href: '/', label: 'მთავარი' },
              { href: '/about', label: 'ჩვენს შესახებ' },
              { href: '/products', label: 'პროდუქცია' },
              { href: '/products/lighting', label: 'განათება', sub: true },
              { href: '/products/furniture', label: 'ავეჯი', sub: true },
              { href: '/services', label: 'სერვისები' },
              { href: '/projects', label: 'პროექტები' },
              { href: '/contact', label: 'კონტაქტი' },
            ].map(({ href, label, sub }) => (
              <Nav.Link
                key={href}
                as={Link}
                href={href}
                onClick={closeMenu}
                className={`py-2 border-bottom text-dark ${sub ? 'ps-3 text-muted small' : 'fw-medium'}`}
              >
                {sub ? `— ${label}` : label}
              </Nav.Link>
            ))}
          </Nav>

          <div className="mt-4 d-flex gap-3 align-items-center">
            <Link href="/wishlist" onClick={closeMenu} className="icon-link text-decoration-none text-dark">
              <Heart size={22} />
            </Link>
            <Link href="/account" onClick={closeMenu} className="icon-link text-decoration-none text-dark">
              <User size={22} />
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

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
                  <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover' }} className="rounded" />
                  <div className="flex-grow-1">
                    <h6 className="mb-1 small">{item.name}</h6>
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
