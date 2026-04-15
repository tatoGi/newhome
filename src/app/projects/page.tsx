import type { Metadata } from 'next';
import ProjectsPage from './ProjectsPage';

export const metadata: Metadata = {
  title: 'პროექტები',
  description: 'HomSpace-ის განხორციელებული ინტერიერის დიზაინის პროექტები — საცხოვრებელი და კომერციული სივრცეები.',
  alternates: { canonical: 'https://homespace.ge/projects' },
};

export default function Page() {
  return <ProjectsPage posts={undefined} pageTitle={undefined} pageDescription={undefined} blocks={undefined} />;
}
