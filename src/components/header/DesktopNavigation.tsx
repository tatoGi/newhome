'use client';

import React from 'react';
import { Nav } from 'react-bootstrap';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { MenuItem } from '@/lib/api/types';
import { hasNestedChildren } from './headerUtils';

interface DesktopNavigationProps {
  items: MenuItem[];
  activeDesktopMenu: string | null;
  desktopDropdownStyle: React.CSSProperties;
  setActiveDesktopMenu: React.Dispatch<React.SetStateAction<string | null>>;
  desktopTriggerRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  items,
  activeDesktopMenu,
  desktopDropdownStyle,
  setActiveDesktopMenu,
  desktopTriggerRefs,
}) => {
  const renderDesktopDropdown = (item: MenuItem) => {
    if (!item.children || item.children.length === 0) {
      return null;
    }

    if (!hasNestedChildren(item)) {
      return (
        <div className="dropdown-menu-custom dropdown-menu-simple shadow-lg border-0 rounded-4 p-2 bg-white" style={desktopDropdownStyle}>
          {item.children.map((child) => (
            <Link key={`${item.url}-${child.url}`} href={child.url} className="dropdown-item-custom d-block px-3 py-2 rounded-3 text-dark text-decoration-none">
              {child.label}
            </Link>
          ))}
        </div>
      );
    }

    return (
      <div className="dropdown-menu-custom dropdown-menu-mega shadow-lg border-0 rounded-4 p-3 bg-white" style={desktopDropdownStyle}>
        <div className="mega-menu-grid">
          {item.children.map((child) => {
            const grandChildren = child.children ?? [];

            return (
              <div key={`${item.url}-${child.url}`} className="mega-menu-column">
                <Link href={child.url} className="mega-menu-parent d-inline-flex align-items-center fw-semibold text-dark text-decoration-none mb-2">
                  {child.label}
                </Link>

                {grandChildren.length > 0 ? (
                  <div className="d-flex flex-column gap-1">
                    {grandChildren.map((grandChild) => (
                      <Link key={`${child.url}-${grandChild.url}`} href={grandChild.url} className="dropdown-item-custom mega-menu-child d-block px-3 py-2 rounded-3 text-dark text-decoration-none">
                        {grandChild.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link href={child.url} className="dropdown-item-custom mega-menu-child d-block px-3 py-2 rounded-3 text-dark text-decoration-none">
                    {child.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Nav className="justify-content-center gap-4 fw-medium">
      {items.map((item) => (
        <div key={item.url} className="nav-item-custom position-relative">
          {item.children && item.children.length > 0 ? (
            <>
              <div
                className="desktop-nav-trigger d-flex align-items-center"
                ref={(node) => {
                  desktopTriggerRefs.current[item.url] = node;
                }}
              >
                <Link href={item.url} className="nav-link py-3 text-dark text-decoration-none desktop-nav-link">
                  {item.label}
                </Link>
                <button
                  type="button"
                  className="desktop-nav-toggle btn btn-link border-0 p-0 text-dark text-decoration-none"
                  aria-expanded={activeDesktopMenu === item.url}
                  aria-haspopup="true"
                  aria-label={`${item.label} submenu`}
                  onClick={() => setActiveDesktopMenu((current) => (current === item.url ? null : item.url))}
                >
                  <ChevronDown size={14} className={`transition-transform ${activeDesktopMenu === item.url ? 'is-rotated' : ''}`} />
                </button>
              </div>
              {activeDesktopMenu === item.url ? renderDesktopDropdown(item) : null}
            </>
          ) : (
            <Nav.Link as={Link} href={item.url} className="py-3">
              {item.label}
            </Nav.Link>
          )}
        </div>
      ))}
    </Nav>
  );
};

export default DesktopNavigation;
