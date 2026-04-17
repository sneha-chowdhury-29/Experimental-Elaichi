import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

async def seed_recipes():
    mongo_url = "mongodb://localhost:27017"
    client = AsyncIOMotorClient(mongo_url)
    db = client["test_database"]
    
    # Sample recipes with Indian experimental theme
    recipes = [
        {
            "id": str(uuid.uuid4()),
            "title": "Cardamom Fusion Biryani",
            "description": "A modern twist on traditional biryani with aromatic cardamom and saffron, layered with caramelized onions and tender meat. This experimental version uses a unique blend of spices that elevates the classic dish.",
            "category": "Main Course",
            "cooking_time": 90,
            "servings": 6,
            "ingredients": [
                "2 cups Basmati rice",
                "500g chicken or lamb pieces",
                "4 large onions, thinly sliced",
                "1/2 cup yogurt",
                "15-20 green cardamom pods (crushed)",
                "1/4 tsp saffron soaked in warm milk",
                "4 tbsp ghee",
                "2 bay leaves",
                "4 cloves",
                "1 cinnamon stick",
                "Salt to taste",
                "Fresh mint and cilantro",
                "Fried cashews and raisins for garnish"
            ],
            "instructions": [
                "Soak rice in water for 30 minutes. Meanwhile, marinate the meat with yogurt, half of the crushed cardamom, salt, and let it rest for 20 minutes.",
                "Heat ghee in a heavy-bottomed pot. Fry sliced onions until golden brown and caramelized. Set aside half for layering.",
                "In the same pot, add bay leaves, cloves, cinnamon, and remaining cardamom. Sauté for 1 minute.",
                "Add marinated meat and cook on high heat for 5 minutes, then reduce heat and cook until 70% done (about 15 minutes).",
                "Boil rice separately in salted water until 70% cooked. Drain immediately.",
                "Layer the biryani: Start with meat at the bottom, sprinkle caramelized onions, mint, cilantro. Add rice layer. Repeat if needed.",
                "Pour saffron milk over the rice. Cover tightly with foil and lid. Cook on low heat for 25-30 minutes (dum cooking).",
                "Let it rest for 5 minutes before opening. Garnish with fried cashews, raisins, and remaining caramelized onions. Serve hot with raita."
            ],
            "image_url": "https://images.unsplash.com/photo-1664994464799-c8f643d712f6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbmRpYW4lMjBmb29kJTIwcGxhdGluZyUyMHJlY2lwZXxlbnwwfHx8fDE3NzY0MjEzNDV8MA&ixlib=rb-4.1.0&q=85",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Masala Chai Panna Cotta",
            "description": "An Italian dessert meets Indian chai in this experimental fusion. Silky smooth panna cotta infused with cardamom, ginger, and black tea, topped with a spiced caramel sauce.",
            "category": "Dessert",
            "cooking_time": 30,
            "servings": 4,
            "ingredients": [
                "2 cups heavy cream",
                "1/2 cup whole milk",
                "1/3 cup sugar",
                "2 tsp gelatin powder",
                "3 tbsp water",
                "2 black tea bags",
                "4 green cardamom pods (crushed)",
                "1-inch fresh ginger (grated)",
                "1/4 tsp black pepper",
                "1 cinnamon stick",
                "For topping: caramel sauce, crushed pistachios"
            ],
            "instructions": [
                "Bloom gelatin by mixing it with 3 tbsp water. Let it sit for 5 minutes.",
                "In a saucepan, combine cream, milk, sugar, tea bags, crushed cardamom, ginger, black pepper, and cinnamon stick.",
                "Heat the mixture on medium heat until it just starts to simmer (do not boil). Remove from heat and let it steep for 10 minutes.",
                "Strain the mixture through a fine mesh to remove all solids. Discard tea bags and spices.",
                "Add bloomed gelatin to the warm cream mixture and whisk until completely dissolved.",
                "Pour into ramekins or serving glasses. Let them cool to room temperature.",
                "Refrigerate for at least 4 hours or overnight until set.",
                "Before serving, drizzle with homemade caramel sauce and garnish with crushed pistachios. Optionally, add a pinch of cardamom powder on top."
            ],
            "image_url": "https://images.unsplash.com/photo-1720499035862-f764f0ee4032?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBpbmRpYW4lMjBmb29kJTIwcGxhdGluZyUyMHJlY2lwZXxlbnwwfHx8fDE3NzY0MjEzNDV8MA&ixlib=rb-4.1.0&q=85",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Tandoori Paneer Tacos",
            "description": "Indian street food meets Mexican cuisine in these vibrant tacos. Smoky tandoori paneer cubes served in crispy taco shells with mint chutney slaw and pickled onions.",
            "category": "Appetizer",
            "cooking_time": 45,
            "servings": 4,
            "ingredients": [
                "400g paneer (cut into cubes)",
                "1/2 cup thick yogurt",
                "2 tbsp tandoori masala",
                "1 tsp kashmiri red chili powder",
                "1 tsp garam masala",
                "1 tbsp ginger-garlic paste",
                "2 tbsp lemon juice",
                "Salt to taste",
                "8 small taco shells",
                "1 cup shredded cabbage",
                "1/2 cup mint chutney",
                "1 red onion (thinly sliced and pickled)",
                "Fresh cilantro for garnish"
            ],
            "instructions": [
                "Make the marinade by mixing yogurt, tandoori masala, red chili powder, garam masala, ginger-garlic paste, lemon juice, and salt.",
                "Add paneer cubes to the marinade, coat well, and refrigerate for at least 30 minutes (longer for better flavor).",
                "Preheat oven to 220°C (425°F) or prepare a grill. Thread marinated paneer onto skewers.",
                "Grill or bake for 15-20 minutes, turning occasionally, until paneer has charred edges.",
                "Meanwhile, mix shredded cabbage with 2-3 tbsp mint chutney to make the slaw.",
                "Warm taco shells according to package instructions.",
                "Assemble tacos: Start with mint slaw at the bottom, add 3-4 pieces of tandoori paneer.",
                "Top with pickled onions and fresh cilantro. Drizzle extra mint chutney if desired. Serve immediately while warm."
            ],
            "image_url": "https://images.unsplash.com/photo-1727404558869-2c4506390b20?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBpbmRpYW4lMjBmb29kJTIwcGxhdGluZyUyMHJlY2lwZXxlbnwwfHx8fDE3NzY0MjEzNDV8MA&ixlib=rb-4.1.0&q=85",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Curry Leaf & Coconut Risotto",
            "description": "South Indian flavors meet Italian risotto. Aromatic curry leaves and creamy coconut milk create a luxurious, experimental dish that's both comforting and exotic.",
            "category": "Main Course",
            "cooking_time": 40,
            "servings": 4,
            "ingredients": [
                "1.5 cups Arborio rice",
                "4 cups vegetable stock (warm)",
                "1 cup coconut milk",
                "2 sprigs fresh curry leaves",
                "1 onion (finely chopped)",
                "3 garlic cloves (minced)",
                "1 tsp mustard seeds",
                "1/2 tsp turmeric powder",
                "3 tbsp butter",
                "1/4 cup grated parmesan (optional)",
                "2 tbsp coconut oil",
                "Salt and pepper to taste",
                "Fried curry leaves for garnish"
            ],
            "instructions": [
                "Heat coconut oil in a large pan. Add mustard seeds and let them crackle. Add curry leaves and sauté for 30 seconds.",
                "Add chopped onion and minced garlic. Sauté until onions are translucent (about 5 minutes).",
                "Add Arborio rice and turmeric powder. Toast the rice for 2 minutes, stirring constantly.",
                "Add warm vegetable stock one ladle at a time, stirring continuously. Wait for liquid to be absorbed before adding more.",
                "After 15 minutes of adding stock, pour in coconut milk gradually while stirring.",
                "Continue cooking until rice is creamy and al dente (about 20-25 minutes total).",
                "Remove from heat. Stir in butter and parmesan (if using). Season with salt and pepper.",
                "Serve immediately in shallow bowls. Garnish with crispy fried curry leaves and a drizzle of coconut cream if desired."
            ],
            "image_url": "https://images.unsplash.com/photo-1612036167614-ae83edbce270?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBpbmRpYW4lMjBmb29kJTIwcGxhdGluZyUyMHJlY2lwZXxlbnwwfHx8fDE3NzY0MjEzNDV8MA&ixlib=rb-4.1.0&q=85",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    # Check if recipes already exist
    existing_count = await db.recipes.count_documents({})
    if existing_count > 0:
        print(f"Recipes already exist ({existing_count} recipes). Skipping seed.")
        return
    
    # Insert recipes
    await db.recipes.insert_many(recipes)
    print(f"Successfully seeded {len(recipes)} recipes!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_recipes())
