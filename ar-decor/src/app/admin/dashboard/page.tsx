'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({ categories: 0, designs: 0, enquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats, but don't wait forever if DB is empty
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats (DB might be empty)', error);
      } finally {
        // Force stop loading after 1 second even if DB is empty
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-yellow-500">AR Decor Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase">Total Categories</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.categories}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase">Total Designs</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.designs}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase">Total Enquiries</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.enquiries}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/categories" className="bg-yellow-600 hover:bg-yellow-700 text-white p-6 rounded-lg text-center font-bold transition">
          Manage Categories
        </Link>
        <Link href="/admin/designs" className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-lg text-center font-bold transition">
          Manage Designs
        </Link>
        <Link href="/admin/enquiries" className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-lg text-center font-bold transition">
          View Enquiries
        </Link>
        <Link href="/admin/settings" className="bg-gray-700 hover:bg-gray-600 text-white p-6 rounded-lg text-center font-bold transition">
          Website Settings
        </Link>
      </div>

      {stats.categories === 0 && (
        <div className="mt-8 p-6 bg-blue-900/30 border border-blue-800 rounded-lg">
          <h2 className="text-xl font-bold text-blue-400 mb-2">Getting Started</h2>
          <p className="text-gray-300 mb-4">Your database is currently empty. To start building your website:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-400">
            <li>Go to <Link href="/admin/categories" className="text-yellow-400 underline">Categories</Link> and add your first category (e.g., "Birthday Decor").</li>
            <li>Then go to <Link href="/admin/designs" className="text-yellow-400 underline">Designs</Link> to upload photos for that category.</li>
            <li>Use <Link href="/admin/settings" className="text-yellow-400 underline">Settings</Link> to change the website title and contact info.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
