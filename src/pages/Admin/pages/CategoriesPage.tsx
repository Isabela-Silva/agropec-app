import { Edit2, Plus, Search, Tag, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { Category, CreateCategory } from '../types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onSubmit: (data: CreateCategory | Partial<Category>) => void;
  isLoading: boolean;
}

function CategoryModal({ isOpen, onClose, category, onSubmit, isLoading }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{category ? 'Editar Categoria' : 'Nova Categoria'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nome da Categoria</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
              placeholder="Ex: Tecnologia, Pecuária, Agricultura..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data para desenvolvimento
  const [categories, setCategories] = useState<Category[]>([
    { uuid: '1', name: 'Tecnologia Agrícola' },
    { uuid: '2', name: 'Pecuária' },
    { uuid: '3', name: 'Agricultura Sustentável' },
    { uuid: '4', name: 'Irrigação' },
    { uuid: '5', name: 'Fertilizantes' },
    { uuid: '6', name: 'Sementes' },
    { uuid: '7', name: 'Máquinas Agrícolas' },
    { uuid: '8', name: 'Controle de Pragas' },
  ]);

  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      setIsSubmitting(true);
      setTimeout(() => {
        setCategories((prev) => prev.filter((category) => category.uuid !== uuid));
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleSubmit = async (data: CreateCategory | Partial<Category>) => {
    setIsSubmitting(true);

    setTimeout(() => {
      if (selectedCategory) {
        setCategories((prev) =>
          prev.map((category) => (category.uuid === selectedCategory.uuid ? { ...category, ...data } : category)),
        );
      } else {
        const newCategory: Category = {
          uuid: Math.random().toString(36).substr(2, 9),
          ...(data as CreateCategory),
        };
        setCategories((prev) => [...prev, newCategory]);
      }
      setIsModalOpen(false);
      setSelectedCategory(undefined);
      setIsSubmitting(false);
    }, 500);
  };

  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-red-100 text-red-800',
    'bg-orange-100 text-orange-800',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCategories.map((category, index) => (
          <div key={category.uuid} className="card group transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-admin-primary-100 flex h-8 w-8 items-center justify-center rounded-full">
                  <Tag className="text-admin-primary-600 h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                </div>
              </div>

              <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-admin-primary-600 hover:text-admin-primary-900 hover:bg-admin-primary-50 rounded-md p-1"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDelete(category.uuid)}
                  className="rounded-md p-1 text-red-600 hover:bg-red-50 hover:text-red-900"
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="mt-3">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colors[index % colors.length]}`}
              >
                {category.name}
              </span>
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="col-span-full">
            <div className="card p-8 text-center">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma categoria encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando uma nova categoria.'}
              </p>
            </div>
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(undefined);
        }}
        category={selectedCategory}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
