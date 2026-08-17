'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  category?: string;
  design?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  message?: string;
  status: string;
  createdAt: string;
}

export default function AdminEnquiries() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
      return;
    }

    if (status === 'authenticated') {
      fetchEnquiries();
    }
  }, [status]);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries');
      const data = await res.json();
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchEnquiries();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Hi ${name}, this is AR Decor. We received your enquiry and would like to discuss your event requirements.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const filteredEnquiries = filterStatus === 'all' 
    ? enquiries 
    : enquiries.filter(e => e.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-serif font-bold text-gray-900">Customer Enquiries</h1>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4 overflow-x-auto">
            <Link href="/admin/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Dashboard</Link>
            <Link href="/admin/categories" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Categories</Link>
            <Link href="/admin/designs" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Designs</Link>
            <Link href="/admin/enquiries" className="px-3 py-2 text-sm font-medium text-amber-600 border-b-2 border-amber-600 whitespace-nowrap">Enquiries</Link>
            <Link href="/admin/settings" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-amber-600 whitespace-nowrap">Settings</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{enquiry.name}</div>
                    <div className="text-sm text-gray-500">{enquiry.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{enquiry.category || 'General'}</div>
                    {enquiry.design && <div className="text-sm text-gray-500">{enquiry.design}</div>}
                  </td>
                  <td className="px-6 py-4">
                    {enquiry.eventDate && <div className="text-sm text-gray-900">{enquiry.eventDate}</div>}
                    {enquiry.location && <div className="text-sm text-gray-500">{enquiry.location}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={enquiry.status}
                      onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 ${
                        enquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        enquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                        enquiry.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        enquiry.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openWhatsApp(enquiry.phone, enquiry.name)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
