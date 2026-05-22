'use client';

import React from 'react';
import { Modal } from 'react-bootstrap';
import { Download, Share, Plus, CheckCircle2 } from 'lucide-react';
import { usePwa } from '@/context/PwaContext';

interface PwaInstallButtonProps {
  variant?: 'desktop' | 'mobile';
}

const PwaInstallButton: React.FC<PwaInstallButtonProps> = ({ variant = 'desktop' }) => {
  const {
    isIos,
    showIosInstructions,
    showAlreadyInstalled,
    promptInstall,
    closeIosInstructions,
    closeAlreadyInstalled,
  } = usePwa();

  const handleClick = () => {
    void promptInstall();
  };

  return (
    <>
      {variant === 'desktop' ? (
        <button
          type="button"
          className="btn pwa-install-btn d-none d-md-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-semibold"
          onClick={handleClick}
          aria-label="აპის გადმოწერა"
        >
          <Download size={16} />
          <span>აპის გადმოწერა</span>
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-link border-0 p-0 text-dark d-md-none pwa-install-icon-btn"
          onClick={handleClick}
          aria-label="აპის გადმოწერა"
        >
          <Download size={20} />
        </button>
      )}

      <Modal show={isIos && showIosInstructions} onHide={closeIosInstructions} centered>
        <Modal.Header closeButton>
          <Modal.Title>აპის გადმოწერა iPhone-ზე</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">HomeSpace აპის სათავო ეკრანზე დასამატებლად:</p>
          <ol className="ps-3 mb-0 d-flex flex-column gap-2">
            <li className="d-flex align-items-center gap-2">
              <span>დააჭირეთ Safari-ში გაზიარების ღილაკს</span>
              <Share size={18} className="text-primary" />
            </li>
            <li className="d-flex align-items-center gap-2">
              <span>აირჩიეთ &laquo;Add to Home Screen&raquo;</span>
              <Plus size={18} className="text-primary" />
            </li>
            <li>დაადასტურეთ &laquo;Add&raquo; ღილაკით</li>
          </ol>
        </Modal.Body>
      </Modal>

      <Modal show={showAlreadyInstalled} onHide={closeAlreadyInstalled} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="d-inline-flex align-items-center gap-2">
              <CheckCircle2 size={22} className="text-success" />
              აპი უკვე გადმოწერილია
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">HomeSpace აპი თქვენს მოწყობილობაზე უკვე დაყენებულია.</p>
          <p className="mb-0 text-muted small">
            გახსენით აპი თქვენი მოწყობილობის სათავო ეკრანიდან ან ბრაუზერის &laquo;ინსტალირებული აპლიკაციების&raquo; სიიდან.
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PwaInstallButton;
