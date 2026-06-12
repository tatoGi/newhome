'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Modal, Carousel } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { resolveImageOrFallback, toBackendAssetUrl } from '@/lib/api/assets';
import { useFallbackLogo } from '@/context/BootstrapContext';

function reelDetailsHref(reel: { category?: string; slug?: string; url?: string }): string | null {
    const url = String(reel.url ?? '').trim();
    if (url) {
        return url.startsWith('/') ? url : `/${url}`;
    }

    const slug = String(reel.slug ?? '').trim();
    if (!slug) {
        return null;
    }

    if (reel.category === 'product') {
        return `/product/${slug}`;
    }

    return null;
}

const Reels: React.FC<{ data?: any }> = ({ data }) => {
    const displayReels = Array.isArray(data?.reels) ? data.reels : [];
    const [show, setShow] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const fallbackLogo = useFallbackLogo();

    if (displayReels.length === 0) return null;

    const handleOpen = (index: number) => {
        setActiveIndex(index);
        setShow(true);
    };

    return (
        <div className="py-4 bg-light border-bottom reels-section">
            <div className="container overflow-auto hide-scrollbar">
                <div className="d-flex gap-4 py-2" style={{ minWidth: 'max-content' }}>
                    {displayReels.map((reel: any, index: number) => {
                        const videoUrl = toBackendAssetUrl(String(reel.video_url || '').trim());
                        const hasVideo = Boolean(videoUrl);
                        const reelImg = resolveImageOrFallback(reel.image, fallbackLogo);

                        return (
                            <motion.div
                                key={reel.id}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-center cursor-pointer"
                                onClick={() => handleOpen(index)}
                                style={{ width: '90px', transformOrigin: 'bottom center' }}
                            >
                                <div className={`reel-circle-wrapper ${reel.category}`}>
                                    <div className="reel-circle shadow-sm">
                                        {hasVideo && !reel.image ? (
                                            <video
                                                src={videoUrl}
                                                muted
                                                playsInline
                                                preload="metadata"
                                                className="reel-img"
                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                            />
                                        ) : (
                                            <Image
                                                src={reelImg}
                                                alt={reel.title}
                                                title={reel.title}
                                                width={90}
                                                height={90}
                                                sizes="90px"
                                                className="reel-img"
                                                referrerPolicy="no-referrer"
                                            />
                                        )}
                                        {hasVideo && (
                                            <div className="reel-play-icon">
                                                <Play size={14} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="small mb-0 mt-2 fw-medium text-truncate text-dark">{reel.title}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                centered
                size="lg"
                contentClassName="bg-transparent border-0"
            >
                <Modal.Body className="p-0">
                    <Carousel
                        activeIndex={activeIndex}
                        onSelect={(idx) => setActiveIndex(idx)}
                        interval={5000}
                        indicators={true}
                        className="reels-carousel"
                        pause="hover"
                    >
                        {displayReels.map((reel: any) => {
                            const detailsHref = reelDetailsHref(reel);
                            const videoUrl = toBackendAssetUrl(String(reel.video_url || '').trim());
                            const reelImg = resolveImageOrFallback(reel.image, fallbackLogo);

                            return (
                                <Carousel.Item key={reel.id}>
                                    <div className="reel-viewer-content rounded-4 overflow-hidden position-relative mx-auto"
                                        style={{ width: '100%', maxWidth: '450px', height: '700px' }}>
                                        {videoUrl ? (
                                            <video
                                                src={videoUrl}
                                                poster={reel.image || undefined}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                controls
                                                className="d-block w-100 h-100"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Image
                                                src={reelImg}
                                                alt={reel.title}
                                                title={reel.title}
                                                width={900}
                                                height={1400}
                                                sizes="(max-width: 576px) 92vw, (max-width: 992px) 80vw, 450px"
                                                className="d-block w-100 h-100 object-fit-cover"
                                                style={{ objectFit: 'cover' }}
                                                referrerPolicy="no-referrer"
                                            />
                                        )}
                                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>

                                        <div className="position-absolute top-0 start-0 p-4 w-100 d-flex justify-content-between align-items-center">
                                            <span className="badge bg-white text-dark px-3 py-2 rounded-pill fw-bold" style={{ opacity: 0.9 }}>
                                                {reel.category_label || (reel.category === 'sale' ? '🔥 აქცია' : reel.category === 'project' ? '🏗️ პროექტი' : '🆕 სიახლე')}
                                            </span>
                                            <button className="btn-close btn-close-white" onClick={() => setShow(false)}></button>
                                        </div>

                                        <div className="position-absolute bottom-0 start-0 p-5 text-white">
                                            <h2 className="fw-bold mb-3" style={{ fontFamily: '"Noto Serif Georgian", serif' }}>{reel.title}</h2>
                                            <p className="fs-5 mb-0 opacity-90">{reel.description || reel.content}</p>
                                            {detailsHref && (
                                                <Link
                                                    href={detailsHref}
                                                    className="btn btn-outline-light rounded-pill px-4 mt-4 py-2 fw-bold text-uppercase"
                                                    style={{ fontSize: '0.8rem', letterSpacing: '1px' }}
                                                    onClick={() => setShow(false)}
                                                >
                                                    დაწვრილებით
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </Carousel.Item>
                            );
                        })}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Reels;
