<script>
    import { onMount } from 'svelte';
    import { link, push, querystring } from 'svelte-spa-router';
    import { auth } from '../lib/stores/auth.js';

    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let loading = false;
    let localError = '';
    
    // Movie redirect info (from Movies page)
    let redirectInfo = null;

    onMount(() => {
        const params = new URLSearchParams($querystring);
        if (params.get('redirect') === 'recipe') {
            redirectInfo = {
                movie_title: params.get('movie_title'),
                movie_poster: params.get('movie_poster'),
                movie_year: params.get('movie_year'),
                movie_type: params.get('movie_type'),
            };
        }
    });

    async function handleSubmit() {
        localError = '';
        
        if (password !== confirmPassword) {
            localError = 'Passwords do not match';
            return;
        }

        if (password.length < 8) {
            localError = 'Password must be at least 8 characters';
            return;
        }

        loading = true;
        const result = await auth.register(username, email, password);
        loading = false;
        
        if (result.success) {
            if (redirectInfo) {
                // Redirect to recipe creation with movie info
                const recipeParams = new URLSearchParams({
                    prefill_movie: 'true',
                    movie_title: redirectInfo.movie_title || '',
                    movie_poster: redirectInfo.movie_poster || '',
                    movie_year: redirectInfo.movie_year || '',
                    movie_type: redirectInfo.movie_type || 'film',
                });
                push(`/recipes/new?${recipeParams.toString()}`);
            } else {
                push('/');
            }
        }
    }
</script>

<div class="auth-page">
    <div class="auth-card">
        <h1>Register</h1>
        
        {#if $auth.error || localError}
            <div class="error">{$auth.error || localError}</div>
        {/if}

        <form on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
                <label for="username">Username</label>
                <input 
                    type="text" 
                    id="username" 
                    bind:value={username} 
                    required
                    minlength="3"
                    disabled={loading}
                />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    bind:value={email} 
                    required
                    disabled={loading}
                />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={password} 
                    required
                    minlength="8"
                    disabled={loading}
                />
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    bind:value={confirmPassword} 
                    required
                    disabled={loading}
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : "Register"}
            </button>
        </form>

        <p class="switch">
            Already have an account? <a href="/login{$querystring ? '?' + $querystring : ''}" use:link>Log in</a>
        </p>
    </div>
</div>

<style>
    .auth-page {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .auth-card {
        background: #1a1a2e;
        padding: 2.5rem;
        border-radius: 12px;
        width: 100%;
        max-width: 400px;
    }

    h1 {
        color: #eee;
        text-align: center;
        margin-bottom: 2rem;
    }

    .error {
        background: rgba(233, 69, 96, 0.2);
        border: 1px solid #e94560;
        color: #e94560;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        color: #ccc;
        margin-bottom: 0.5rem;
    }

    input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #16213e;
        color: #eee;
        font-size: 1rem;
    }

    input:focus {
        outline: none;
        border-color: #e94560;
    }

    button {
        width: 100%;
        padding: 1rem;
        background: #e94560;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
    }

    button:hover:not(:disabled) {
        background: #d13354;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .switch {
        text-align: center;
        margin-top: 1.5rem;
        color: #888;
    }

    .switch a {
        color: #e94560;
    }
</style>
