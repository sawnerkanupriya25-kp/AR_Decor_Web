'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Settings {
  siteTitle: string;
  tagline: string;
  heroHeading: string;
  heroDescription: string;
  contactNumber: string;
  whatsappNumber: string;
  instagramLink: string;
  footerContent: string;
}

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    siteTitle: 'AR Decor',
    tagline: 'We Decorate Your Moments, You Create the Memories.',
    heroHeading: 'AR DECOR',
    heroDescription: 'We Decorate Your Moments, You Create the Memories.',
    contactNumber: '8269037288',
    whatsappNumber: '8269037288',
    instagramLink: '',
    footerContent: 'AR Decor - We Decorate Your Moments, You Create the Memories.',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
      return;
    }

    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
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
            <h1 className="text-2xl font-serif font-bold text-gray-900">Website Settings</h1>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4 overflow-x-auto">
            <Link href="/admin/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Dashboard</Link>
            <Link href="/admin/categories" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Categories</Link>
            <Link href="/admin/designs" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Designs</Link>
            <Link href="/admin/enquiries" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Enquiries</Link>
            <Link href="/admin/settings" className="px-3 py-2 text-sm font-medium text-amber-600 border-b-2 border-amber-600 whitespace-nowrap">Settings</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Heading</label>
                <input
                  type="text"
                  value={settings.heroHeading}
                  onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Description</label>
                <textarea
                  value={settings.heroDescription}
                  onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="text"
                  value={settings.contactNumber}
                  onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Link</label>
                <input
                  type="url"
                  value={settings.instagramLink}
                  onChange={(e) => setSettings({ ...settings, instagramLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="https://instagram.com/ardecor"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Footer</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Content</label>
              <textarea
                value={settings.footerContent}
                onChange={(e) => setSettings({ ...settings, footerContent: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
