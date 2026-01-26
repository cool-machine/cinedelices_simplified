import request from 'supertest';
import { describe, test, expect, beforeEach, jest } from '@jest/globals';

jest.unstable_mockModule('../../src/services/tmdbService.js', () => ({
    searchMedia: jest.fn(),
    getMediaDetails: jest.fn()
}));

const { searchMedia, getMediaDetails } = await import('../../src/services/tmdbService.js');
const { default: app } = await import('../../src/app.js');

describe('TMDB routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('rejects missing query parameter', async () => {
        const res = await request(app).get('/api/v1/tmdb/search');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('returns search results and calls tmdb service', async () => {
        const mockResults = [{ id: 1, title: 'Ratatouille' }];
        searchMedia.mockResolvedValue(mockResults);

        const res = await request(app)
            .get('/api/v1/tmdb/search')
            .query({ query: 'rat', type: 'movie' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ results: mockResults });
        expect(searchMedia).toHaveBeenCalledWith('rat', 'movie');
    });

    test('returns media details', async () => {
        const details = { id: 99, title: 'Ratatouille', imdb_id: 'tt0382932' };
        getMediaDetails.mockResolvedValue(details);

        const res = await request(app)
            .get('/api/v1/tmdb/99')
            .query({ type: 'movie' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(details);
        expect(getMediaDetails).toHaveBeenCalledWith(99, 'movie');
    });
});
