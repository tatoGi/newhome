'use client';

import React from 'react';
import { Badge } from 'react-bootstrap';
import Link from 'next/link';
import { ChevronDown, Heart, Menu, ShoppingCart, User, LogOut } from 'lucide-react';
import type { Language } from '@/lib/api/types';
import { flagEmoji } from './headerUtils';
import { useAuth } from '@/context/AuthContext';

interface HeaderActionsProps {
  languages: Language[];
  currentLocale: string;
  currentLanguage: Language | undefined;
  wishlistCount: number;
  cartCount: number;
  userInitial: string | null;
  userName?: string;
  userEmail?: string;
  showLanguageDropdown: boolean;
  showAccountDropdown: boolean;
  onToggleLanguageDropdown: () => void;
  onToggleAccountDropdown: () => void;
  onChangeLocale: (locale: string) => void;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  onOpenAuth: () => void;
  onCloseAccountDropdown: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = (props) => {
  const { logout } = useAuth();
  const {
    languages,
    currentLocale,
    currentLanguage,
    wishlistCount,
    cartCount,
    userInitial,
    userName,
    userEmail,
    showLanguageDropdown,
    showAccountDropdown,
    onToggleLanguageDropdown,
    onToggleAccountDropdown,
    onChangeLocale,
    onOpenCart,
    onOpenMenu,
    onOpenAuth,
    onCloseAccountDropdown,
  } = props;

  return (
    <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
      <div className="position-relative">
        <button
          type="button"
          className="btn language-toggle d-inline-flex align-items-center gap-2 rounded-pill border bg-white px-3 py-2"
          aria-expanded={showLanguageDropdown}
          aria-haspopup="true"
          onClick={onToggleLanguageDropdown}
        >
          <span className="language-flag">{flagEmoji(currentLanguage?.country_code || currentLanguage?.flag) ?? currentLanguage?.code?.toUpperCase()}</span>
          <span className="fw-semibold small text-dark">{currentLanguage?.code?.toUpperCase()}</span>
          <ChevronDown size={14} className={`transition-transform ${showLanguageDropdown ? 'is-rotated' : ''}`} />
        </button>

        {showLanguageDropdown && (
          <div className="language-dropdown-menu position-absolute end-0 mt-2 rounded-4 border-0 bg-white shadow-lg py-2">
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

      <Link href="/wishlist" className="position-relative icon-link text-decoration-none text-dark" aria-label="სურვილების სია">
        <Heart size={20} />
        {wishlistCount > 0 && (
          <Badge pill className="header-badge-count position-absolute top-0 start-100 translate-middle bg-danger text-white">
            {wishlistCount}
          </Badge>
        )}
      </Link>

      <button onClick={onOpenCart} className="btn btn-link position-relative icon-link border-0 text-dark text-decoration-none p-0" aria-label="კალათა">
        <ShoppingCart size={20} />
        {cartCount > 0 && (
          <Badge pill className="header-badge-count position-absolute top-0 start-100 translate-middle bg-primary text-white">
            {cartCount}
          </Badge>
        )}
      </button>

      {userInitial ? (
        <div className="position-relative d-none d-md-block">
          <button
            type="button"
            className="btn btn-link icon-link account-avatar-link border-0 text-dark text-decoration-none p-0"
            aria-label="ანგარიშის მენიუ"
            aria-expanded={showAccountDropdown}
            onClick={onToggleAccountDropdown}
          >
            <span className="account-avatar-badge">{userInitial}</span>
          </button>

          {showAccountDropdown && (
            <div className="account-dropdown-menu position-absolute end-0 mt-2 rounded-4 border-0 bg-white shadow-lg py-2">
              <div className="account-dropdown-header px-3 pb-2 mb-2 border-bottom">
                <div className="fw-semibold text-dark">{userName}</div>
                <div className="small text-muted">{userEmail}</div>
              </div>
              <button
                type="button"
                className="account-dropdown-item btn btn-link w-100 text-start text-decoration-none px-3 py-2 d-flex align-items-center justify-content-between"
                onClick={() => {
                  onCloseAccountDropdown();
                  onOpenCart();
                }}
              >
                <span>კალათა</span>
                <span className="small text-muted">{cartCount}</span>
              </button>
              <Link href="/wishlist" className="account-dropdown-item d-flex align-items-center justify-content-between px-3 py-2 text-decoration-none text-dark" onClick={onCloseAccountDropdown}>
                <span>ფავორიტები</span>
                <span className="small text-muted">{wishlistCount}</span>
              </Link>
              <Link href="/account" className="account-dropdown-item d-block px-3 py-2 text-decoration-none text-dark" onClick={onCloseAccountDropdown}>
                პროფილი
              </Link>
              <div className="border-top mt-2 pt-2">
                <button
                  type="button"
                  className="account-dropdown-item btn btn-link w-100 text-start text-decoration-none px-3 py-2 d-flex align-items-center justify-content-between text-danger"
                  onClick={async () => {
                    await logout();
                    onCloseAccountDropdown();
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
        <button type="button" className="btn btn-link icon-link border-0 text-dark text-decoration-none p-0 d-none d-md-inline-flex" onClick={onOpenAuth} aria-label="შესვლა ან რეგისტრაცია">
          <User size={20} />
        </button>
      )}

      <button className="btn btn-link border-0 p-0 text-dark d-lg-none" onClick={onOpenMenu} aria-label="მენიუ">
        <Menu size={24} />
      </button>
    </div>
  );
};

export default HeaderActions;
