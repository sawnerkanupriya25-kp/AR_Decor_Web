'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import BookingModal from '@/components/BookingModal';

interface Section {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
}

interface Design {
  _id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  featured: boolean;
}

export default function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [featuredDesigns, setFeaturedDesigns] = useState<Design[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  useEffect(() => {
    fetch('/api/sections')
      .then(res => res.json())
      .then(data => setSections(data))
      .catch(console.error);

    fetch('/api/designs?featured=true')
      .then(res => res.json())
      .then(data => setFeaturedDesigns(data))
      .catch(console.error);

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const handleBookNow = (design: Design) => {
    setSelectedDesign(design);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${settings.hero_image || 'https://images.unsplash.com/photo-1519225421980-715cb0202128?w=1920'})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
          >
            {settings.hero_heading || 'AR DECOR'}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8"
          >
            {settings.site_tagline || '"We Decorate Your Moments, You Create the Memories."'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/balloon-decor"
              className="btn-premium inline-block"
            >
              Explore Decorations
            </Link>
            <Link
              href="/wedding-entries"
              className="btn-outline-gold inline-block bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black"
            >
              Wedding Entries
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Main Service Options */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-premium relative overflow-hidden rounded-2xl shadow-xl group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={section.coverImage}
                    alt={section.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl font-bold text-white mb-3">{section.name}</h3>
                    <p className="text-gray-300 mb-6">{section.description}</p>
                    <Link
                      href={`/${section.slug}`}
                      className="btn-premium inline-block"
                    >
                      Explore {section.name}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Designs */}
      {featuredDesigns.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient-gold">Our Featured Designs</span>
              </h2>
              <p className="text-gray-600 text-lg">Handpicked creations that showcase our excellence</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDesigns.slice(0, 6).map((design, index) => (
                <motion.div
                  key={design._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-premium bg-[#FAF9F6] rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="aspect-square overflow-hidden image-zoom-container">
                    {design.mediaType === 'video' ? (
                      <video
                        src={design.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : (
                      <img
                        src={design.mediaUrl}
                        alt={design.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{design.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{design.description}</p>
                    <button
                      onClick={() => handleBookNow(design)}
                      className="btn-premium w-full"
                    >
                      BOOK NOW
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer settings={settings} />
      <WhatsAppButton />
      
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDesign(null);
        }}
        design={selectedDesign || undefined}
      />
    </div>
  );
}
