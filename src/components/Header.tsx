'use client';

import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useBootstrap } from '@/context/BootstrapContext';
import { toBackendAssetUrl } from '@/lib/api/assets';
import HeaderActions from '@/components/header/HeaderActions';
import DesktopNavigation from '@/components/header/DesktopNavigation';
import MobileMenu from '@/components/header/MobileMenu';
import CartDrawer from '@/components/header/CartDrawer';

const Header: React.FC = () => {
  const { cart, wishlist } = useApp();
  const { user, openAuthModal } = useAuth();
  const { navigation, languages, settings, locale: currentLocale, defaultLocale, refreshBootstrap } = useBootstrap();
  const router = useRouter();
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const [openMobileMenus, setOpenMobileMenus] = useState<Record<string, boolean>>({});
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const desktopTriggerRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [desktopDropdownStyle, setDesktopDropdownStyle] = useState<React.CSSProperties>({});

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDesktopMenu(null);
        setShowLanguageDropdown(false);
        setShowAccountDropdown(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDesktopMenu(null);
        setShowLanguageDropdown(false);
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  React.useEffect(() => {
    const updateDesktopDropdownPosition = () => {
      if (!activeDesktopMenu) {
        return;
      }

      const trigger = desktopTriggerRefs.current[activeDesktopMenu];
      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      setDesktopDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)',
      });
    };

    updateDesktopDropdownPosition();

    if (!activeDesktopMenu) {
      return;
    }

    window.addEventListener('resize', updateDesktopDropdownPosition);
    window.addEventListener('scroll', updateDesktopDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', updateDesktopDropdownPosition);
      window.removeEventListener('scroll', updateDesktopDropdownPosition, true);
    };
  }, [activeDesktopMenu]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedLocale = (params.get('locale') || '').toLowerCase();

    if (requestedLocale !== '' && requestedLocale !== currentLocale) {
      void refreshBootstrap(requestedLocale);
    }
  }, [currentLocale, refreshBootstrap]);

  const changeLocale = (nextLocale: string) => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (nextLocale === defaultLocale) {
      params.delete('locale');
    } else {
      params.set('locale', nextLocale);
    }

    void refreshBootstrap(nextLocale);
    router.replace(`${url.pathname}${params.toString() ? `?${params.toString()}` : ''}`);
    setShowLanguageDropdown(false);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setShowLanguageDropdown(false);
    setShowAccountDropdown(false);
  };

  const toggleMobileMenu = (key: string) => {
    setOpenMobileMenus((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const headerLogo = toBackendAssetUrl(settings.headerLogo) || '/logo.png';
  const currentLanguage = languages.find((lang) => lang.code === currentLocale) ?? languages[0];
  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || null;
  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);

  return (
    <>
      <header ref={headerRef} className="sticky-top shadow-sm bg-white">
        <div className="border-bottom py-2 py-md-3">
          <Container>
            <div className="d-flex justify-content-between align-items-center gap-2">
              <Link href="/" className="text-decoration-none flex-shrink-0">
                <img src={headerLogo} alt="NewHome" className="site-header-logo" />
              </Link>

              <div className="site-header-search-shell d-none d-md-flex flex-grow-1 mx-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="site-header-search-input form-control bg-light border-0 shadow-none px-3 py-2"
                    placeholder="ძებნა..."
                  />
                  <button className="site-header-search-button btn bg-light border-0 px-3" aria-label="ძებნა">
                    <Search size={18} className="text-muted" />
                  </button>
                </div>
              </div>

              <HeaderActions
                languages={languages}
                currentLocale={currentLocale}
                currentLanguage={currentLanguage}
                wishlistCount={wishlist.length}
                cartCount={cartCount}
                userInitial={userInitial}
                userName={user?.name}
                userEmail={user?.email}
                showLanguageDropdown={showLanguageDropdown}
                showAccountDropdown={showAccountDropdown}
                onToggleLanguageDropdown={() => setShowLanguageDropdown((current) => !current)}
                onToggleAccountDropdown={() => setShowAccountDropdown((current) => !current)}
                onChangeLocale={changeLocale}
                onOpenCart={() => setShowCart(true)}
                onOpenMenu={() => setShowMenu(true)}
                onOpenAuth={() => openAuthModal('login')}
                onCloseAccountDropdown={() => setShowAccountDropdown(false)}
              />
            </div>
          </Container>
        </div>

        <div className="d-none d-lg-block border-bottom py-1">
          <Container>
            <DesktopNavigation
              items={navigation.header}
              activeDesktopMenu={activeDesktopMenu}
              desktopDropdownStyle={desktopDropdownStyle}
              setActiveDesktopMenu={setActiveDesktopMenu}
              desktopTriggerRefs={desktopTriggerRefs}
            />
          </Container>
        </div>
      </header>

      <MobileMenu
        show={showMenu}
        onHide={closeMenu}
        headerLogo={headerLogo}
        navigationItems={navigation.header}
        openMobileMenus={openMobileMenus}
        toggleMobileMenu={toggleMobileMenu}
        showLanguageDropdown={showLanguageDropdown}
        showAccountDropdown={showAccountDropdown}
        languages={languages}
        currentLocale={currentLocale}
        currentLanguage={currentLanguage}
        userInitial={userInitial}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        onToggleLanguageDropdown={() => setShowLanguageDropdown((current) => !current)}
        onToggleAccountDropdown={() => setShowAccountDropdown((current) => !current)}
        onChangeLocale={changeLocale}
        onOpenCart={() => setShowCart(true)}
        onOpenAuth={() => openAuthModal('login')}
      />

      <CartDrawer show={showCart} onHide={() => setShowCart(false)} />
    </>
  );
};

export default Header;
