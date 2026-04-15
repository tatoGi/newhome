import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Row, Col } from 'react-bootstrap';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { getAllBlogs } from '@/lib/data';

export function generateStaticParams() {
    return getAllBlogs().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getAllBlogs().find(p => p.slug === slug);
    if (!post) return { title: 'ბლოგი' };
    return {
        title: post.title,
        description: post.excerpt,
        alternates: { canonical: `https://newhome.ge/blog/${slug}` },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://newhome.ge/blog/${slug}`,
            images: post.image ? [{ url: post.image }] : [],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getAllBlogs().find(p => p.slug === slug);

    if (!post) notFound();

    const relatedPosts = getAllBlogs().filter(p => p.slug !== slug).slice(0, 3);

    return (
        <div className="py-5 bg-white min-vh-100">
            <Container>
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/">მთავარი</Link></li>
                        <li className="breadcrumb-item"><Link href="/blog">ბლოგი</Link></li>
                        <li className="breadcrumb-item active">{post.title}</li>
                    </ol>
                </nav>

                <div className="mb-5">
                    <span className="badge bg-primary rounded-pill px-3 py-2 mb-3 d-inline-block">ბლოგი</span>
                    <h1 className="display-5 fw-bold mb-3">{post.title}</h1>
                    <div className="d-flex gap-4 text-muted small pb-4 border-bottom">
                        <span className="d-flex align-items-center gap-2">
                            <Calendar size={16} /> {post.date}
                        </span>
                        <span className="d-flex align-items-center gap-2">
                            <User size={16} /> {post.author}
                        </span>
                    </div>
                </div>

                <Row className="g-5">
                    {post.image && (
                        <Col lg={5} className="d-flex align-items-start">
                            <div className="rounded-4 overflow-hidden shadow-sm w-100 sticky-top" style={{ top: '100px' }}>
                                <img src={post.image} alt={post.title} className="w-100 h-auto d-block" />
                            </div>
                        </Col>
                    )}
                    <Col lg={post.image ? 7 : 8}>
                        <p className="lead">{post.excerpt}</p>

                        {relatedPosts.length > 0 && (
                            <div className="mt-5 pt-4 border-top">
                                <h5 className="fw-bold mb-3">მსგავსი სტატიები</h5>
                                <Row className="g-3">
                                    {relatedPosts.map(p => (
                                        <Col key={p.slug} xs={6} md={4}>
                                            <Link href={`/blog/${p.slug}`} className="text-decoration-none text-dark d-block">
                                                <div className="rounded-3 overflow-hidden mb-2" style={{ height: 110, backgroundColor: '#f5f5f5' }}>
                                                    <img src={p.image} alt={p.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                </div>
                                                <p className="small fw-semibold mb-0 lh-sm" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {p.title}
                                                </p>
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
