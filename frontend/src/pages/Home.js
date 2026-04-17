import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Search, Clock, Users } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchTerm, selectedCategory, recipes]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/recipes`);
      setRecipes(response.data);
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((recipe) => recipe.category === selectedCategory);
    }

    setFilteredRecipes(filtered);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative border-b border-[#1A1A1A]" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="overline" data-testid="hero-tagline">Where Tradition Meets Innovation</p>
              <h1 className="heading-1" data-testid="hero-title">
                Experimental<br />Elaichi
              </h1>
              <p className="body-text text-lg max-w-md" data-testid="hero-description">
                A curated collection of experimental Indian recipes that blend tradition with bold creativity. Every dish tells a story of flavors reimagined.
              </p>
              <a href="#recipes" className="inline-block bg-[#386641] text-white hover:bg-[#2B4F32] px-8 py-4 font-['Outfit'] font-bold tracking-wide transition-all" data-testid="hero-cta-button">
                Explore Recipes
              </a>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1664994464799-c8f643d712f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbmRpYW4lMjBmb29kJTIwcGxhdGluZyUyMHJlY2lwZXxlbnwwfHx8fDE3NzY0MjEzNDV8MA&ixlib=rb-4.1.0&q=85"
                alt="Modern Indian Food Plating"
                className="w-full h-[500px] object-cover border border-[#1A1A1A]"
                data-testid="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="border-b border-[#1A1A1A] bg-white" id="recipes" data-testid="search-filter-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1A1A1A]/50" size={20} />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                data-testid="recipe-search-input"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setSelectedCategory('')}
                className={`${
                  selectedCategory === ''
                    ? 'bg-[#386641] text-white'
                    : 'bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F8F6F0]'
                } px-6 py-2 font-['Outfit'] font-bold text-sm tracking-wide transition-all rounded-none`}
                data-testid="category-all-button"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? 'bg-[#386641] text-white'
                      : 'bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F8F6F0]'
                  } px-6 py-2 font-['Outfit'] font-bold text-sm tracking-wide transition-all rounded-none`}
                  data-testid={`category-${category.toLowerCase()}-button`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-16" data-testid="recipes-grid-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {loading ? (
            <div className="text-center py-20" data-testid="recipes-loading">
              <p className="font-['Outfit'] text-xl">Loading recipes...</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-20" data-testid="no-recipes-message">
              <p className="font-['Outfit'] text-xl">No recipes found. Check back soon!</p>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredRecipes.map((recipe) => (
                <motion.div key={recipe.id} variants={itemVariants}>
                  <Link to={`/recipe/${recipe.id}`} data-testid={`recipe-card-${recipe.id}`}>
                    <div className="recipe-card bg-white border border-[#1A1A1A] group">
                      <div className="relative overflow-hidden">
                        <img
                          src={recipe.image_url || 'https://images.unsplash.com/photo-1727404558869-2c4506390b20?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBpbmRpYW4lMjBmb29kJTIwcGxhdGluZyUyMHJlY2lwZXxlbnwwfHx8fDE3NzY0MjEzNDV8MA&ixlib=rb-4.1.0&q=85'}
                          alt={recipe.title}
                          className="w-full aspect-square object-cover"
                          data-testid={`recipe-image-${recipe.id}`}
                        />
                        <div className="absolute top-4 right-4">
                          <span className="tag" data-testid={`recipe-category-tag-${recipe.id}`}>{recipe.category}</span>
                        </div>
                      </div>
                      <div className="p-6 space-y-3">
                        <h3 className="heading-3" data-testid={`recipe-title-${recipe.id}`}>{recipe.title}</h3>
                        <p className="body-text text-sm line-clamp-2" data-testid={`recipe-description-${recipe.id}`}>{recipe.description}</p>
                        <div className="flex items-center gap-4 text-sm text-[#1A1A1A]/60">
                          <div className="flex items-center gap-1" data-testid={`recipe-time-${recipe.id}`}>
                            <Clock size={16} />
                            <span>{recipe.cooking_time} min</span>
                          </div>
                          <div className="flex items-center gap-1" data-testid={`recipe-servings-${recipe.id}`}>
                            <Users size={16} />
                            <span>{recipe.servings} servings</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;