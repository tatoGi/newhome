import { Metadata } from 'next';
import { api } from '@/lib/api/client';
import HomePage from '../HomePage';
import AboutPage from '../about/AboutPage';
import ContactPage from '../contact/ContactPage';
import ProductsPage from '../products/ProductsPage';
import ProjectsPage from '../projects/ProjectsPage';
import ServicesPage from '../services/ServicesPage';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { toBackendAssetUrl } from '@/lib/api/assets';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ locale?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { locale } = await searchParams;

    // If slug is 'home', we might want to redirect to root or just handle it
    if (slug === 'home') {
        // Handled below but let's fetch for metadata
    }

    try {
        const data = await api.getPage(slug, locale);
        return {
            title: data.seo.meta_title || data.page.title,
            description: data.seo.meta_description,
            keywords: data.seo.keywords,
            alternates: {
                canonical: data.seo.canonical_url || `https://newhome.ge/${slug}`,
            },
        };
    } catch {
        return {
            title: 'NewHome',
        };
    }
}

export default async function Page({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { locale } = await searchParams;

    // Handle 'home' slug by redirecting to root or rendering HomePage
    if (slug === 'home') {
        redirect('/');
    }

    try {
        const data = await api.getPage(slug, locale);

        if (!data || !data.page) {
            return notFound();
        }

        // Determine component based on template
        const template = data.page.template;

        if (template === 'home') {
            return <HomePage data={data} />;
        }

        if (template === 'about') {
            return <AboutPage data={data} />;
        }

        if (template === 'contact') {
            return (
                <ContactPage
                    pageTitle={data.page.title}
                    pageDescription={data.page.description}
                    blocks={data.page.blocks}
                />
            );
        }

        if (template === 'products' || template === 'product-listing') {
            return (
                <ProductsPage
                    products={data.relations.products}
                    pageTitle={data.page.title}
                    pageDescription={data.page.description}
                    blocks={data.page.blocks}
                />
            );
        }

        if (template === 'service' || template === 'services') {
            return (
                <ServicesPage
                    posts={data.relations.posts}
                    pageTitle={data.page.title}
                    pageDescription={data.page.description}
                    blocks={data.page.blocks}
                />
            );
        }

        if (template === 'project' || template === 'projects') {
            return (
                <ProjectsPage
                    posts={data.relations.posts}
                    pageTitle={data.page.title}
                    pageDescription={data.page.description}
                    blocks={data.page.blocks}
                />
            );
        }

        // Default basic rendering for other CMS pages if needed
        const relatedPosts = data.relations?.posts ?? [];
        const relatedProducts = data.relations?.products ?? [];
        const hasSidebar = relatedPosts.length > 0 || relatedProducts.length > 0;

        return (
            <div className="py-5 bg-white min-vh-100">
                <div className="container">
                    <div className="row g-5">
                        <div className={hasSidebar ? 'col-lg-8' : 'col-12'}>
                            <h1 className="fw-bold mb-4">{data.page.title}</h1>
                            {data.page.description && (
                                <div
                                    className="cms-content lh-lg"
                                    dangerouslySetInnerHTML={{ __html: data.page.description }}
                                />
                            )}
                        </div>

                        {hasSidebar && (
                            <div className="col-lg-4">
                                <div className="sticky-top" style={{ top: '100px' }}>
                                    {relatedPosts.length > 0 && (
                                        <div className="mb-5">
                                            <h5 className="fw-bold mb-3 pb-2 border-bottom">დაკავშირებული სტატიები</h5>
                                            <div className="row g-3">
                                                {relatedPosts.map((p: any) => (
                                                    <div key={p.slug} className="col-6">
                                                        <Link href={`/blog/${p.slug}`} className="text-decoration-none text-dark d-block">
                                                            <div className="rounded-3 overflow-hidden mb-2" style={{ height: 100, backgroundColor: '#f5f5f5' }}>
                                                                {p.feature_image ? (
                                                                    <img
                                                                        src={toBackendAssetUrl(p.feature_image)}
                                                                        alt={p.title}
                                                                        className="w-100 h-100"
                                                                        style={{ objectFit: 'cover' }}
                                                                    />
                                                                ) : null}
                                                            </div>
                                                            <p className="small fw-semibold mb-0 lh-sm" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {p.title}
                                                            </p>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {relatedProducts.length > 0 && (
                                        <div>
                                            <h5 className="fw-bold mb-3 pb-2 border-bottom">დაკავშირებული პროდუქტები</h5>
                                            <div className="row g-3">
                                                {relatedProducts.map((p: any) => (
                                                    <div key={p.id} className="col-6">
                                                        <Link href={`/product/${p.slug}`} className="text-decoration-none text-dark d-block">
                                                            <div className="rounded-3 overflow-hidden mb-2" style={{ height: 130, backgroundColor: '#f5f5f5' }}>
                                                                {p.feature_image ? (
                                                                    <img
                                                                        src={toBackendAssetUrl(p.feature_image)}
                                                                        alt={p.title}
                                                                        className="w-100 h-100"
                                                                        style={{ objectFit: 'cover' }}
                                                                    />
                                                                ) : null}
                                                            </div>
                                                            <p className="small fw-semibold mb-1 lh-sm" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {p.title}
                                                            </p>
                                                            <span className="fw-bold small" style={{ color: '#D9534F' }}>{Number(p.price)} ₾</span>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );

    } catch (error) {
        console.error(`Failed to fetch page data for slug: ${slug}`, error);
        return notFound();
    }
}
