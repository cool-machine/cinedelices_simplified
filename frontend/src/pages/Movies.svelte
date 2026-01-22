<script>
    import { link, push } from "svelte-spa-router";
    import { api } from "../lib/api.js";
    import { auth } from "../lib/stores/auth.js";

    let searchQuery = "";
    let mediaType = "movie";
    let movies = [];
    let loading = false;
    let error = null;
    let debounceTimer = null;

    // Live search as user types (debounced)
    function handleInput() {
        // Clear previous timer
        if (debounceTimer) clearTimeout(debounceTimer);
        
        // Clear results if query is too short
        if (!searchQuery.trim() || searchQuery.trim().length < 2) {
            movies = [];
            error = null;
            return;
        }

        // Debounce: wait 300ms after user stops typing
        debounceTimer = setTimeout(() => {
            performSearch();
        }, 300);
    }

    async function performSearch() {
        if (!searchQuery.trim() || searchQuery.trim().length < 2) {
            return;
        }

        loading = true;
        error = null;

        try {
            const response = await api.searchMovies(searchQuery.trim(), mediaType);
            movies = response.results || [];
        } catch (e) {
            error = e.message;
            movies = [];
        } finally {
            loading = false;
        }
    }

    // Also search when media type changes
    function handleTypeChange() {
        if (searchQuery.trim().length >= 2) {
            performSearch();
        }
    }

    function createRecipeForMovie(movie) {
        if (!$auth.user) {
            // Store the movie info and redirect to login (user can switch to register)
            const params = new URLSearchParams({
                redirect: "recipe",
                movie_title: movie.title,
                movie_poster: movie.poster_url || "",
                movie_year: movie.year || "",
                movie_type: movie.type || "film",
            });
            push(`/login?${params.toString()}`);
        } else {
            // User is logged in, go directly to recipe creation
            const params = new URLSearchParams({
                prefill_movie: "true",
                movie_title: movie.title,
                movie_poster: movie.poster_url || "",
                movie_year: movie.year || "",
                movie_type: movie.type || "film",
            });
            push(`/recipes/new?${params.toString()}`);
        }
    }
</script>

<div class="movies-page">
    <div class="page-header">
        <h1>🎬 Découvrir des Films & Séries</h1>
        <p class="subtitle">
            Recherchez un film ou une série pour créer une recette inspirée
        </p>
    </div>

    <div class="search-section">
        <div class="search-controls">
            <div class="search-box">
                <input
                    type="text"
                    bind:value={searchQuery}
                    oninput={handleInput}
                    placeholder="Commencez à taper pour rechercher..."
                    autofocus
                />
                {#if loading}
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
                    Films
                </label>
                <label>
                    <input
                        type="radio"
                        bind:group={mediaType}
                        value="tv"
                        onchange={handleTypeChange}
                    />
                    Séries
                </label>
            </div>
        </div>
    </div>

    {#if error}
        <div class="error">{error}</div>
    {/if}

    {#if movies.length > 0}
        <div class="movies-grid">
            {#each movies as movie}
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
                            {movie.type === "serie" ? "Série" : "Film"}
                        </span>
                        {#if movie.overview}
                            <p class="overview">{movie.overview.slice(0, 100)}...</p>
                        {/if}
                        <button
                            class="create-recipe-btn"
                            onclick={() => createRecipeForMovie(movie)}
                        >
                            Créer une recette
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="welcome-message">
            <div class="welcome-icon">🍿</div>
            <h2>Bienvenue dans la recherche de films</h2>
            <p>
                Utilisez la barre de recherche ci-dessus pour trouver un film ou
                une série, puis créez une recette inspirée de votre choix.
            </p>
            {#if !$auth.user}
                <p class="auth-hint">
                    <a href="/login" use:link>Connectez-vous</a> ou
                    <a href="/register" use:link>inscrivez-vous</a> pour créer
                    vos propres recettes.
                </p>
            {/if}
        </div>
    {/if}
</div>

<style>
    .movies-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .page-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .page-header h1 {
        font-family: var(--font-title);
        font-size: 2.5rem;
        color: var(--or-cinema);
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: #999;
        font-size: 1.1rem;
    }

    .search-section {
        background: rgba(26, 26, 46, 0.8);
        border: 1px solid #333;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
    }

    .search-controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
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

    .search-box button {
        padding: 1rem 2rem;
        background: var(--rouge-rideau);
        color: var(--or-cinema);
        border: 2px solid var(--or-cinema);
        border-radius: 8px;
        font-family: var(--font-title);
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
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

    .error {
        background: rgba(233, 69, 96, 0.2);
        border: 1px solid #e94560;
        color: #e94560;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .loading {
        text-align: center;
        padding: 3rem;
        color: #999;
    }

    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #444;
        border-top-color: var(--or-cinema);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 0.5rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .no-results {
        text-align: center;
        padding: 3rem;
        color: #888;
    }

    .no-results .hint {
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
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

    .create-recipe-btn {
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

    .create-recipe-btn:hover {
        background: #e8c545;
        transform: scale(1.02);
    }

    .welcome-message {
        text-align: center;
        padding: 4rem 2rem;
        background: rgba(26, 26, 46, 0.5);
        border-radius: 12px;
        border: 1px solid #333;
    }

    .welcome-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .welcome-message h2 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        margin-bottom: 1rem;
    }

    .welcome-message p {
        color: #999;
        max-width: 500px;
        margin: 0 auto;
        line-height: 1.6;
    }

    .auth-hint {
        margin-top: 1.5rem !important;
    }

    .auth-hint a {
        color: var(--or-cinema);
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        .page-header h1 {
            font-size: 1.8rem;
        }

        .search-box {
            flex-direction: column;
        }

        .movies-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
