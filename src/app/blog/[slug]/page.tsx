import type { Metadata } from 'next';
import { api } from '@/lib/api/client';
import { Container, Row, Col } from 'react-bootstrap';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { toBackendAssetUrl } from '@/lib/api/assets';

export async function generateMetadata({ params, searchParams }: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ locale?: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const { locale } = await searchParams;
    const data = await api.getBlog(slug, locale);
    const p = data.post;

    return {
        title: data.seo?.meta_title || p.title,
        description: data.seo?.meta_description || p.excerpt || undefined,
        alternates: { canonical: data.seo?.canonical_url || `https://newhome.ge/blog/${slug}` },
        openGraph: {
            title: data.seo?.meta_title || p.title,
            description: data.seo?.meta_description || undefined,
            images: p.feature_image ? [{ url: p.feature_image }] : [],
        },
    };
}

export default async function Page({ params, searchParams }: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ locale?: string }>
}) {
    const { slug } = await params;
    const { locale } = await searchParams;
    const data = await api.getBlog(slug, locale);

    if (!data || !data.post) return <div>პოსტი ვერ მოიძებნა</div>;

    const post = data.post;
    const relatedPosts = (data.relations?.posts ?? []).filter((p: any) => p.slug !== slug).slice(0, 6);
    const dateStr = new Date(post.published_at).toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="py-5 bg-white min-vh-100">
            <Container>
                <Row className="g-5">
                    {/* Main content */}
                    <Col lg={8}>
                        <div className="mb-4">
                            <span className="badge bg-primary rounded-pill px-3 py-2 mb-3">ბლოგი</span>
                            <h1 className="display-5 fw-bold mb-4">{post.title}</h1>

                            <div className="d-flex gap-4 text-muted small mb-5 pb-4 border-bottom">
                                <span className="d-flex align-items-center gap-2">
                                    <Calendar size={16} /> {dateStr}
                                </span>
                                <span className="d-flex align-items-center gap-2">
                                    <User size={16} /> NewHome Team
                                </span>
                            </div>
                        </div>

                        {post.feature_image && (
                            <div className="mb-5 rounded-4 overflow-hidden shadow-sm">
                                <img
                                    src={toBackendAssetUrl(post.feature_image)}
                                    alt={post.title}
                                    className="w-100 h-auto"
                                />
                            </div>
                        )}

                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </Col>

                    {/* Sticky sidebar */}
                    <Col lg={4}>
                        <div className="sticky-top" style={{ top: '100px' }}>
                            {relatedPosts.length > 0 && (
                                <div>
                                    <h5 className="fw-bold mb-3 pb-2 border-bottom">მსგავსი სტატიები</h5>
                                    <Row className="g-3">
                                        {relatedPosts.map((p: any) => (
                                            <Col key={p.slug} xs={6}>
                                                <Link href={`/blog/${p.slug}`} className="text-decoration-none text-dark d-block">
                                                    <div className="rounded-3 overflow-hidden mb-2" style={{ height: 110, backgroundColor: '#f5f5f5' }}>
                                                        {p.feature_image ? (
                                                            <img
                                                                src={toBackendAssetUrl(p.feature_image)}
                                                                alt={p.title}
                                                                className="w-100 h-100"
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">No image</div>
                                                        )}
                                                    </div>
                                                    <p
                                                        className="small fw-semibold mb-0 lh-sm"
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {p.title}
                                                    </p>
                                                    {p.category && (
                                                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>{p.category}</span>
                                                    )}
                                                </Link>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        .blog-content p { margin-bottom: 1.5rem; line-height: 1.8; color: #333; }
                        .blog-content h2 { margin-top: 2.5rem; margin-bottom: 1.5rem; font-weight: 700; }
                        .blog-content img { max-width: 100%; border-radius: 0.5rem; }
                    `,
                }}
            />
        </div>
    );
}
