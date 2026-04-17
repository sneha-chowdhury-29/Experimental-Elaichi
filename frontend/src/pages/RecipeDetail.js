import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, Users, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/recipes/${id}`, {
        withCredentials: true,
      });
      toast.success('Recipe deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="recipe-loading">
        <p className="font-['Outfit'] text-xl">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="recipe-not-found">
        <p className="font-['Outfit'] text-xl">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="recipe-detail-page">
      {/* Header */}
      <section className="border-b border-[#1A1A1A] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <Button
            onClick={() => navigate('/')}
            className="bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F8F6F0] px-6 py-2 font-['Outfit'] font-bold text-sm tracking-wide transition-all rounded-none"
            data-testid="back-to-recipes-button"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Recipes
          </Button>
        </div>
      </section>

      {/* Recipe Header */}
      <section className="border-b border-[#1A1A1A]" data-testid="recipe-header-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <span className="tag" data-testid="recipe-category-tag">{recipe.category}</span>
              <h1 className="heading-1" data-testid="recipe-title">{recipe.title}</h1>
              <p className="body-text text-lg" data-testid="recipe-description">{recipe.description}</p>
              <div className="flex items-center gap-6 text-base">
                <div className="flex items-center gap-2" data-testid="recipe-cooking-time">
                  <Clock size={20} />
                  <span>{recipe.cooking_time} min</span>
                </div>
                <div className="flex items-center gap-2" data-testid="recipe-servings">
                  <Users size={20} />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
              {user && user.role === 'admin' && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => navigate(`/admin?edit=${id}`)}
                    className="bg-[#386641] text-white hover:bg-[#2B4F32] px-6 py-2 font-['Outfit'] font-bold text-sm tracking-wide transition-all rounded-none"
                    data-testid="edit-recipe-button"
                  >
                    Edit Recipe
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="bg-[#E63946] text-white hover:bg-[#d62835] px-6 py-2 font-['Outfit'] font-bold text-sm tracking-wide transition-all rounded-none"
                    data-testid="delete-recipe-button"
                  >
                    Delete Recipe
                  </Button>
                </div>
              )}
            </div>
            <div className="border border-[#1A1A1A]">
              <img
                src={recipe.image_url || 'https://images.unsplash.com/photo-1727404558869-2c4506390b20?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBpbmRpYW4lMjBmb29kJTIwcGxhdGluZyUyMHJlY2lwZXxlbnwwfHx8fDE3NzY0MjEzNDV8MA&ixlib=rb-4.1.0&q=85'}
                alt={recipe.title}
                className="w-full aspect-[4/3] object-cover"
                data-testid="recipe-detail-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients and Instructions */}
      <section className="py-16" data-testid="recipe-content-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
            {/* Ingredients - Sticky */}
            <div className="lg:sticky lg:top-24 h-fit" data-testid="ingredients-section">
              <div className="border border-[#1A1A1A] bg-white p-8">
                <h2 className="heading-3 mb-6" data-testid="ingredients-heading">Ingredients</h2>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="body-text flex items-start gap-3"
                      data-testid={`ingredient-${index}`}
                    >
                      <span className="w-2 h-2 bg-[#E76F51] mt-2 flex-shrink-0"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions - Scrollable */}
            <div data-testid="instructions-section">
              <div className="border border-[#1A1A1A] bg-white p-8">
                <h2 className="heading-3 mb-6" data-testid="instructions-heading">Instructions</h2>
                <ol className="space-y-6">
                  {recipe.instructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="flex gap-6"
                      data-testid={`instruction-${index}`}
                    >
                      <span className="flex-shrink-0 w-10 h-10 bg-[#E9C46A] border border-[#1A1A1A] flex items-center justify-center font-['Outfit'] font-bold text-lg">
                        {index + 1}
                      </span>
                      <p className="body-text pt-2">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecipeDetail;