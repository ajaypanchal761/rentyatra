import { useState } from 'react';
import { useCategories } from '../../../contexts/CategoryContext';
import * as Icons from '../icons/AdminIcons';

function CategoryManagementView() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    resetToDefaults,
  } = useCategories();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '📦',
    image: 'mobile.png'
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    icon: '📦'
  });

  const availableImages = [
    'car.png',
    'bike.png',
    'mobile.png',
    'furniture.png',
    'fashion.png',
    'book.png',
    'sport.png',
    'realstate.png',
    'pet.png'
  ];

  const commonIcons = [
    '🚗', '🏍️', '📱', '🏠', '🛋️', '💻', '👔', '📚', '⚽', '🐕',
    '📦', '🎮', '🎨', '🎸', '📷', '⌚', '💍', '🎭', '🎪', '🎬',
    '🍕', '☕', '🎂', '🍔', '🍎', '🌸', '🌺', '🌻', '🌷', '🌹'
  ];

  const handleAddCategory = () => {
    if (!categoryForm.name.trim()) {
      alert('Please enter category name');
      return;
    }
    addCategory(categoryForm);
    setCategoryForm({ name: '', icon: '📦', image: 'mobile.png' });
    setIsAddingCategory(false);
  };

  const handleUpdateCategory = () => {
    if (!categoryForm.name.trim()) {
      alert('Please enter category name');
      return;
    }
    updateCategory(editingCategory.id, categoryForm);
    setCategoryForm({ name: '', icon: '📦', image: 'mobile.png' });
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? All subcategories will also be deleted.')) {
      deleteCategory(categoryId);
    }
  };

  const handleAddSubcategory = (categoryId) => {
    if (!subcategoryForm.name.trim()) {
      alert('Please enter subcategory name');
      return;
    }
    addSubcategory(categoryId, subcategoryForm);
    setSubcategoryForm({ name: '', icon: '📦' });
    setIsAddingSubcategory(null);
  };

  const handleUpdateSubcategory = (categoryId) => {
    if (!subcategoryForm.name.trim()) {
      alert('Please enter subcategory name');
      return;
    }
    updateSubcategory(categoryId, editingSubcategory.id, subcategoryForm);
    setSubcategoryForm({ name: '', icon: '📦' });
    setEditingSubcategory(null);
  };

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      deleteSubcategory(categoryId, subcategoryId);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('This will reset all categories to default. All custom categories will be lost. Continue?')) {
      resetToDefaults();
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Category Management</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Create and manage categories & subcategories
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleResetToDefaults}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Icons.PlusIcon className="h-4 w-4" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {(isAddingCategory || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g., Electronics"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Icon Emoji</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    placeholder="📦"
                    className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-center text-xl"
                    maxLength={2}
                  />
                  <div className="flex-1 flex flex-wrap gap-1 p-2 border border-slate-300 rounded-lg max-h-24 overflow-y-auto">
                    {commonIcons.map((icon, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCategoryForm({ ...categoryForm, icon })}
                        className="text-lg hover:bg-slate-100 p-1 rounded"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category Image</label>
                <select
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  {availableImages.map((img) => (
                    <option key={img} value={img}>{img}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setIsAddingCategory(false);
                  setEditingCategory(null);
                  setCategoryForm({ name: '', icon: '📦', image: 'mobile.png' });
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Subcategory Modal */}
      {(isAddingSubcategory || editingSubcategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  value={subcategoryForm.name}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                  placeholder="e.g., Smartphones"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Icon Emoji</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subcategoryForm.icon}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, icon: e.target.value })}
                    placeholder="📦"
                    className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-center text-xl"
                    maxLength={2}
                  />
                  <div className="flex-1 flex flex-wrap gap-1 p-2 border border-slate-300 rounded-lg max-h-24 overflow-y-auto">
                    {commonIcons.map((icon, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSubcategoryForm({ ...subcategoryForm, icon })}
                        className="text-lg hover:bg-slate-100 p-1 rounded"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setIsAddingSubcategory(null);
                  setEditingSubcategory(null);
                  setSubcategoryForm({ name: '', icon: '📦' });
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingSubcategory) {
                    handleUpdateSubcategory(editingSubcategory.categoryId);
                  } else {
                    handleAddSubcategory(isAddingSubcategory);
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                {editingSubcategory ? 'Update' : 'Add'} Subcategory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Category Header */}
            <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    className="p-1 hover:bg-white/50 rounded transition-colors"
                  >
                    <Icons.ChevronRightIcon
                      className={`h-4 w-4 text-slate-600 transition-transform ${
                        expandedCategory === category.id ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{category.name}</h3>
                    <p className="text-xs text-slate-600">
                      {category.subcategories?.length || 0} subcategories
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setCategoryForm({
                        name: category.name,
                        icon: category.icon,
                        image: category.image
                      });
                      setEditingCategory(category);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit Category"
                  >
                    <Icons.EditIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Category"
                  >
                    <Icons.TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {expandedCategory === category.id && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-700">Subcategories</h4>
                  <button
                    onClick={() => setIsAddingSubcategory(category.id)}
                    className="px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded transition-colors flex items-center gap-1"
                  >
                    <Icons.PlusIcon className="h-3 w-3" />
                    Add
                  </button>
                </div>
                {category.subcategories && category.subcategories.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {category.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded transition-colors"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="text-lg flex-shrink-0">{sub.icon}</span>
                          <span className="text-xs font-medium text-slate-900 truncate">{sub.name}</span>
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              setSubcategoryForm({ name: sub.name, icon: sub.icon });
                              setEditingSubcategory({ ...sub, categoryId: category.id });
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Icons.EditIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Icons.TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">No subcategories yet</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
            <Icons.Package className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">No Categories Yet</h3>
          <p className="text-xs text-slate-600 mb-4">Get started by creating your first category</p>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Create First Category
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryManagementView;

