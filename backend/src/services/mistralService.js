const MISTRAL_API_URL = process.env.MISTRAL_API_URL || 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest';

function buildPrompt(movie) {
    const title = movie.title?.trim();
    const year = movie.year ? ` (${movie.year})` : '';
    const type = movie.type ? `Type: ${movie.type}.` : '';
    const overview = movie.overview ? `Overview: ${movie.overview}` : '';

    return [
        `Movie/TV show: ${title}${year}.`,
        type,
        overview,
        'Based on the provided information about a movie or a TV show, please generate a recipe inspired by it.',
        'Return ONLY valid JSON in the following format:',
        '{',
        '  "title": "Recipe title",',
        '  "description": "Short description",',
        '  "ingredients": ["ingredient 1", "ingredient 2"],',
        '  "instructions": ["step 1", "step 2"],',
        '  "difficulty": "facile|moyen|difficile",',
        '  "prep_time": 30,',
        '  "cook_time": 45',
        '}',
        'Use concise cooking steps and real ingredients.'
    ]
        .filter(Boolean)
        .join('\n');
}

function extractJson(text) {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('Mistral response did not include JSON');
    }
    const jsonText = text.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonText);
}

export async function generateRecipeFromMovie(movie) {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
        throw new Error('MISTRAL_API_KEY is not configured');
    }

    const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: MISTRAL_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional chef and concise culinary writer.'
                },
                {
                    role: 'user',
                    content: buildPrompt(movie)
                }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mistral API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error('Mistral API response missing content');
    }

    return extractJson(content);
}
