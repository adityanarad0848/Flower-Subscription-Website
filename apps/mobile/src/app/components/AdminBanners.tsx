import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    badge_text: '',
    button_text: 'Shop Now',
    background_gradient: 'from-orange-600 via-pink-600 to-red-600',
    icon_emoji: '🔱',
    is_active: true,
    start_date: '',
    end_date: '',
    display_order: 1
  });
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    const { data } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true });
    setBanners(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      await supabase
        .from('banners')
        .update(form)
        .eq('id', editing);
    } else {
      await supabase
        .from('banners')
        .insert([form]);
    }
    
    resetForm();
    loadBanners();
  };

  const handleEdit = (banner: any) => {
    setForm(banner);
    setEditing(banner.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this banner?')) {
      await supabase.from('banners').delete().eq('id', id);
      loadBanners();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase
      .from('banners')
      .update({ is_active: !isActive })
      .eq('id', id);
    loadBanners();
  };

  const resetForm = () => {
    setForm({
      title: '',
      subtitle: '',
      description: '',
      badge_text: '',
      button_text: 'Shop Now',
      background_gradient: 'from-orange-600 via-pink-600 to-red-600',
      icon_emoji: '🔱',
      is_active: true,
      start_date: '',
      end_date: '',
      display_order: 1
    });
    setEditing(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Banners</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">{editing ? 'Edit' : 'Add'} Banner</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (use • to separate)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Badge Text</label>
              <input
                type="text"
                value={form.badge_text}
                onChange={(e) => setForm({ ...form, badge_text: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <input
                type="text"
                value={form.button_text}
                onChange={(e) => setForm({ ...form, button_text: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Icon Emoji</label>
              <input
                type="text"
                value={form.icon_emoji}
                onChange={(e) => setForm({ ...form, icon_emoji: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Background Gradient</label>
              <select
                value={form.background_gradient}
                onChange={(e) => setForm({ ...form, background_gradient: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="from-orange-600 via-pink-600 to-red-600">Orange-Pink-Red</option>
                <option value="from-purple-600 via-pink-600 to-red-600">Purple-Pink-Red</option>
                <option value="from-blue-600 via-indigo-600 to-purple-600">Blue-Indigo-Purple</option>
                <option value="from-green-600 via-teal-600 to-blue-600">Green-Teal-Blue</option>
                <option value="from-yellow-500 via-orange-500 to-red-500">Yellow-Orange-Red</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                {editing ? 'Update' : 'Create'} Banner
              </Button>
              {editing && (
                <Button type="button" onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Existing Banners</h2>
          {banners.map((banner) => (
            <Card key={banner.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">{banner.title}</h3>
                  <p className="text-sm text-gray-600">{banner.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(banner.id, banner.is_active)}
                    className={`px-2 py-1 text-xs rounded ${
                      banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">{banner.description}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(banner)} variant="outline">
                  Edit
                </Button>
                <Button size="sm" onClick={() => handleDelete(banner.id)} variant="outline" className="text-red-600">
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
