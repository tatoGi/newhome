'use client';

import React, { useState } from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface Reel {
    id: number;
    title: string;
    image: string;
    category: 'sale' | 'project' | 'new';
    content: string;
}

const reelsData: Reel[] = [
    {
        id: 1,
        title: "Sale -20%",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=400&h=400&q=80",
        category: 'sale',
        content: "ექსკლუზიური ფასდაკლება სკანდინავიურ ავეჯზე! მხოლოდ ამ კვირაში."
    },
    {
        id: 2,
        title: "Eco Villa",
        image: "https://images.unsplash.com/photo-1600585154340-be6199fbf10c?auto=format&fit=crop&w=400&h=400&q=80",
        category: 'project',
        content: "ჩვენი ახალი პროექტი საგურამოში - ეკო მეგობრული დიზაინი."
    },
    {
        id: 3,
        title: "New Light",
        image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=400&h=400&q=80",
        category: 'new',
        content: "ახალი კოლექცია იტალიიდან - განათება თქვენი სიმშვიდისთვის."
    },
    {
        id: 4,
        title: "Modern Loft",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&h=400&q=80",
        category: 'project',
        content: "ლოფტის სტილის აპარტამენტის სრული რემონტი და დიზაინი."
    },
    {
        id: 5,
        title: "Smart Home",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&h=400&q=80",
        category: 'new',
        content: "ინტეგრირებული სმარტ სისტემები თქვენს ყოველდღიურობაში."
    },
    {
        id: 6,
        title: "Night Sale",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&h=400&q=80",
        category: 'sale',
        content: "ღამის აქცია! -15% ყველა ტიპის ჭაღზე."
    }
];

const Reels: React.FC = () => {
    const [show, setShow] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleOpen = (index: number) => {
        setActiveIndex(index);
        setShow(true);
    };

    return (
        <div className="py-4 bg-white border-bottom reels-section">
            <div className="container overflow-auto hide-scrollbar">
                <div className="d-flex gap-4 py-2" style={{ minWidth: 'max-content' }}>
                    {reelsData.map((reel, index) => (
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
                                    <img src={reel.image} alt={reel.title} className="reel-img" referrerPolicy="no-referrer" />
                                    <div className="reel-play-icon">
                                        <Play size={14} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                            <p className="small mb-0 mt-2 fw-medium text-truncate text-dark">{reel.title}</p>
                        </motion.div>
                    ))}
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
                        {reelsData.map((reel) => (
                            <Carousel.Item key={reel.id}>
                                <div className="reel-viewer-content rounded-4 overflow-hidden position-relative mx-auto"
                                    style={{ width: '100%', maxWidth: '450px', height: '700px' }}>
                                    <img
                                        className="d-block w-100 h-100 object-fit-cover"
                                        src={reel.image}
                                        alt={reel.title}
                                        referrerPolicy="no-referrer"
                                    />
                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>

                                    <div className="position-absolute top-0 start-0 p-4 w-100 d-flex justify-content-between align-items-center">
                                        <span className="badge bg-white text-dark px-3 py-2 rounded-pill fw-bold" style={{ opacity: 0.9 }}>
                                            {reel.category === 'sale' ? '🔥 აქცია' : reel.category === 'project' ? '🏗️ პროექტი' : '🆕 სიახლე'}
                                        </span>
                                        <button className="btn-close btn-close-white" onClick={() => setShow(false)}></button>
                                    </div>

                                    <div className="position-absolute bottom-0 start-0 p-5 text-white">
                                        <h2 className="fw-bold mb-3" style={{ fontFamily: '"Noto Serif Georgian", serif' }}>{reel.title}</h2>
                                        <p className="fs-5 mb-0 opacity-90">{reel.content}</p>
                                        <button className="btn btn-outline-light rounded-pill px-4 mt-4 py-2 fw-bold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                                            დაწვრილებით
                                        </button>
                                    </div>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Reels;
