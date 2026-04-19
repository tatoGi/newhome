'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { Search, Package, FileText, Wrench, FolderOpen } from 'lucide-react';
import { api } from '@/lib/api/client';
import { SearchResult } from '@/lib/api/types';
import { resolveImageOrFallback } from '@/lib/api/assets';
import { useFallbackLogo } from '@/context/BootstrapContext';

const TYPE_LABELS: Record<string, string> = {
    product: 'პროდუქტი',
    blog:    'ბლოგი',
    service: 'სერვისი',
    project: 'პროექტი',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
    product: <Package size={14} />,
    blog:    <FileText size={14} />,
    service: <Wrench size={14} />,
    project: <FolderOpen size={14} />,
};

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const fallbackLogo = useFallbackLogo();
    const initialQ = searchParams.get('q') ?? '';

    const [inputValue, setInputValue] = useState(initialQ);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [query, setQuery] = useState(initialQ);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const doSearch = useCallback(async (q: string) => {
        if (q.trim().length < 2) {
            setResults([]);
            setSearched(true);
            return;
        }
        setLoading(true);
        try {
            const data = await api.search(q.trim());
            setResults(data.results);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    }, []);

    useEffect(() => {
        if (initialQ) {
            doSearch(initialQ);
        }
    }, [initialQ, doSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = inputValue.trim();
        if (!q) return;
        setQuery(q);
        router.replace(`/search?q=${encodeURIComponent(q)}`);
        doSearch(q);
    };

    return (
        <div className="py-5 min-vh-100 bg-light">
            <Container>
                {/* Search bar */}
                <div className="mb-5">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group input-group-lg shadow-sm" style={{ maxWidth: 680 }}>
                            <input
                                type="text"
                                className="form-control border-0 bg-white px-4"
                                placeholder="რისი ძებნა გსურთ?"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="btn btn-primary px-4">
                                <Search size={20} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* State: loading */}
                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                {/* State: no results */}
                {!loading && searched && results.length === 0 && (
                    <div className="text-center py-5 text-muted">
                        <Search size={48} className="mb-3 opacity-25" />
                        <p className="fs-5">
                            {query.length < 2
                                ? 'მინიმუმ 2 სიმბოლო შეიყვანეთ'
                                : `"${query}" — შედეგი ვერ მოიძებნა`}
                        </p>
                    </div>
                )}

                {/* Results */}
                {!loading && results.length > 0 && (
                    <>
                        <p className="text-muted mb-4 small">
                            <strong>{results.length}</strong> შედეგი — &ldquo;{query}&rdquo;
                        </p>
                        <Row className="g-3">
                            {results.map((item, i) => (
                                <Col key={i} xs={12} sm={6} lg={4}>
                                    <Link href={item.url} className="text-decoration-none">
                                        <div className="bg-white rounded-3 shadow-sm overflow-hidden h-100 d-flex flex-column search-result-card">
                                            <div style={{ height: 180, overflow: 'hidden', background: '#f5f5f5' }}>
                                                <img
                                                    src={resolveImageOrFallback(item.image, fallbackLogo)}
                                                    alt={item.title}
                                                    className="w-100 h-100"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="p-3 d-flex flex-column flex-grow-1">
                                                <span className="d-inline-flex align-items-center gap-1 badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1 mb-2 small">
                                                    {TYPE_ICONS[item.type]}
                                                    {TYPE_LABELS[item.type] ?? item.type}
                                                </span>
                                                <h6 className="fw-bold text-dark mb-1 lh-sm">{item.title}</h6>
                                                {item.excerpt && (
                                                    <p className="text-muted small mb-2 lh-sm flex-grow-1"
                                                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {item.excerpt}
                                                    </p>
                                                )}
                                                {item.price !== undefined && (
                                                    <p className="fw-bold text-primary mb-0">{item.price.toFixed(2)} ₾</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Container>

            <style dangerouslySetInnerHTML={{ __html: `
                .search-result-card { transition: transform 0.2s, box-shadow 0.2s; }
                .search-result-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
            ` }} />
        </div>
    );
}
