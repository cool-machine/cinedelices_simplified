'use strict';

const argon2 = require('argon2');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Hash password for demo users
        const hashedPassword = await argon2.hash('password123');

        // Insert users
        await queryInterface.bulkInsert('users', [
            {
                email: 'admin@cinedelices.com',
                password_hash: hashedPassword,
                username: 'admin',
                role: 'admin',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                email: 'user@cinedelices.com',
                password_hash: hashedPassword,
                username: 'ChefCinema',
                role: 'user',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Insert categories
        await queryInterface.bulkInsert('categories', [
            {
                name: 'Appetizer',
                description: 'Dishes to start the meal',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Main Course',
                description: 'Hearty main dishes',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Dessert',
                description: 'Sweet treats to end the meal',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Beverage',
                description: 'Cocktails and drinks inspired by cinema',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Insert media (films and series) - 14 total for rich carousel
        await queryInterface.bulkInsert('media', [
            {
                title: 'Ratatouille',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/npHNjldbeTHdKKw28bJKs7lzqzj.jpg',
                release_year: 2007,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'The Godfather',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
                release_year: 1972,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Julie & Julia',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/lJxEZkvLCLwVdsMFBQFGFjQmqGx.jpg',
                release_year: 2009,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Breaking Bad',
                type: 'serie',
                image_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
                release_year: 2008,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Game of Thrones',
                type: 'serie',
                image_url: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
                release_year: 2011,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Pulp Fiction',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
                release_year: 1994,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Amélie',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/nSxDa3ppafARKLYnuX6PZvSdAq6.jpg',
                release_year: 2001,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Chocolat',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/hzrvolvKbwJDEapjmHsLOiAPvJK.jpg',
                release_year: 2000,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Big Night',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/sOqB812jWYgcHCyT2PVEk3RBtSm.jpg',
                release_year: 1996,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Babette\'s Feast',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/lMwXhJLrHLKtvEaWFlWzhDXudEb.jpg',
                release_year: 1987,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Eat Drink Man Woman',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/yL1rYMHlqZtZVESxEWLsaneXq86.jpg',
                release_year: 1994,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'The Grand Budapest Hotel',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
                release_year: 2014,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Jiro Dreams of Sushi',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/rIwvnqfsdkiP8ueJhYRGllYoLXi.jpg',
                release_year: 2011,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Willy Wonka',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/vmpsZkrs4Uvkp9r1atqZOdTsdgS.jpg',
                release_year: 1971,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Query actual IDs from inserted users, categories, and media
        const [users] = await queryInterface.sequelize.query(
            `SELECT id, email FROM users ORDER BY id`
        );
        const [categories] = await queryInterface.sequelize.query(
            `SELECT id, name FROM categories ORDER BY id`
        );
        const [media] = await queryInterface.sequelize.query(
            `SELECT id, title FROM media ORDER BY id`
        );

        // Map to get IDs
        const adminUser = users.find(u => u.email === 'admin@cinedelices.com');
        const regularUser = users.find(u => u.email === 'user@cinedelices.com');
        const appetizer = categories.find(c => c.name === 'Appetizer');
        const mainCourse = categories.find(c => c.name === 'Main Course');
        const dessert = categories.find(c => c.name === 'Dessert');
        const beverage = categories.find(c => c.name === 'Beverage');

        // Get all media IDs
        const ratatouilleMedia = media.find(m => m.title === 'Ratatouille');
        const godfatherMedia = media.find(m => m.title === 'The Godfather');
        const juliaMedia = media.find(m => m.title === 'Julie & Julia');
        const breakingBadMedia = media.find(m => m.title === 'Breaking Bad');
        const gotMedia = media.find(m => m.title === 'Game of Thrones');
        const pulpMedia = media.find(m => m.title === 'Pulp Fiction');
        const amelieMedia = media.find(m => m.title === 'Amélie');
        const chocolatMedia = media.find(m => m.title === 'Chocolat');
        const bigNightMedia = media.find(m => m.title === 'Big Night');
        const babetteMedia = media.find(m => m.title === 'Babette\'s Feast');
        const eatDrinkMedia = media.find(m => m.title === 'Eat Drink Man Woman');
        const budapestMedia = media.find(m => m.title === 'The Grand Budapest Hotel');
        const jiroMedia = media.find(m => m.title === 'Jiro Dreams of Sushi');
        const wonkaMedia = media.find(m => m.title === 'Willy Wonka');

        // Insert 14 recipes with Unsplash images
        await queryInterface.bulkInsert('recipes', [
            // === NOW PLAYING (first 4) ===
            {
                title: 'Chef Gusteau\'s Ratatouille',
                description: 'The famous ratatouille from the Pixar film, reimagined as an elegant Provençal tian.',
                ingredients: `- 2 zucchinis\n- 2 eggplants\n- 4 tomatoes\n- 1 red bell pepper\n- Olive oil\n- Herbs de Provence`,
                instructions: `1. Preheat oven to 350°F (180°C).\n2. Cut vegetables into thin rounds.\n3. Arrange in alternating pattern in a baking dish.\n4. Bake for 45 minutes.`,
                anecdote: 'This dish allows Remy to win over the critic Anton Ego.',
                difficulty: 'moyen',
                prep_time: 30,
                cook_time: 45,
                image_url: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=600&q=80',
                user_id: adminUser.id,
                category_id: mainCourse.id,
                media_id: ratatouilleMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Sicilian Cannoli from The Godfather',
                description: 'The famous cannoli from the scene "Leave the gun, take the cannoli."',
                ingredients: `- 250g flour\n- 500g ricotta\n- 150g powdered sugar\n- Chocolate chips`,
                instructions: `1. Prepare the dough.\n2. Fry the tubes.\n3. Fill with sweetened ricotta.\n4. Decorate.`,
                anecdote: 'Iconic line from The Godfather that became legendary.',
                difficulty: 'difficile',
                prep_time: 60,
                cook_time: 30,
                image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
                user_id: adminUser.id,
                category_id: dessert.id,
                media_id: godfatherMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Julia Child\'s Boeuf Bourguignon',
                description: 'The French classic immortalized in Julie & Julia.',
                ingredients: `- 3 lbs beef chuck\n- 1 bottle red wine\n- 1 lb mushrooms\n- Bacon lardons`,
                instructions: `1. Sauté the bacon.\n2. Brown the beef.\n3. Add the wine.\n4. Cook for 3 hours.`,
                anecdote: 'Julia Child perfected this recipe over many years.',
                difficulty: 'difficile',
                prep_time: 45,
                cook_time: 180,
                image_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80',
                user_id: regularUser.id,
                category_id: mainCourse.id,
                media_id: juliaMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Los Pollos Hermanos Chicken',
                description: 'Inspired by Gus Fring\'s restaurant in Breaking Bad.',
                ingredients: `- 1 whole chicken, cut up\n- 2 cups buttermilk\n- 2 cups flour\n- Secret spices`,
                instructions: `1. Marinate for 4 hours.\n2. Coat in seasoned flour.\n3. Fry for 15 minutes.\n4. Serve hot.`,
                anecdote: 'Los Pollos Hermanos actually exists at promotional events!',
                difficulty: 'moyen',
                prep_time: 30,
                cook_time: 20,
                image_url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80',
                user_id: regularUser.id,
                category_id: mainCourse.id,
                media_id: breakingBadMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            // === COMING SOON CAROUSEL (recipes 5-14) ===
            {
                title: 'Winterfell Pigeon Pie',
                description: 'A royal dish worthy of the banquets of Westeros.',
                ingredients: `- 2 pigeons\n- 400g puff pastry\n- 200g foie gras\n- Wild mushrooms`,
                instructions: `1. Debone the pigeons.\n2. Wrap in pastry.\n3. Bake 25 min at 400°F (200°C).`,
                anecdote: 'The feasts of Game of Thrones are legendary.',
                difficulty: 'difficile',
                prep_time: 45,
                cook_time: 25,
                image_url: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80',
                user_id: adminUser.id,
                category_id: mainCourse.id,
                media_id: gotMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'The Big Kahuna Burger',
                description: 'The famous burger from Pulp Fiction. "That is a tasty burger!"',
                ingredients: `- 1 lb ground beef\n- 4 brioche buns\n- American cheese\n- Bacon`,
                instructions: `1. Form the patties.\n2. Grill to perfection.\n3. Assemble with toppings.\n4. Serve with a milkshake.`,
                anecdote: 'Iconic scene with Samuel L. Jackson.',
                difficulty: 'facile',
                prep_time: 15,
                cook_time: 10,
                image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
                user_id: regularUser.id,
                category_id: mainCourse.id,
                media_id: pulpMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Amélie\'s Crème Brûlée',
                description: 'Amélie Poulain\'s favorite dessert.',
                ingredients: `- 2 cups heavy cream\n- 6 egg yolks\n- 1/2 cup sugar\n- Vanilla bean`,
                instructions: `1. Infuse the vanilla.\n2. Mix with egg yolks.\n3. Bake in a water bath.\n4. Caramelize with a torch.`,
                anecdote: 'Amélie loves cracking the caramelized top of her crème brûlée.',
                difficulty: 'moyen',
                prep_time: 20,
                cook_time: 45,
                image_url: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600&q=80',
                user_id: adminUser.id,
                category_id: dessert.id,
                media_id: amelieMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Chocolate Truffles',
                description: 'The sensuous truffles from the film Chocolat.',
                ingredients: `- 200g dark chocolate\n- 1 cup heavy cream\n- Cocoa powder\n- Secret chili pepper`,
                instructions: `1. Melt the chocolate.\n2. Mix with cream.\n3. Form into balls.\n4. Roll in cocoa powder.`,
                anecdote: 'A touch of chili was Vianne\'s secret.',
                difficulty: 'facile',
                prep_time: 30,
                cook_time: 0,
                image_url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80',
                user_id: regularUser.id,
                category_id: dessert.id,
                media_id: chocolatMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Big Night Timpano',
                description: 'The legendary Italian feast from the film Big Night.',
                ingredients: `- Pasta\n- Meat\n- Hard-boiled eggs\n- Tomato sauce\n- Mozzarella`,
                instructions: `1. Prepare the pasta.\n2. Layer in a mold.\n3. Bake for 1 hour.\n4. Unmold and serve.`,
                anecdote: 'The Timpano is the climax of the film.',
                difficulty: 'difficile',
                prep_time: 90,
                cook_time: 60,
                image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
                user_id: adminUser.id,
                category_id: mainCourse.id,
                media_id: bigNightMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Babette\'s Feast',
                description: 'The sumptuous French meal by chef Babette.',
                ingredients: `- Quail in puff pastry\n- Blinis Demidoff\n- Chablis wine\n- Champagne`,
                instructions: `1. Prepare the quails.\n2. Serve the blinis.\n3. Accompany with champagne.\n4. Finish with desserts.`,
                anecdote: 'Babette spends all her money on this feast.',
                difficulty: 'difficile',
                prep_time: 120,
                cook_time: 90,
                image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
                user_id: regularUser.id,
                category_id: mainCourse.id,
                media_id: babetteMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Father Chu\'s Dim Sum',
                description: 'The Chinese delights from Eat Drink Man Woman.',
                ingredients: `- Ground pork\n- Shrimp\n- Wonton wrappers\n- Ginger\n- Soy sauce`,
                instructions: `1. Prepare the filling.\n2. Form the dim sum.\n3. Steam for 10 minutes.\n4. Serve with sauce.`,
                anecdote: 'Chef Chu prepares Sunday feasts for his family.',
                difficulty: 'moyen',
                prep_time: 45,
                cook_time: 15,
                image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
                user_id: adminUser.id,
                category_id: appetizer.id,
                media_id: eatDrinkMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Mendl\'s Courtesan au Chocolat',
                description: 'The signature pastry from The Grand Budapest Hotel.',
                ingredients: `- Choux pastry\n- Pastry cream\n- Chocolate\n- Powdered sugar`,
                instructions: `1. Prepare the choux pastry.\n2. Form the éclairs.\n3. Bake and cool.\n4. Fill and glaze with chocolate.`,
                anecdote: 'Mendl\'s is Madame D.\'s favorite pastry shop.',
                difficulty: 'difficile',
                prep_time: 60,
                cook_time: 30,
                image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80',
                user_id: regularUser.id,
                category_id: dessert.id,
                media_id: budapestMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Jiro\'s Omakase Sushi',
                description: 'The art of sushi according to master Jiro Ono.',
                ingredients: `- Sushi rice\n- Ultra-fresh fish\n- Wasabi\n- Pickled ginger`,
                instructions: `1. Prepare the perfect rice.\n2. Slice the fish.\n3. Form the nigiri.\n4. Serve immediately.`,
                anecdote: 'Jiro dedicated his life to perfecting sushi.',
                difficulty: 'difficile',
                prep_time: 45,
                cook_time: 0,
                image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
                user_id: adminUser.id,
                category_id: mainCourse.id,
                media_id: jiroMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Wonka Chocolate Bar',
                description: 'The magical chocolate from Willy Wonka\'s factory.',
                ingredients: `- 300g milk chocolate\n- 100g praline\n- Hazelnuts\n- Edible gold flakes`,
                instructions: `1. Temper the chocolate.\n2. Add the praline.\n3. Mold and decorate.\n4. Look for the golden ticket!`,
                anecdote: 'Wonka hides golden tickets in his bars.',
                difficulty: 'moyen',
                prep_time: 40,
                cook_time: 0,
                image_url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=80',
                user_id: regularUser.id,
                category_id: dessert.id,
                media_id: wonkaMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        // Delete in reverse order to respect foreign keys
        await queryInterface.bulkDelete('recipes', null, {});
        await queryInterface.bulkDelete('media', null, {});
        await queryInterface.bulkDelete('categories', null, {});
        await queryInterface.bulkDelete('users', null, {});
    }
};
