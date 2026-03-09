'use client';

import { Modal } from 'react-bootstrap';
import AuthPanel from '@/components/AuthPanel';

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({
  show,
  onHide,
  initialMode = 'login',
}: AuthModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="auth-modal-content" dialogClassName="auth-modal-dialog">

      <Modal.Body className="pt-3">
        <AuthPanel initialMode={initialMode} variant="modal" onAuthenticated={onHide} />
      </Modal.Body>
    </Modal>
  );
}
