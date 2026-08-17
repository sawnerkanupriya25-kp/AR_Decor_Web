import { Metadata } from 'next';
import SectionPage from '@/components/SectionPage';

export const metadata: Metadata = {
  title: 'Wedding Entries | AR Decor',
  description: 'Make your special moments unforgettable with spectacular entries and setups.',
};

export default function WeddingEntriesPage() {
  return <SectionPage sectionSlug="wedding-entries" sectionTitle="Wedding Entries" />;
}
