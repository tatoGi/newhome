import type { Metadata } from 'next';
import ProjectsPage from './ProjectsPage';

export const metadata: Metadata = {
  title: 'პროექტები',
  description: 'NewHome-ის განხორციელებული ინტერიერის დიზაინის პროექტები — საცხოვრებელი და კომერციული სივრცეები.',
  alternates: { canonical: 'https://newhome.ge/projects' },
};

export default function Page() {
  return <ProjectsPage />;
}
