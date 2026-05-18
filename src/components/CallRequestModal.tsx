'use client';

import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Phone, X } from 'lucide-react';
import { useBootstrap } from '@/context/BootstrapContext';
import { api } from '@/lib/api/client';
import { getUiText } from '@/lib/i18n/ui';

interface CallRequestModalProps {
    show: boolean;
    onHide: () => void;
}

const ViberIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.5 0C7.94 0 3.4 1.36 3.05 5.69c-.2 2.5-.27 6.55.66 9.43.95 2.93 3.66 3.39 6.45 3.5.34 0 1.14.05 1.14.05.36 0 .77-.01 1.16-.05l-.05 1.04c-.04.79.94 1.2 1.5.65l2.49-2.4c2.84-.32 4.83-1.05 5.5-3.29.93-2.88.87-6.92.66-9.43C21.5 1.36 16.97 0 12.41 0h.09zm-.34 3.06c2.96 0 5.42 1.5 5.84 4.04.07.4.13.84.13 1.27 0 .13-.03.18-.18.18-.13 0-.16-.06-.18-.18-.02-.18-.04-.39-.07-.59-.39-2.3-2.46-3.49-5.4-3.5-.16 0-.21-.04-.21-.18 0-.13.06-.17.21-.17l-.14.13zm0 1.49c.06 0 .14 0 .21.02 2.27.13 3.83 1.31 4.07 3.6.02.16-.04.23-.18.23s-.16-.06-.18-.21c-.21-2.02-1.61-3.05-3.71-3.18-.16 0-.21-.06-.21-.18 0-.13.06-.18.21-.18-.27-.04-.21-.1-.21-.1zm-3.46.32c.2 0 .4.04.59.11.49.21.83.55 1.16.97.21.27.41.55.6.83.13.18.18.39.13.61-.04.21-.16.36-.32.47-.34.23-.66.5-.86.86-.13.23-.13.46-.04.69.29.84.78 1.55 1.46 2.16.34.31.69.59 1.11.79.27.13.51.13.74-.04.34-.25.59-.56.83-.89.18-.25.46-.32.74-.18.21.11.41.23.61.36.27.18.55.34.81.55.18.13.31.31.34.55v.05c-.07.39-.22.71-.5.95-.31.27-.66.51-1.08.59-.31.07-.61 0-.91-.07-1.66-.43-3.07-1.27-4.16-2.61-.97-1.18-1.69-2.55-1.95-4.08-.13-.78.04-1.46.61-2.02.16-.16.34-.27.54-.27.07-.02.14-.04.21-.04zm3.39 1.27c.07 0 .14.02.21.06.18.13.32.32.43.55.07.18.13.39.13.59 0 .04-.04.07-.07.07-.04 0-.07-.04-.07-.07-.04-.21-.07-.4-.16-.59-.13-.23-.27-.41-.46-.55-.04-.04-.04-.07-.04-.13 0-.04.04-.04.04.07zm.67-.6c.39 0 .77.16 1.07.43.34.32.54.71.61 1.16.04.16-.04.27-.18.32-.13.04-.27-.04-.34-.18-.04-.18-.13-.32-.27-.46-.27-.27-.59-.39-1-.39-.13 0-.21-.07-.21-.21 0-.16.07-.21.21-.21l.11-.46z" />
    </svg>
);

const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
    </svg>
);

const normalizePhone = (phone: string): string => phone.replace(/\s|\(|\)|-/g, '');

const CallRequestModal: React.FC<CallRequestModalProps> = ({ show, onHide }) => {
    const { settings, locale } = useBootstrap();
    const socialLinks = settings.socialLinks ?? {};
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const contactPhone = settings.contactPhone || null;
    const viberLink = socialLinks.viber || (contactPhone ? `viber://chat?number=${encodeURIComponent(normalizePhone(contactPhone))}` : null);
    const whatsappLink = socialLinks.whatsapp || (contactPhone ? `https://wa.me/${normalizePhone(contactPhone).replace(/^\+/, '')}` : null);

    const handleClose = () => {
        setName('');
        setPhone('');
        setError(null);
        setSuccess(false);
        setSubmitting(false);
        onHide();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return;

        setError(null);
        setSubmitting(true);

        try {
            await api.submitCallRequest({
                name: name.trim(),
                phone: phone.trim(),
                locale: locale || undefined,
                page_url: typeof window !== 'undefined' ? window.location.href : undefined,
                page_slug: typeof window !== 'undefined' ? window.location.pathname.replace(/^\//, '') || undefined : undefined,
            });
            setSuccess(true);
            setName('');
            setPhone('');
        } catch (err) {
            setError(err instanceof Error ? err.message : getUiText(locale, 'call_request.error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header className="border-0 pb-0 align-items-center">
                <Modal.Title className="d-inline-flex align-items-center gap-2 fw-bold">
                    <Phone size={20} />
                    {getUiText(locale, 'call_request.title')}
                </Modal.Title>
                <button type="button" aria-label="Close" className="btn btn-link p-0 text-dark" onClick={handleClose}>
                    <X size={22} />
                </button>
            </Modal.Header>
            <Modal.Body className="pt-3">
                {contactPhone && (
                    <div className="mb-4">
                        <div className="text-center small text-muted text-uppercase mb-3" style={{ letterSpacing: '1px' }}>
                            {getUiText(locale, 'call_request.call_us')}
                        </div>
                        <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                            {viberLink && (
                                <a href={viberLink} className="d-inline-flex align-items-center gap-2 text-decoration-none text-dark fw-medium">
                                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle border" style={{ width: 40, height: 40, color: '#7360F2' }}>
                                        <ViberIcon size={20} />
                                    </span>
                                    {contactPhone}
                                </a>
                            )}
                            {whatsappLink && (
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="d-inline-flex align-items-center gap-2 text-decoration-none text-dark fw-medium">
                                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle border" style={{ width: 40, height: 40, color: '#25D366' }}>
                                        <WhatsAppIcon size={20} />
                                    </span>
                                    {contactPhone}
                                </a>
                            )}
                        </div>
                        <hr className="my-4" />
                    </div>
                )}

                {success ? (
                    <div className="alert alert-success text-center mb-0" role="status">
                        {getUiText(locale, 'call_request.success')}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder={getUiText(locale, 'call_request.name_placeholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={255}
                            disabled={submitting}
                        />
                        <input
                            type="tel"
                            className="form-control form-control-lg"
                            placeholder={getUiText(locale, 'call_request.phone_placeholder')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            maxLength={50}
                            disabled={submitting}
                        />
                        <button
                            type="submit"
                            className="btn btn-accent btn-lg fw-bold text-white text-uppercase"
                            disabled={submitting || !name.trim() || !phone.trim()}
                        >
                            {submitting ? getUiText(locale, 'call_request.sending') : getUiText(locale, 'call_request.submit')}
                        </button>
                    </form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default CallRequestModal;
