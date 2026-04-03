'use client';

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'motion/react';
import { allProjects } from '@/lib/data';
import { ArrowRight, MapPin } from 'lucide-react';
import { slugify } from '@/lib/slugify';
import { ProjectSection } from '@/lib/api/types';
import { toBackendAssetUrl } from '@/lib/api/assets';

interface FeaturedProjectsProps {
    projects?: any[];
    projectSection?: ProjectSection | null;
}

/** Extracts image/title/desc/location from a post's blocks (post_intro) with fallbacks. */
function resolvePostDisplay(post: any): { title: string; desc: string; image: string; location: string } {
    const introBlock = post.blocks?.find((b: any) => b.type === 'post_intro');

    const title = introBlock?.data?.title || post.title || '';
    const desc = introBlock?.data?.post_text || post.excerpt || '';
    const rawImage = introBlock?.data?.post_image || post.feature_image || '';
    const location = introBlock?.data?.location || introBlock?.data?.post_location || 'თბილისი';
    return { title, desc, image: toBackendAssetUrl(rawImage) || '/placeholder-project.jpg', location };
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects: propProjects, projectSection }) => {
    const sectionTitle = projectSection?.title || 'რჩეული პროექტები';
    const sectionSubtitle = projectSection?.subtitle || 'ჩვენი დასრულებული სამუშაოები და შთაგონება';

    const apiPosts = projectSection?.posts;

    let projects: { id: any; title: string; desc: string; image: string; location: string; slug: string }[];

    const sortByNewest = (arr: any[]) => [...arr].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

    if (apiPosts && apiPosts.length > 0) {
        projects = sortByNewest(apiPosts).slice(0, 3).map((p: any) => {
            const d = resolvePostDisplay(p);
            return { id: p.id, title: d.title, desc: d.desc, image: d.image, location: d.location, slug: p.slug as string };
        });
    } else if (propProjects && propProjects.length > 0) {
        projects = sortByNewest(propProjects).slice(0, 3).map((p: any) => {
            const d = resolvePostDisplay(p);
            return { id: p.id, title: d.title, desc: d.desc, image: d.image, location: d.location, slug: p.slug as string };
        });
    } else {
        projects = sortByNewest(allProjects as any[]).slice(0, 3);
    }

    return (
        <section className="py-5 overflow-hidden">
            <Container>
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="fw-bold display-6 mb-2">{sectionTitle}</h2>
                        <p className="text-muted mb-0">{sectionSubtitle}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Button as={Link as any} href="/projects" variant="link" className="text-primary text-decoration-none d-flex align-items-center gap-2 px-0">
                            ყველა პროექტი <ArrowRight size={18} />
                        </Button>
                    </motion.div>
                </div>

                <Row className="gy-5">
                    {projects.map((project, index) => (
                        <Col key={project.id} lg={index === 0 ? 12 : 6}>
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: index * 0.1 }}
                                className="project-highlight-card"
                            >
                                <Link href={`/project/${slugify(project.slug)}`} className="text-decoration-none group">
                                    <div className={`position-relative overflow-hidden rounded-4 shadow-lg ${index === 0 ? 'ratio ratio-21x9' : 'ratio ratio-16x9'}`}>
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="object-fit-cover transition-transform duration-700 hover-scale-110"
                                        />
                                        <div className="position-absolute inset-0 bg-gradient-to-t from-black opacity-60" />
                                        <div className="position-absolute bottom-0 start-0 p-4 p-md-5 text-white w-100">
                                            <div className="d-flex align-items-center gap-2 mb-2 opacity-80">
                                                <MapPin size={16} />
                                                <span className="small text-uppercase tracking-wider">{project.location}</span>
                                            </div>
                                            <h3 className={`${index === 0 ? 'display-5' : 'h2'} fw-bold mb-3`}>{project.title}</h3>
                                            <p className={`mb-4 opacity-80 line-clamp-2 ${index === 0 ? 'lead mw-50' : 'small'}`}>
                                                {project.desc}
                                            </p>
                                            <div className="d-inline-flex align-items-center gap-2 border-bottom border-white pb-1 fw-bold text-uppercase tracking-widest small">
                                                პროექტის ნახვა <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </Container>
            <style jsx>{`
        .mw-50 {
          max-width: 600px;
        }
        .duration-700 {
          transition-duration: 700ms;
        }
        .hover-scale-110:hover {
          transform: scale(1.05);
        }
        .inset-0 {
          top: 0; right: 0; bottom: 0; left: 0;
        }
        .bg-gradient-to-t {
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </section>
    );
};

export default FeaturedProjects;
