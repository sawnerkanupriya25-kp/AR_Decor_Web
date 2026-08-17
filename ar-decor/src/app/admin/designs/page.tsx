'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Design {
  _id: string;
  title: string;
  categoryId: string;
  mediaType: string;
  mediaUrl: string;
  featured: boolean;
  active: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminDesigns() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    mediaType: 'image',
    mediaUrl: '',
    featured: false,
    active: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [designsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/designs'),
        fetch('/api/admin/categories'),
      ]);

      const designsData = await designsRes.json();
      const categoriesData = await categoriesRes.json();

      setDesigns(designsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/admin/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
        setFormData({
          title: '',
          categoryId: '',
          mediaType: 'image',
          mediaUrl: '',
          featured: false,
          active: true,
        });
      } else {
        alert('Error saving design');
      }
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Error saving design');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;

    try {
      const res = await fetch(`/api/admin/designs?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData();
      } else {
        alert('Error deleting design');
      }
    } catch (error) {
      console.error('Error deleting design:', error);
      alert('Error deleting design');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-serif font-bold text-gray-900">Manage Designs</h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Design
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4 overflow-x-auto">
            <Link href="/admin/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Dashboard</Link>
            <Link href="/admin/categories" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Categories</Link>
            <Link href="/admin/designs" className="px-3 py-2 text-sm font-medium text-amber-600 border-b-2 border-amber-600 whitespace-nowrap">Designs</Link>
            <Link href="/admin/enquiries" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Enquiries</Link>
            <Link href="/admin/settings" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Settings</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div key={design._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {design.mediaType === 'video' ? (
                <video src={design.mediaUrl} className="w-full h-48 object-cover" controls />
              ) : (
                <img src={design.mediaUrl} alt={design.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{design.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {categories.find(c => c._id === design.categoryId)?.name || 'Unknown'}
                </p>
                <div className="flex gap-2 mt-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${design.featured ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                    {design.featured ? 'Featured' : 'Regular'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${design.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {design.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(design._id)}
                  className="mt-3 text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add Design</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                <select
                  value={formData.mediaType}
                  onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media URL</label>
                <input
                  type="url"
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">Featured</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">Active</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
