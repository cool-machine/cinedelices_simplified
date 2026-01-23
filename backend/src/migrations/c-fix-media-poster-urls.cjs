'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Fix broken/placeholder poster URLs with correct TMDB URLs
        const updates = [
            {
                title: 'Julie & Julia',
                image_url: 'https://image.tmdb.org/t/p/w500/lJxEZkvLCLwVdsMFBQFGFjQmqGx.jpg'
            },
            {
                title: 'Chocolat',
                image_url: 'https://image.tmdb.org/t/p/w500/hzrvolvKbwJDEapjmHsLOiAPvJK.jpg'
            },
            {
                title: "Babette's Feast",
                image_url: 'https://image.tmdb.org/t/p/w500/lMwXhJLrHLKtvEaWFlWzhDXudEb.jpg'
            },
            {
                title: 'The Grand Budapest Hotel',
                image_url: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg'
            },
            {
                title: 'Jiro Dreams of Sushi',
                image_url: 'https://image.tmdb.org/t/p/w500/rIwvnqfsdkiP8ueJhYRGllYoLXi.jpg'
            },
            {
                title: 'Willy Wonka',
                image_url: 'https://image.tmdb.org/t/p/w500/vmpsZkrs4Uvkp9r1atqZOdTsdgS.jpg'
            }
        ];

        for (const update of updates) {
            await queryInterface.sequelize.query(
                `UPDATE media SET image_url = :image_url, updated_at = NOW() WHERE title = :title`,
                {
                    replacements: update,
                    type: Sequelize.QueryTypes.UPDATE
                }
            );
        }
    },

    async down(queryInterface, Sequelize) {
        // Revert to old URLs (though some were broken anyway)
        const reverts = [
            {
                title: 'Julie & Julia',
                image_url: 'https://image.tmdb.org/t/p/w500/9T0S2X5Z3UWHA0gMJLqZ0E7Xrwq.jpg'
            },
            {
                title: 'Chocolat',
                image_url: 'https://image.tmdb.org/t/p/w500/7vMBFraC8EaBQ8R3mI4Z8BJ6sSP.jpg'
            },
            {
                title: "Babette's Feast",
                image_url: 'https://upload.wikimedia.org/wikipedia/en/2/23/Babettes_feast.jpg'
            },
            {
                title: 'The Grand Budapest Hotel',
                image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80'
            },
            {
                title: 'Jiro Dreams of Sushi',
                image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80'
            },
            {
                title: 'Willy Wonka',
                image_url: 'https://images.unsplash.com/photo-1511381971716-659928dcb27d?w=500&q=80'
            }
        ];

        for (const revert of reverts) {
            await queryInterface.sequelize.query(
                `UPDATE media SET image_url = :image_url, updated_at = NOW() WHERE title = :title`,
                {
                    replacements: revert,
                    type: Sequelize.QueryTypes.UPDATE
                }
            );
        }
    }
};
