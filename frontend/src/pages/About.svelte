<script>
    import { link } from "svelte-spa-router";
</script>

<div class="about-page">
    <div class="page-header">
        <h1>🎬 About Ciné Délices</h1>
        <p class="subtitle">Where Cinema Meets Cuisine</p>
    </div>

    <div class="content-section">
        <div class="section-card">
            <div class="section-icon">🍿</div>
            <h2>Our Story</h2>
            <p>
                Ciné Délices was born from a simple passion: the love of movies and food. 
                We believe that the best films transport us to different worlds, and what 
                better way to enhance that experience than by recreating the dishes that 
                make those stories memorable?
            </p>
            <p>
                From the hearty feasts of Middle-earth to the delicate ratatouille that 
                captured the heart of a Parisian critic, food in cinema tells stories 
                beyond words. Our mission is to bring those culinary moments to your kitchen.
            </p>
        </div>

        <div class="section-card">
            <div class="section-icon">👨‍🍳</div>
            <h2>What We Do</h2>
            <p>
                We curate and create recipes inspired by iconic movies and TV shows. 
                Each recipe is crafted to capture the essence of its cinematic origin, 
                whether it's a comfort dish from your favorite comedy or an elaborate 
                feast from an epic adventure.
            </p>
            <ul class="feature-list">
                <li>🎥 Search movies and TV shows from TMDB</li>
                <li>📝 Create and share your own cinema-inspired recipes</li>
                <li>🍽️ Discover new dishes from films you love</li>
                <li>👥 Join a community of movie-loving foodies</li>
            </ul>
        </div>

        <div class="section-card">
            <div class="section-icon">🌟</div>
            <h2>Join Our Community</h2>
            <p>
                Whether you're a seasoned chef or just starting your culinary journey, 
                Ciné Délices welcomes you. Share your creations, discover new recipes, 
                and connect with fellow film and food enthusiasts.
            </p>
            <div class="cta-buttons">
                <a href="/register" use:link class="btn btn-primary">Get Started</a>
                <a href="/recipes" use:link class="btn btn-secondary">Browse Recipes</a>
            </div>
        </div>
    </div>

    <div class="film-strip-decoration"></div>
</div>

<style>
    .about-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
    }

    .page-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .page-header h1 {
        font-family: var(--font-title);
        font-size: 3rem;
        color: var(--or-cinema);
        margin-bottom: 0.5rem;
    }

    .subtitle {
        font-family: var(--font-accent);
        font-style: italic;
        color: #999;
        font-size: 1.2rem;
    }

    .content-section {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .section-card {
        background: linear-gradient(145deg, #1a1a2e, #16213e);
        border: 1px solid rgba(212, 175, 55, 0.2);
        border-radius: 12px;
        padding: 2rem;
        transition: all 0.3s ease;
    }

    .section-card:hover {
        border-color: var(--or-cinema);
        box-shadow: 0 5px 25px rgba(212, 175, 55, 0.15);
    }

    .section-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .section-card h2 {
        font-family: var(--font-title);
        font-size: 1.8rem;
        color: var(--or-cinema);
        margin-bottom: 1rem;
    }

    .section-card p {
        color: #ccc;
        line-height: 1.7;
        margin-bottom: 1rem;
    }

    .feature-list {
        list-style: none;
        padding: 0;
        margin: 1.5rem 0;
    }

    .feature-list li {
        color: #ccc;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(212, 175, 55, 0.1);
    }

    .feature-list li:last-child {
        border-bottom: none;
    }

    .cta-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
        flex-wrap: wrap;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: var(--or-cinema);
        color: var(--noir-pur);
    }

    .btn-primary:hover {
        background: #e8c547;
        transform: translateY(-2px);
    }

    .btn-secondary {
        background: transparent;
        border: 2px solid var(--or-cinema);
        color: var(--or-cinema);
    }

    .btn-secondary:hover {
        background: var(--or-cinema);
        color: var(--noir-pur);
    }

    .film-strip-decoration {
        height: 20px;
        background: var(--or-cinema);
        margin-top: 3rem;
        position: relative;
    }

    .film-strip-decoration::before {
        content: "";
        position: absolute;
        top: 3px;
        left: 0;
        right: 0;
        height: 14px;
        background: repeating-linear-gradient(
            to right,
            transparent,
            transparent 15px,
            var(--noir-pellicule) 15px,
            var(--noir-pellicule) 25px
        );
    }

    @media (max-width: 768px) {
        .page-header h1 {
            font-size: 2rem;
        }

        .section-card {
            padding: 1.5rem;
        }

        .cta-buttons {
            flex-direction: column;
        }

        .btn {
            text-align: center;
        }
    }
</style>
