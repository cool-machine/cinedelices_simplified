import { describe, test, expect, beforeEach, jest } from '@jest/globals';

const mockRecipe = {
    findByPk: jest.fn(),
    findAll: jest.fn()
};

const mockUser = {};
const mockCategory = {};
const mockMedia = {};

jest.unstable_mockModule('../../src/models/index.js', () => ({
    default: {
        Recipe: mockRecipe,
        User: mockUser,
        Category: mockCategory,
        Media: mockMedia
    }
}));

const { getRecipeById, getAllRecipes } = await import('../../src/controllers/recipeController.js');

const buildRes = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    return res;
};

describe('recipeController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('returns 404 when recipe is not found', async () => {
        mockRecipe.findByPk.mockResolvedValue(null);
        const req = { params: { id: '123' } };
        const res = buildRes();

        await getRecipeById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
    });

    test('returns recipes with related data', async () => {
        const recipes = [{ id: 1, title: 'Ratatouille' }];
        mockRecipe.findAll.mockResolvedValue(recipes);
        const req = {};
        const res = buildRes();

        await getAllRecipes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(recipes);
        expect(mockRecipe.findAll).toHaveBeenCalledWith({
            include: [
                { model: mockUser, as: 'author', attributes: ['id', 'username'] },
                { model: mockCategory, as: 'category' },
                { model: mockMedia, as: 'media' }
            ]
        });
    });
});
