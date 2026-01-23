<script>
    let form = {
        name: "",
        email: "",
        subject: "",
        message: "",
    };
    let submitted = false;
    let loading = false;

    function handleSubmit() {
        loading = true;
        // Simulate form submission
        setTimeout(() => {
            loading = false;
            submitted = true;
            form = { name: "", email: "", subject: "", message: "" };
        }, 1000);
    }
</script>

<div class="contact-page">
    <div class="page-header">
        <h1>📬 Contact Us</h1>
        <p class="subtitle">We'd love to hear from you</p>
    </div>

    <div class="contact-content">
        <div class="contact-info">
            <div class="info-card">
                <div class="info-icon">📧</div>
                <h3>Email</h3>
                <p>hello@cinedelices.com</p>
            </div>

            <div class="info-card">
                <div class="info-icon">🌐</div>
                <h3>Social Media</h3>
                <div class="social-links">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                </div>
            </div>

            <div class="info-card">
                <div class="info-icon">💡</div>
                <h3>Feedback</h3>
                <p>Have a recipe suggestion or found a bug? Let us know!</p>
            </div>
        </div>

        <div class="contact-form-wrapper">
            {#if submitted}
                <div class="success-message">
                    <div class="success-icon">✅</div>
                    <h2>Message Sent!</h2>
                    <p>Thank you for reaching out. We'll get back to you soon.</p>
                    <button class="btn btn-primary" on:click={() => (submitted = false)}>
                        Send Another Message
                    </button>
                </div>
            {:else}
                <form class="contact-form" on:submit|preventDefault={handleSubmit}>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={form.name}
                            required
                            disabled={loading}
                            placeholder="Your name"
                        />
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            bind:value={form.email}
                            required
                            disabled={loading}
                            placeholder="your@email.com"
                        />
                    </div>

                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <select id="subject" bind:value={form.subject} required disabled={loading}>
                            <option value="">Select a topic...</option>
                            <option value="general">General Inquiry</option>
                            <option value="feedback">Feedback</option>
                            <option value="bug">Bug Report</option>
                            <option value="recipe">Recipe Suggestion</option>
                            <option value="partnership">Partnership</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea
                            id="message"
                            bind:value={form.message}
                            required
                            disabled={loading}
                            rows="5"
                            placeholder="Your message..."
                        ></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary" disabled={loading}>
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>
            {/if}
        </div>
    </div>

    <div class="film-strip-decoration"></div>
</div>

<style>
    .contact-page {
        max-width: 1000px;
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

    .contact-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
    }

    .contact-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .info-card {
        background: linear-gradient(145deg, #1a1a2e, #16213e);
        border: 1px solid rgba(212, 175, 55, 0.2);
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
    }

    .info-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .info-card h3 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        margin-bottom: 0.5rem;
    }

    .info-card p {
        color: #ccc;
        font-size: 0.95rem;
    }

    .social-links {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .social-links a {
        color: var(--or-cinema);
        text-decoration: none;
        transition: color 0.3s;
    }

    .social-links a:hover {
        color: #e8c547;
    }

    .contact-form-wrapper {
        background: linear-gradient(145deg, #1a1a2e, #16213e);
        border: 1px solid rgba(212, 175, 55, 0.2);
        border-radius: 12px;
        padding: 2rem;
    }

    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        color: #ccc;
        font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.3);
        color: #eee;
        font-size: 1rem;
        font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--or-cinema);
    }

    .form-group textarea {
        resize: vertical;
    }

    .btn {
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: var(--or-cinema);
        color: var(--noir-pur);
    }

    .btn-primary:hover:not(:disabled) {
        background: #e8c547;
        transform: translateY(-2px);
    }

    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .success-message {
        text-align: center;
        padding: 2rem;
    }

    .success-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .success-message h2 {
        font-family: var(--font-title);
        color: var(--or-cinema);
        margin-bottom: 1rem;
    }

    .success-message p {
        color: #ccc;
        margin-bottom: 2rem;
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
        .contact-content {
            grid-template-columns: 1fr;
        }

        .page-header h1 {
            font-size: 2rem;
        }

        .contact-info {
            order: 2;
        }
    }
</style>
