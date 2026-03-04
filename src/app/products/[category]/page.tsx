import type { Metadata } from 'next';
import ProductsPage from '../ProductsPage';

const categoryLabels: Record<string, string> = {
  lighting: 'განათება',
  furniture: 'ავეჯი',
  new: 'სიახლეები',
  sale: 'ფასდაკლებები',
};

export async function generateStaticParams() {
  return Object.keys(categoryLabels).map(category => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const label = categoryLabels[category] ?? category;
  return {
    title: label,
    description: `${label} — NewHome.ge-ს კოლექცია. საუკეთესო ხარისხი, სწრაფი მიწოდება.`,
    alternates: { canonical: `https://newhome.ge/products/${category}` },
  };
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <ProductsPage initialCategory={category} />;
}
