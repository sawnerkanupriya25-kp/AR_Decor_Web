'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  section: string;
  description: string;
  slug: string;
  active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', section: 'Balloon Decor', description: '', slug: '' });
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', section: 'Balloon Decor', description: '', slug: '' });
    fetchCategories();
    alert('Category saved successfully!');
  };

  const handleEdit = (cat: Category) => {
    setFormData({ name: cat.name, section: cat.section, description: cat.description, slug: cat.slug || '' });
    setEditingId(cat._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  if (loading) return <div className="p-8 text-center">Loading categories...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Categories Management</h1>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', section: 'Balloon Decor', description: '', slug: '' }); }} 
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 shadow-md transition"
        >
          {showForm ? 'Cancel' : '+ Add New Category'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border-l-4 border-yellow-500">
          <h3 className="text-xl font-bold mb-4 text-gray-700">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              className="w-full border p-3 rounded focus:ring-2 focus:ring-yellow-500 outline-none" 
              placeholder="Category Name (e.g., Birthday Decor)" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              className="w-full border p-3 rounded focus:ring-2 focus:ring-yellow-500 outline-none" 
              placeholder="Slug (e.g., birthday-decor)" 
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
            />
            <select 
              className="w-full border p-3 rounded focus:ring-2 focus:ring-yellow-500 outline-none"
              value={formData.section}
              onChange={e => setFormData({...formData, section: e.target.value})}
            >
              <option>Balloon Decor</option>
              <option>Wedding Entries</option>
            </select>
            <textarea 
              className="w-full border p-3 rounded focus:ring-2 focus:ring-yellow-500 outline-none" 
              placeholder="Description" 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full font-bold">
              {editingId ? 'Update Category' : 'Create Category'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Section</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No categories found. Click "Add New Category" to start.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                  <td className="p-4 text-gray-600">{cat.section}</td>
                  <td className="p-4 text-gray-500 text-sm">{cat.slug || '-'}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${cat.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{cat.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
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
