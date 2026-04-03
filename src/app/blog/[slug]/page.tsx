import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api/client';
import { Container, Row, Col } from 'react-bootstrap';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { toBackendAssetUrl } from '@/lib/api/assets';
import { getServerLocale } from '@/lib/locale';

export async function generateStaticParams() {
    try {
        const bootstrap = await api.getBootstrap();
        const blogRoute = bootstrap.routeMap.find((r) => r.template === 'blog' || r.template === 'news');
        if (!blogRoute) return [];
        const data = await api.getPage(blogRoute.slug);
        return (data.relations?.posts ?? []).map((p) => ({ slug: p.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    try {
        const { slug } = await params;
        const locale = await getServerLocale();
        const data = await api.getBlog(slug, locale || undefined);
        const p = data.post;
        return {
            title: data.seo?.meta_title || p.title,
            description: data.seo?.meta_description || p.excerpt || undefined,
            alternates: { canonical: data.seo?.canonical_url || `https://newhome.ge/blog/${slug}` },
            openGraph: {
                title: data.seo?.meta_title || p.title,
                description: data.seo?.meta_description || undefined,
                images: p.feature_image ? [{ url: toBackendAssetUrl(p.feature_image) || '' }] : [],
            },
        };
    } catch {
        return { title: 'ბლოგი' };
    }
}

export default async function Page({ params }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const locale = await getServerLocale();

    let data;
    try {
        data = await api.getBlog(slug, locale || undefined);
    } catch {
        notFound();
    }

    if (!data?.post) notFound();

    const post = data.post;
    const relatedPosts = (data.relations?.posts ?? []).filter((p: any) => p.slug !== slug).slice(0, 6);

    const dateStr = post.published_at
        ? String(post.published_at)
        : '';

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

                <Row className="g-5">
                    {/* Main content */}
                    <Col lg={8}>
                        <span className="badge bg-primary rounded-pill px-3 py-2 mb-3 d-inline-block">ბლოგი</span>
                        <h1 className="display-5 fw-bold mb-4">{post.title}</h1>

                        <div className="d-flex gap-4 text-muted small mb-5 pb-4 border-bottom">
                            {dateStr && (
                                <span className="d-flex align-items-center gap-2">
                                    <Calendar size={16} /> {dateStr}
                                </span>
                            )}
                            <span className="d-flex align-items-center gap-2">
                                <User size={16} /> NewHome Team
                            </span>
                        </div>

                        {post.feature_image && (
                            <div className="mb-5 rounded-4 overflow-hidden shadow-sm">
                                <img
                                    src={toBackendAssetUrl(post.feature_image) || post.feature_image}
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

                    {/* Sidebar */}
                    {relatedPosts.length > 0 && (
                        <Col lg={4}>
                            <div className="sticky-top" style={{ top: '100px' }}>
                                <h5 className="fw-bold mb-3 pb-2 border-bottom">მსგავსი სტატიები</h5>
                                <Row className="g-3">
                                    {relatedPosts.map((p: any) => (
                                        <Col key={p.slug} xs={6}>
                                            <Link href={`/blog/${p.slug}`} className="text-decoration-none text-dark d-block">
                                                <div className="rounded-3 overflow-hidden mb-2" style={{ height: 110, backgroundColor: '#f5f5f5' }}>
                                                    {p.feature_image ? (
                                                        <img
                                                            src={toBackendAssetUrl(p.feature_image) || p.feature_image}
                                                            alt={p.title}
                                                            className="w-100 h-100"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted small">სურათი არ არის</div>
                                                    )}
                                                </div>
                                                <p className="small fw-semibold mb-0 lh-sm" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
                        </Col>
                    )}
                </Row>
            </Container>

            <style dangerouslySetInnerHTML={{
                __html: `
                    .blog-content p { margin-bottom: 1.5rem; line-height: 1.8; color: #333; }
                    .blog-content h2, .blog-content h3 { margin-top: 2.5rem; margin-bottom: 1rem; font-weight: 700; }
                    .blog-content img { max-width: 100%; border-radius: 0.5rem; }
                    .blog-content strong { color: #1a1a1a; }
                    .blog-content ul, .blog-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; line-height: 1.8; }
                `
            }} />
        </div>
    );
}
