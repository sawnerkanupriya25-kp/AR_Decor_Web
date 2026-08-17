'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Clock, ChevronRight, PlayCircle } from 'lucide-react';
import BookingModal from './BookingModal';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  designCount?: number;
}

interface Design {
  _id: string;
  title: string;
  description?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  featured: boolean;
}

interface SectionPageProps {
  sectionSlug: string;
  sectionTitle: string;
}

export default function SectionPage({ sectionSlug, sectionTitle }: SectionPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [bookingDesign, setBookingDesign] = useState<Design | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [sectionSlug]);

  useEffect(() => {
    if (selectedCategory) {
      fetchDesigns(selectedCategory._id);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/admin/categories?section=${sectionSlug}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesigns = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/admin/designs?category=${categoryId}`);
      if (res.ok) {
        const data = await res.json();
        setDesigns(data.designs || []);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
    }
  };

  const handleViewDesigns = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setDesigns([]);
  };

  const handleBookNow = (design: Design) => {
    setBookingDesign(design);
    setIsModalOpen(true);
  };

  const getSectionColor = () => {
    return sectionSlug === 'balloon-decor' ? 'from-pink-500 to-purple-600' : 'from-amber-500 to-orange-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getSectionColor()} text-white py-16`}>
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{sectionTitle}</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {sectionSlug === 'balloon-decor'
              ? 'Beautiful, creative & customized decorations for every celebration.'
              : 'Make your special moments unforgettable with spectacular entries and setups.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {!selectedCategory ? (
          /* Categories Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category._id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  {category.coverImage ? (
                    <img
                      src={category.coverImage}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getSectionColor()} flex items-center justify-center`}>
                      <span className="text-white text-6xl font-bold opacity-30">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    {category.designCount !== undefined && (
                      <p className="text-sm opacity-90">{category.designCount} designs available</p>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6 line-clamp-2">{category.description}</p>
                  <button
                    onClick={() => handleViewDesigns(category)}
                    className={`w-full bg-gradient-to-r ${getSectionColor()} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    View Designs
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Designs Gallery */
          <div>
            <button
              onClick={handleBackToCategories}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gold-600 mb-8 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Categories
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCategory.name}</h2>
              <p className="text-gray-600">{selectedCategory.description}</p>
            </div>

            {designs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No designs yet</h3>
                <p className="text-gray-500">Check back soon for new designs in this category!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design) => (
                  <div
                    key={design._id}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      {design.mediaType === 'video' ? (
                        <>
                          <video
                            src={design.mediaUrl}
                            poster={design.thumbnailUrl}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={design.mediaUrl}
                          alt={design.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      {design.featured && (
                        <div className="absolute top-3 right-3 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{design.title}</h3>
                      {design.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{design.description}</p>
                      )}
                      <button
                        onClick={() => handleBookNow(design)}
                        className={`w-full bg-gradient-to-r ${getSectionColor()} text-white py-2 px-4 rounded-lg font-medium hover:shadow-md transition-all duration-300`}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingDesign && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setBookingDesign(null);
          }}
          design={{
            _id: bookingDesign._id,
            title: bookingDesign.title,
            description: bookingDesign.description || '',
            mediaUrl: bookingDesign.mediaUrl,
            mediaType: bookingDesign.mediaType,
          }}
          category={{
            _id: selectedCategory?._id,
            name: selectedCategory?.name || '',
          }}
        />
      )}
    </div>
  );
}
