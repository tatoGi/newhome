import type { Metadata } from 'next';
import BlogListPage from './BlogListPage';

export const metadata: Metadata = {
  title: 'ბლოგი / სიახლეები',
  description: 'HomSpace-ის ბლოგი — ინტერიერის სიახლეები და ტენდენციები.',
  alternates: { canonical: 'https://homespace.ge/blog' },
};

export default function Page() {
  return <BlogListPage data={null} />;
}
