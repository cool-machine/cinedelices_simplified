<script>
    import { onMount } from "svelte";
    import { push, querystring } from "svelte-spa-router";
    import { api } from "../lib/api.js";
    import { auth } from "../lib/stores/auth.js";

    let categories = [];
    let media = [];
    let loading = false;
    let error = null;
    let generating = false;
    let mode = "choice";

    let prefilledMovie = null;
    let searchQuery = "";
    let mediaType = "movie";
    let searchResults = [];
    let searching = false;
    let searchError = null;
    let debounceTimer = null;

    let form = {
        title: "",
        description: "",
        ingredients: "",
        instructions: "",
        image_url: "",
        category_id: "",
        media_id: "",
    };

    onMount(async () => {
        if (!$auth.user) {
            push("/login");
            return;
        }

        try {
            const params = new URLSearchParams($querystring);
            const prefill = params.get("prefill_movie");

            if (prefill === "true") {
                prefilledMovie = {
                    title: params.get("movie_title"),
                    poster_url: params.get("movie_poster"),
                    year: params.get("movie_year"),
                    type: params.get("movie_type"),
                    overview: params.get("movie_overview"),
                };

                // Pre-fill form title with the movie title if available
                if (prefilledMovie.title) {
                    form.title = prefilledMovie.title; // Default recipe title to movie name
                }
            }

            [categories, media] = await Promise.all([
                api.getCategories(),
                api.getMedia(),
            ]);

            // If we have a prefilled movie, try to find it in the media list
            if (prefilledMovie && prefilledMovie.title) {
                await ensureMediaForPrefill(prefilledMovie);
            }

            if (!prefilledMovie) {
                mode = "manual";
            }
        } catch (e) {
            error = e.message;
        }
    });

    async function handleSubmit(event) {
        event?.preventDefault?.();
        loading = true;
        error = null;

        try {
            const data = {
                ...form,
                user_id: $auth.user.id,
                category_id: form.category_id || null,
                media_id: form.media_id || null,
            };
            const recipe = await api.createRecipe(data);
            push(`/recipes/${recipe.id}`);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    function resolveSelectedMovie() {
        if (prefilledMovie?.title) {
            return prefilledMovie;
        }

        if (form.media_id) {
            const selected = media.find((m) => m.id === Number(form.media_id));
            if (selected) {
                return {
                    title: selected.title,
                    year: selected.release_year,
                    type: selected.type,
                    poster_url: selected.image_url,
                    overview: prefilledMovie?.overview || null
                };
            }
        }

        if (movieTitleInput.trim()) {
            return {
                title: movieTitleInput.trim(),
                year: null,
                type: null,
                poster_url: null,
                overview: null
            };
        }

        return null;
    }

    async function handleGenerate() {
        const movie = resolveSelectedMovie();
        if (!movie) {
            error = "Select a movie or TV show first.";
            return;
        }

        generating = true;
        error = null;

        try {
            const result = await api.generateRecipe(movie);

            if (result?.title) form.title = result.title;
            if (result?.description) form.description = result.description;
            if (result?.image_url && !form.image_url) form.image_url = result.image_url;

            if (Array.isArray(result?.ingredients)) {
                form.ingredients = result.ingredients.map((item) => `- ${item}`).join("\n");
            }

            if (Array.isArray(result?.instructions)) {
                form.instructions = result.instructions
                    .map((step, index) => `${index + 1}. ${step}`)
                    .join("\n");
            }
        } catch (e) {
            error = e.message;
        } finally {
            generating = false;
        }
    }

    async function startGenerate() {
        await handleGenerate();
        if (!error) {
            mode = "ai";
        }
    }

    function startManual() {
        mode = "manual";
    }

    async function ensureMediaForPrefill(movie) {
        const existingMedia = media.find(
            (m) => m.title.toLowerCase() === movie.title.toLowerCase(),
        );

        if (existingMedia) {
            form.media_id = existingMedia.id;
            return;
        }

        try {
            const newMedia = await api.createMedia({
                title: movie.title,
                type: movie.type || "film",
                release_year: parseInt(movie.year) || new Date().getFullYear(),
                image_url: movie.poster_url || null
            });
            media = [...media, newMedia];
            form.media_id = newMedia.id;
        } catch (err) {
            console.error("Auto-creation of media failed", err);
        }
    }

    function handleSearchInput() {
        if (debounceTimer) clearTimeout(debounceTimer);

        if (!searchQuery.trim() || searchQuery.trim().length < 2) {
            searchResults = [];
            searchError = null;
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch();
        }, 300);
    }

    async function performSearch() {
        if (!searchQuery.trim() || searchQuery.trim().length < 2) {
            return;
        }

        searching = true;
        searchError = null;

        try {
            const response = await api.searchMovies(searchQuery.trim(), mediaType);
            searchResults = response.results || [];
        } catch (e) {
            searchError = e.message;
            searchResults = [];
        } finally {
            searching = false;
        }
    }

    function handleTypeChange() {
        if (searchQuery.trim().length >= 2) {
            performSearch();
        }
    }

    async function selectMovie(movie) {
        prefilledMovie = {
            title: movie.title,
            poster_url: movie.poster_url,
            year: movie.year,
            type: movie.type,
            overview: movie.overview
        };
        await ensureMediaForPrefill(prefilledMovie);
        mode = "choice";
    }
</script>

<div class="recipe-form-page">
    <h1>New Recipe</h1>

    {#if error}
        <div class="error">{error}</div>
    {/if}

    {#if mode === "choice"}
        <div class="choice-panel">
            <h2>How do you want to create your recipe?</h2>
            <div class="choice-actions">
                <button type="button" class="secondary" onclick={startManual}>
                    Write a Recipe
                </button>
                <button
                    type="button"
                    class="primary"
                    onclick={startGenerate}
                    disabled={generating}
                >
                    {generating ? "Generating..." : "Generate Recipe with AI"}
                </button>
            </div>
            <p class="hint">
                Choose AI to prefill the form from the selected movie or TV show.
            </p>
        </div>
    {/if}

    {#if !prefilledMovie}
        <div class="movie-picker">
            <h2>Select a Movie or TV Show</h2>
            <div class="search-controls">
                <div class="search-box">
                    <input
                        type="text"
                        bind:value={searchQuery}
                        oninput={handleSearchInput}
                        placeholder="Start typing to search..."
                    />
                    {#if searching}
                        <span class="search-spinner"></span>
                    {/if}
                </div>

                <div class="type-selector">
                    <label>
                        <input
                            type="radio"
                            bind:group={mediaType}
                            value="movie"
                            onchange={handleTypeChange}
                        />
                        Movies
                    </label>
                    <label>
                        <input
                            type="radio"
                            bind:group={mediaType}
                            value="tv"
                            onchange={handleTypeChange}
                        />
                        TV Shows
                    </label>
                </div>
            </div>

            {#if searchError}
                <div class="error">{searchError}</div>
            {/if}

            {#if searchResults.length > 0}
                <div class="movies-grid">
                    {#each searchResults as movie}
                        <div class="movie-card">
                            <div class="movie-poster">
                                {#if movie.poster_url}
                                    <img src={movie.poster_url} alt={movie.title} />
                                {:else}
                                    <div class="no-poster">🎬</div>
                                {/if}
                            </div>
                            <div class="movie-info">
                                <h3>{movie.title}</h3>
                                {#if movie.year}
                                    <span class="year">{movie.year}</span>
                                {/if}
                                <span class="type-badge">
                                    {movie.type === "serie" ? "TV Show" : "Movie"}
                                </span>
                                {#if movie.overview}
                                    <p class="overview">{movie.overview.slice(0, 100)}...</p>
                                {/if}
                                <button
                                    class="select-movie-btn"
                                    onclick={() => selectMovie(movie)}
                                >
                                    Use this movie
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}

    {#if mode !== "choice"}
        <form onsubmit={handleSubmit}>
        <div class="form-group">
            <label for="title">Title *</label>
            <input
                type="text"
                id="title"
                bind:value={form.title}
                required
                disabled={loading}
            />
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="category">Category</label>
                <select
                    id="category"
                    bind:value={form.category_id}
                    disabled={loading}
                >
                    <option value="">Select...</option>
                    {#each categories as cat}
                        <option value={cat.id}>{cat.name}</option>
                    {/each}
                </select>
            </div>

            <div class="form-group">
                <label for="media">Movie/Series</label>
                <select
                    id="media"
                    bind:value={form.media_id}
                    disabled={loading}
                >
                    <option value="">Select...</option>
                    {#each media as m}
                        <option value={m.id}>{m.title}</option>
                    {/each}
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="image_url">Image URL</label>
            <input
                type="url"
                id="image_url"
                bind:value={form.image_url}
                placeholder="https://..."
                disabled={loading}
            />
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea
                id="description"
                bind:value={form.description}
                rows="3"
                disabled={loading}
            ></textarea>
        </div>

        <div class="form-group">
            <label for="ingredients">Ingredients *</label>
            <textarea
                id="ingredients"
                bind:value={form.ingredients}
                rows="6"
                required
                placeholder="- 200g flour&#10;- 3 eggs&#10;..."
                disabled={loading}
            ></textarea>
        </div>

        <div class="form-group">
            <label for="instructions">Instructions *</label>
            <textarea
                id="instructions"
                bind:value={form.instructions}
                rows="8"
                required
                placeholder="1. Preheat the oven...&#10;2. Mix..."
                disabled={loading}
            ></textarea>
        </div>

        <div class="form-actions">
            <button
                type="button"
                class="cancel"
                onclick={() => push("/recipes")}
            >
                Cancel
            </button>
            <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Recipe"}
            </button>
        </div>
        </form>
    {/if}
</div>

<style>
    .recipe-form-page {
        max-width: 700px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        color: #eee;
        margin-bottom: 2rem;
    }

    .error {
        background: rgba(233, 69, 96, 0.2);
        border: 1px solid #e94560;
        color: #e94560;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .choice-panel {
        margin-bottom: 2rem;
        padding: 1.5rem;
        border: 1px solid #333;
        border-radius: 12px;
        background: rgba(26, 26, 46, 0.6);
    }

    .choice-panel h2 {
        margin: 0 0 1rem;
        color: #eee;
    }

    .choice-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .choice-actions button {
        flex: 1 1 200px;
    }

    .movie-picker {
        margin-bottom: 2rem;
        padding: 1.5rem;
        border: 1px solid #333;
        border-radius: 12px;
        background: rgba(26, 26, 46, 0.6);
    }

    .movie-picker h2 {
        margin: 0 0 1rem;
        color: #eee;
    }

    .search-controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .search-box {
        display: flex;
        gap: 0.5rem;
        position: relative;
    }

    .search-box input {
        flex: 1;
        padding: 1rem 1.5rem;
        border: 1px solid #444;
        border-radius: 8px;
        background: #1a1a2e;
        color: #eee;
        font-size: 1rem;
    }

    .search-box input:focus {
        outline: none;
        border-color: var(--or-cinema);
    }

    .search-spinner {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        border: 2px solid #444;
        border-top-color: var(--or-cinema);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .type-selector {
        display: flex;
        gap: 2rem;
        justify-content: center;
    }

    .type-selector label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #ccc;
        cursor: pointer;
    }

    .type-selector input[type="radio"] {
        accent-color: var(--or-cinema);
    }

    .movies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    .movie-card {
        background: linear-gradient(145deg, #1a1a2e, #16213e);
        border: 1px solid #333;
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s;
    }

    .movie-card:hover {
        transform: translateY(-5px);
        border-color: var(--or-cinema);
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
    }

    .movie-poster {
        height: 200px;
        overflow: hidden;
        background: #0f0f1a;
    }

    .movie-poster img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .no-poster {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        background: #1a1a2e;
    }

    .movie-info {
        padding: 1rem;
    }

    .movie-info h3 {
        font-family: var(--font-title);
        font-size: 1.1rem;
        color: var(--or-cinema);
        margin-bottom: 0.5rem;
        line-height: 1.3;
    }

    .year {
        display: inline-block;
        color: #888;
        font-size: 0.85rem;
        margin-right: 0.5rem;
    }

    .type-badge {
        display: inline-block;
        background: var(--rouge-rideau);
        color: #fff;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        text-transform: uppercase;
    }

    .overview {
        color: #999;
        font-size: 0.85rem;
        margin: 0.75rem 0;
        line-height: 1.4;
    }

    .select-movie-btn {
        width: 100%;
        padding: 0.75rem;
        background: var(--or-cinema);
        color: var(--noir-pur);
        border: none;
        border-radius: 6px;
        font-family: var(--font-title);
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 0.5rem;
    }

    .select-movie-btn:hover {
        background: #e8c545;
        transform: scale(1.02);
    }

    label {
        display: block;
        color: #ccc;
        margin-bottom: 0.5rem;
    }

    input,
    select,
    textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #1a1a2e;
        color: #eee;
        font-size: 1rem;
        font-family: inherit;
    }

    input:focus,
    select:focus,
    textarea:focus {
        outline: none;
        border-color: #e94560;
    }

    textarea {
        resize: vertical;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .hint {
        color: #9aa0b3;
        font-size: 0.9rem;
    }

    button {
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
    }

    button[type="submit"] {
        background: #e94560;
        color: white;
    }

    button.primary {
        background: #e94560;
        color: white;
    }

    button.primary:hover:not(:disabled) {
        background: #d13354;
    }

    button.secondary {
        background: #2d3250;
        color: #eee;
    }

    button.secondary:hover:not(:disabled) {
        background: #3a4164;
    }

    button[type="submit"]:hover:not(:disabled) {
        background: #d13354;
    }

    button.cancel {
        background: #333;
        color: #ccc;
    }

    button.cancel:hover {
        background: #444;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style>
