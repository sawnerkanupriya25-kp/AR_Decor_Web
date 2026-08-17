import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import SectionPage from '@/components/SectionPage';

export const metadata: Metadata = {
  title: 'Balloon Decor | AR Decor',
  description: 'Beautiful, creative & customized balloon decorations for every celebration.',
};

export default function BalloonDecorPage() {
  return <SectionPage sectionSlug="balloon-decor" sectionTitle="Balloon Decor" />;
}
