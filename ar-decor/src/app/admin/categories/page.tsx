'use client';

import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', section: 'Balloon Decor', description: '' });

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    setFormData({ name: '', section: 'Balloon Decor', description: '' });
    // Refresh list
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this category?')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      
      <button onClick={() => setShowForm(!showForm)} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4">
        {showForm ? 'Cancel' : '+ Add Category'}
      </button>

      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-4 max-w-md">
          <input className="border p-2 w-full mb-2" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <select className="border p-2 w-full mb-2" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})}>
            <option>Balloon Decor</option>
            <option>Wedding Entries</option>
          </select>
          <textarea className="border p-2 w-full mb-2" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded w-full">Save</button>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Section</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center text-gray-500">No categories yet.</td></tr>
            ) : (
              categories.map((cat: any) => (
                <tr key={cat._id} className="border-t">
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3">{cat.section}</td>
                  <td className="p-3">
                    <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
