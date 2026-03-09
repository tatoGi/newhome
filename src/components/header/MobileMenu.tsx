'use client';

import React from 'react';
import { Nav, Offcanvas } from 'react-bootstrap';
import Link from 'next/link';
import { ChevronDown, Heart, Search, User, LogOut } from 'lucide-react';
import type { Language, MenuItem } from '@/lib/api/types';
import { flagEmoji } from './headerUtils';
import { useAuth } from '@/context/AuthContext';

interface MobileMenuProps {
  show: boolean;
  onHide: () => void;
  headerLogo: string;
  navigationItems: MenuItem[];
  openMobileMenus: Record<string, boolean>;
  toggleMobileMenu: (key: string) => void;
  showLanguageDropdown: boolean;
  showAccountDropdown: boolean;
  languages: Language[];
  currentLocale: string;
  currentLanguage: Language | undefined;
  userInitial: string | null;
  wishlistCount: number;
  cartCount: number;
  onToggleLanguageDropdown: () => void;
  onToggleAccountDropdown: () => void;
  onChangeLocale: (locale: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  show,
  onHide,
  headerLogo,
  navigationItems,
  openMobileMenus,
  toggleMobileMenu,
  showLanguageDropdown,
  showAccountDropdown,
  languages,
  currentLocale,
  currentLanguage,
  userInitial,
  wishlistCount,
  cartCount,
  onToggleLanguageDropdown,
  onToggleAccountDropdown,
  onChangeLocale,
  onOpenCart,
  onOpenAuth,
}) => {
  const { logout } = useAuth();
  const renderMobileMenuItems = (items: MenuItem[], level = 0, parentKey = 'root'): React.ReactNode =>
    items.map((item, index) => {
      const itemKey = `${parentKey}-${index}-${item.url}`;
      const isOpen = !!openMobileMenus[itemKey];
      const hasChildren = !!item.children && item.children.length > 0;

      return (
        <div key={itemKey} className={level === 0 ? 'border-bottom' : ''}>
          {hasChildren ? (
            <div className={`mobile-dropdown mobile-dropdown-level-${level}`}>
              <div className="d-flex align-items-center justify-content-between px-3 py-3" style={level > 0 ? { paddingLeft: `${1.25 + level * 0.9}rem` } : undefined}>
                <Link href={item.url} onClick={onHide} className="text-dark fw-medium text-decoration-none">
                  {item.label}
                </Link>
                <button
                  className={`btn btn-link p-0 text-muted border-0 shadow-none mobile-submenu-toggle ${isOpen ? 'is-open' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMobileMenu(itemKey);
                  }}
                >
                  <ChevronDown size={18} />
                </button>
              </div>
              <div className={`mobile-dropdown-children ${isOpen ? 'd-block' : 'd-none'} ${level === 0 ? 'bg-light' : ''}`}>
                {renderMobileMenuItems(item.children ?? [], level + 1, itemKey)}
              </div>
            </div>
          ) : (
            <Nav.Link as={Link} href={item.url} onClick={onHide} className={`${level === 0 ? 'px-3 py-3 text-dark fw-medium' : 'py-2 text-dark small'}`} style={level > 0 ? { paddingLeft: `${1.5 + level * 1}rem` } : undefined}>
              {item.label}
            </Nav.Link>
          )}
        </div>
      );
    });

  return (
    <Offcanvas show={show} onHide={onHide} placement="start" className="mobile-header-offcanvas">
      <Offcanvas.Header closeButton className="border-bottom">
        <img src={headerLogo} alt="NewHome" className="mobile-header-logo" />
      </Offcanvas.Header>
      <Offcanvas.Body className="px-0 py-4">
        <div className="px-3 mb-4">
          <div className="input-group">
            <input type="text" className="form-control bg-light border-0 shadow-none" placeholder="ძებნა..." />
            <button className="btn bg-light border-0 px-3" aria-label="ძებნა">
              <Search size={16} className="text-muted" />
            </button>
          </div>
        </div>

        <Nav className="flex-column px-0">{renderMobileMenuItems(navigationItems)}</Nav>

        <div className="mt-4 d-flex gap-3 align-items-center px-3">
          <div className="position-relative">
            <button type="button" className="btn language-toggle d-inline-flex align-items-center gap-2 rounded-pill border bg-white px-3 py-2" aria-expanded={showLanguageDropdown} onClick={onToggleLanguageDropdown}>
              <span className="language-flag">{flagEmoji(currentLanguage?.country_code || currentLanguage?.flag) ?? currentLanguage?.code?.toUpperCase()}</span>
              <span className="fw-semibold small text-dark">{currentLanguage?.code?.toUpperCase()}</span>
              <ChevronDown size={14} className={`transition-transform ${showLanguageDropdown ? 'is-rotated' : ''}`} />
            </button>

            {showLanguageDropdown && (
              <div className="language-dropdown-menu language-dropdown-menu-mobile position-absolute start-0 mt-2 rounded-4 border-0 bg-white shadow-lg py-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`language-dropdown-item btn btn-link w-100 text-start text-decoration-none px-3 py-2 d-flex align-items-center justify-content-between gap-3 ${currentLocale === lang.code ? 'is-active' : ''}`}
                    onClick={() => onChangeLocale(lang.code)}
                  >
                    <span className="d-inline-flex align-items-center gap-2 text-dark">
                      <span className="language-flag">{flagEmoji(lang.country_code || lang.flag) ?? lang.code.toUpperCase()}</span>
                      <span>{lang.name}</span>
                    </span>
                    <span className="small text-muted">{lang.english_name || lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/wishlist" onClick={onHide} className="icon-link text-decoration-none text-dark">
            <Heart size={22} />
          </Link>
          {userInitial ? (
            <div className="position-relative">
              <button type="button" className="btn btn-link icon-link account-avatar-link border-0 text-dark text-decoration-none p-0" aria-label="ანგარიშის მენიუ" aria-expanded={showAccountDropdown} onClick={onToggleAccountDropdown}>
                <span className="account-avatar-badge account-avatar-badge-mobile">{userInitial}</span>
              </button>
              {showAccountDropdown && (
                <div className="account-dropdown-menu account-dropdown-menu-mobile position-absolute end-0 mt-2 rounded-4 border-0 bg-white shadow-lg py-2">
                  <button
                    type="button"
                    className="account-dropdown-item btn btn-link w-100 text-start text-decoration-none px-3 py-2 d-flex align-items-center justify-content-between"
                    onClick={() => {
                      onHide();
                      onOpenCart();
                    }}
                  >
                    <span>კალათა</span>
                    <span className="small text-muted">{cartCount}</span>
                  </button>
                  <Link href="/wishlist" className="account-dropdown-item d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none text-dark" onClick={onHide}>
                    <span>ფავორიტები</span>
                    <span className="small text-muted">{wishlistCount}</span>
                  </Link>
                  <Link href="/account" className="account-dropdown-item d-block px-3 py-2 text-decoration-none text-dark" onClick={onHide}>
                    პროფილი
                  </Link>
                  <div className="border-top mt-2 pt-2">
                    <button
                      type="button"
                      className="account-dropdown-item btn btn-link w-100 text-start text-decoration-none px-3 py-2 d-flex align-items-center justify-content-between text-danger"
                      onClick={async () => {
                        await logout();
                        onHide();
                      }}
                    >
                      <span>გამოსვლა</span>
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-link icon-link border-0 text-dark text-decoration-none p-0"
              onClick={() => {
                onHide();
                onOpenAuth();
              }}
              aria-label="შესვლა ან რეგისტრაცია"
            >
              <User size={22} />
            </button>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default MobileMenu;
