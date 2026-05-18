'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { MenuItem } from '@/lib/api/types';
import { hasNestedChildren } from './headerUtils';

interface DesktopNavigationProps {
  items: MenuItem[];
  activeDesktopMenu: string | null;
  desktopDropdownStyle: React.CSSProperties;
  setActiveDesktopMenu: React.Dispatch<React.SetStateAction<string | null>>;
  desktopTriggerRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

const HOVER_CLOSE_DELAY = 180;

interface CascadeMegaMenuProps {
  rootItem: MenuItem;
  style: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CascadeMegaMenu: React.FC<CascadeMegaMenuProps> = ({ rootItem, style, onMouseEnter, onMouseLeave }) => {
  const [hoverPath, setHoverPath] = useState<MenuItem[]>([]);

  useEffect(() => {
    setHoverPath([]);
  }, [rootItem]);

  const columns: MenuItem[][] = [rootItem.children ?? []];
  for (const node of hoverPath) {
    if (node.children && node.children.length > 0) {
      columns.push(node.children);
    } else {
      break;
    }
  }

  const handleEnter = (depth: number, item: MenuItem) => {
    setHoverPath((current) => {
      const next = current.slice(0, depth);
      next.push(item);
      return next;
    });
  };

  return (
    <div
      className="dropdown-menu-custom dropdown-menu-cascade shadow-lg border-0 rounded-4 bg-white"
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="cascade-grid">
        {columns.map((items, depth) => (
          <div key={depth} className="cascade-column">
            {items.map((item, index) => {
              const childCount = item.children?.length ?? 0;
              const hasChildren = childCount > 0;
              const isActive = hoverPath[depth]?.url === item.url;

              return (
                <div
                  key={`${depth}-${index}-${item.url}`}
                  className={`cascade-item ${isActive ? 'is-active' : ''} ${hasChildren ? 'has-children' : ''}`}
                  onMouseEnter={() => handleEnter(depth, item)}
                >
                  <Link href={item.url} className="cascade-link d-flex align-items-center justify-content-between gap-2 text-decoration-none">
                    <span className="cascade-label">{item.label}</span>
                    {hasChildren ? <ChevronRight size={14} className="cascade-chevron" /> : null}
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  items,
  activeDesktopMenu,
  desktopDropdownStyle,
  setActiveDesktopMenu,
  desktopTriggerRefs,
}) => {
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (key: string) => {
      cancelClose();
      setActiveDesktopMenu(key);
    },
    [cancelClose, setActiveDesktopMenu],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDesktopMenu(null);
      hoverTimeoutRef.current = null;
    }, HOVER_CLOSE_DELAY);
  }, [cancelClose, setActiveDesktopMenu]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  const renderDesktopDropdown = (item: MenuItem) => {
    if (!item.children || item.children.length === 0) {
      return null;
    }

    if (!hasNestedChildren(item)) {
      return (
        <div
          className="dropdown-menu-custom dropdown-menu-simple shadow-lg border-0 rounded-4 p-2 bg-white"
          style={desktopDropdownStyle}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {item.children.map((child, index) => (
            <Link
              key={`${item.url}-${index}-${child.url}`}
              href={child.url}
              className="dropdown-item-custom d-block px-3 py-2 rounded-3 text-dark text-decoration-none"
            >
              {child.label}
            </Link>
          ))}
        </div>
      );
    }

    return (
      <CascadeMegaMenu
        rootItem={item}
        style={desktopDropdownStyle}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      />
    );
  };

  return (
    <Nav className="justify-content-center gap-4 fw-medium">
      {items.map((item) => (
        <div
          key={item.url}
          className="nav-item-custom position-relative"
          onMouseEnter={item.children && item.children.length > 0 ? () => openMenu(item.url) : undefined}
          onMouseLeave={item.children && item.children.length > 0 ? scheduleClose : undefined}
        >
          {item.children && item.children.length > 0 ? (
            <>
              <div
                className="desktop-nav-trigger d-flex align-items-center"
                ref={(node) => {
                  desktopTriggerRefs.current[item.url] = node;
                }}
              >
                <Link
                  href={item.url}
                  className="nav-link py-3 text-dark text-decoration-none desktop-nav-link"
                  onFocus={() => openMenu(item.url)}
                >
                  {item.label}
                </Link>
                <button
                  type="button"
                  className="desktop-nav-toggle btn btn-link border-0 p-0 text-dark text-decoration-none"
                  aria-expanded={activeDesktopMenu === item.url}
                  aria-haspopup="true"
                  aria-label={`${item.label} submenu`}
                  onClick={() => setActiveDesktopMenu((current) => (current === item.url ? null : item.url))}
                  onFocus={() => openMenu(item.url)}
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
