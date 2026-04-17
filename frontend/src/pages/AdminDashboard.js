import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { api } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    cooking_time: '',
    servings: '',
    ingredients: [''],
    instructions: [''],
    image_url: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editId) {
      fetchRecipe(editId);
    }
  }, [editId]);

  const fetchRecipe = async (id) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/recipes/${id}`);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to load recipe');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleImageUpload = null; // Removed - using URL-based images

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Filter out empty ingredients and instructions
    const cleanedData = {
      ...formData,
      cooking_time: parseInt(formData.cooking_time),
      servings: parseInt(formData.servings),
      ingredients: formData.ingredients.filter((item) => item.trim() !== ''),
      instructions: formData.instructions.filter((item) => item.trim() !== ''),
    };

    try {
      if (editId) {
        await api.put(`/api/recipes/${editId}`, cleanedData);
        toast.success('Recipe updated successfully');
      } else {
        await api.post(`/api/recipes`, cleanedData);
        toast.success('Recipe created successfully');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        cooking_time: '',
        servings: '',
        ingredients: [''],
        instructions: [''],
        image_url: '',
      });
      setSearchParams({});
    } catch (error) {
      toast.error(editId ? 'Failed to update recipe' : 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16" data-testid="admin-dashboard">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="border border-[#1A1A1A] bg-white p-8">
          <h1 className="heading-2 mb-8" data-testid="admin-dashboard-title">
            {editId ? 'Edit Recipe' : 'Create New Recipe'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8" data-testid="recipe-form">
            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                  Recipe Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                  required
                  data-testid="recipe-title-input"
                />
              </div>

              <div>
                <Label htmlFor="description" className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                  required
                  data-testid="recipe-description-input"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="category" className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                    Category
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                    placeholder="e.g., Appetizer"
                    required
                    data-testid="recipe-category-input"
                  />
                </div>

                <div>
                  <Label htmlFor="cooking_time" className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                    Cooking Time (min)
                  </Label>
                  <Input
                    id="cooking_time"
                    name="cooking_time"
                    type="number"
                    value={formData.cooking_time}
                    onChange={handleInputChange}
                    className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                    required
                    data-testid="recipe-cooking-time-input"
                  />
                </div>

                <div>
                  <Label htmlFor="servings" className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                    Servings
                  </Label>
                  <Input
                    id="servings"
                    name="servings"
                    type="number"
                    value={formData.servings}
                    onChange={handleInputChange}
                    className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                    required
                    data-testid="recipe-servings-input"
                  />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="image_url" className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                Recipe Image URL
              </Label>
              <div className="space-y-4">
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                  placeholder="https://images.unsplash.com/..."
                  data-testid="recipe-image-url-input"
                />
                {formData.image_url && (
                  <div className="border border-[#1A1A1A]">
                    <img
                      src={formData.image_url}
                      alt="Recipe preview"
                      className="w-full h-64 object-cover"
                      data-testid="recipe-image-preview"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <Label className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                Ingredients
              </Label>
              <div className="space-y-3" data-testid="ingredients-list">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'ingredients')}
                      className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                      placeholder={`Ingredient ${index + 1}`}
                      data-testid={`ingredient-input-${index}`}
                    />
                    {formData.ingredients.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeArrayItem(index, 'ingredients')}
                        className="bg-[#E63946] text-white hover:bg-[#d62835] px-4 rounded-none"
                        data-testid={`remove-ingredient-${index}`}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={() => addArrayItem('ingredients')}
                className="mt-3 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F8F6F0] px-6 py-2 font-['Outfit'] font-bold text-sm tracking-wide transition-all rounded-none"
                data-testid="add-ingredient-button"
              >
                <Plus size={16} className="mr-2" />
                Add Ingredient
              </Button>
            </div>

            {/* Instructions */}
            <div>
              <Label className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                Instructions
              </Label>
              <div className="space-y-3" data-testid="instructions-list">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={instruction}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'instructions')}
                      className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                      placeholder={`Step ${index + 1}`}
                      rows={3}
                      data-testid={`instruction-input-${index}`}
                    />
                    {formData.instructions.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeArrayItem(index, 'instructions')}
                        className="bg-[#E63946] text-white hover:bg-[#d62835] px-4 rounded-none"
                        data-testid={`remove-instruction-${index}`}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={() => addArrayItem('instructions')}
                className="mt-3 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F8F6F0] px-6 py-2 font-['Outfit'] font-bold text-sm tracking-wide transition-all rounded-none"
                data-testid="add-instruction-button"
              >
                <Plus size={16} className="mr-2" />
                Add Step
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#386641] text-white hover:bg-[#2B4F32] px-8 py-4 font-['Outfit'] font-bold tracking-wide transition-all rounded-none"
                data-testid="submit-recipe-button"
              >
                {loading ? 'Saving...' : editId ? 'Update Recipe' : 'Create Recipe'}
              </Button>
              {editId && (
                <Button
                  type="button"
                  onClick={() => {
                    setSearchParams({});
                    setFormData({
                      title: '',
                      description: '',
                      category: '',
                      cooking_time: '',
                      servings: '',
                      ingredients: [''],
                      instructions: [''],
                      image_url: '',
                    });
                  }}
                  className="bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F8F6F0] px-8 py-4 font-['Outfit'] font-bold tracking-wide transition-all rounded-none"
                  data-testid="cancel-edit-button"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
