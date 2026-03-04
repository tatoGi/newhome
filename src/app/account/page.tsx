import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ანგარიში',
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <div className="container py-5 text-center">
      <h1 className="h3 mb-3">პირადი კაბინეტი</h1>
      <p className="text-muted">მალე დაემატება</p>
    </div>
  );
}
