<script>
    import { link } from "svelte-spa-router";
</script>

<div class="legal-page movie-container">
    <h1>Terms of Service</h1>

    <section>
        <h2>1. Site Publisher</h2>
        <p>
            This website, accessible at www.cinedelices.com (the "Site"),
            is published by:
        </p>
        <p>
            <strong>The Ciné Délices Team</strong>, students at O'clock school,
            located at 10 Cinema Street, 75000 Paris, France.
        </p>
    </section>

    <section>
        <h2>2. Hosting</h2>
        <p>
            The Site is hosted by <strong>Microsoft Azure</strong>,
            located at 1 Microsoft Way, Redmond, WA 98052, United States.
        </p>
    </section>

    <section>
        <h2>3. Publication Director</h2>
        <p>The Publication Director of the Site is the Ciné Délices team.</p>
    </section>

    <section>
        <h2>4. Contact Us</h2>
        <p>
            By email: <a
                href="mailto:contact@cinedelices.com"
                class="gold-link">contact@cinedelices.com</a
            >
        </p>
    </section>

    <section>
        <h2>5. Personal Data</h2>
        <p>
            The processing of your personal data is governed by
            our <a href="/privacy" use:link class="gold-link"
                >Privacy Policy</a
            >, available in the "Privacy Policy" section.
        </p>
    </section>
</div>

<style>
    .legal-page {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        color: var(--blanc-casse);
    }

    h1 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        font-size: 3rem;
        margin-bottom: 2rem;
        text-align: center;
        text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }

    h2 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        font-size: 1.8rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid rgba(212, 175, 55, 0.3);
        padding-bottom: 0.5rem;
    }

    p {
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .gold-link {
        color: var(--or-cinema);
        text-decoration: none;
        transition: text-shadow 0.3s ease;
    }

    .gold-link:hover {
        text-decoration: underline;
        text-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
    }
</style>
