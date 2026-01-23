<script>
    import { link } from "svelte-spa-router";
</script>

<div class="legal-page movie-container">
    <h1>Privacy Policy</h1>

    <section>
        <h2>1. Data Collection</h2>
        <p>
            When using the Ciné Délices website, we collect the following data
            when you create an account:
        </p>
        <ul>
            <li>Username</li>
            <li>Email address</li>
            <li>Password (encrypted)</li>
            <li>Recipe preferences and favorites</li>
        </ul>
    </section>

    <section>
        <h2>2. Use of Data</h2>
        <p>Your data is used only to:</p>
        <ul>
            <li>Allow you to log in to your account.</li>
            <li>Save your favorite recipes.</li>
            <li>Publish and manage your own recipes.</li>
            <li>Personalize your experience on the site.</li>
        </ul>
    </section>

    <section>
        <h2>3. Cookies</h2>
        <p>
            We use cookies strictly necessary for the operation of the site
            (user session management). These cookies do not require prior
            consent under current regulations, but we inform you for
            transparency.
        </p>
    </section>

    <section>
        <h2>4. Your Rights (GDPR)</h2>
        <p>
            In accordance with the General Data Protection Regulation (GDPR),
            you have the following rights:
        </p>
        <ul>
            <li>Right of access (know what data we have about you).</li>
            <li>Right of rectification (modify your data).</li>
            <li>
                Right to erasure (delete your account and your data).
            </li>
        </ul>
        <p>
            To exercise these rights, you can contact us at <a
                href="mailto:privacy@cinedelices.com"
                class="gold-link">privacy@cinedelices.com</a
            > or delete your account directly from your profile page.
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

    ul {
        list-style-type: disc;
        margin-left: 2rem;
        margin-bottom: 1.5rem;
    }

    li {
        margin-bottom: 0.5rem;
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
