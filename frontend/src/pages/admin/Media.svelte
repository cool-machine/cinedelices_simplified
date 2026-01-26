<script>
    import { onMount } from 'svelte';
    import { link, push } from 'svelte-spa-router';
    import { api } from '../../lib/api.js';
    import { auth } from '../../lib/stores/auth.js';

    let media = [];
    let loading = true;
    let error = null;
    let showForm = false;
    let editingId = null;
    let formData = { title: '', type: 'film', release_year: '', poster_url: '' };

    onMount(async () => {
        if (!$auth.user || $auth.user.role !== 'admin') {
            push('/');
            return;
        }
        await loadMedia();
    });

    async function loadMedia() {
        try {
            media = await api.admin.getMedia();
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    }

    function startEdit(m) {
        editingId = m.id;
        formData = { 
            title: m.title, 
            type: m.type, 
            release_year: m.release_year || '',
            poster_url: m.poster_url || ''
        };
        showForm = true;
    }

    function startCreate() {
        editingId = null;
        formData = { title: '', type: 'film', release_year: '', poster_url: '' };
        showForm = true;
    }

    function cancelForm() {
        showForm = false;
        editingId = null;
    }

    async function handleSubmit(event) {
        event?.preventDefault?.();
        if (!formData.title.trim()) return;
        
        try {
            const data = {
                ...formData,
                release_year: formData.release_year ? parseInt(formData.release_year) : null
            };
            
            if (editingId) {
                await api.admin.updateMedia(editingId, data);
            } else {
                await api.admin.createMedia(data);
            }
            await loadMedia();
            cancelForm();
        } catch (e) {
            alert(e.message);
        }
    }

    async function deleteMedia(id) {
        if (!confirm('Delete this media?')) return;
        try {
            await api.admin.deleteMedia(id);
            media = media.filter(m => m.id !== id);
        } catch (e) {
            alert(e.message);
        }
    }
</script>

<div class="admin-page">
    <div class="page-header">
        <h1>🎬 Media Management</h1>
        <div class="header-actions">
            <button class="add-btn" onclick={startCreate}>+ New Media</button>
            <a href="/admin" use:link class="back-btn">← Back</a>
        </div>
    </div>

    {#if showForm}
        <div class="form-card">
            <h3>{editingId ? 'Edit' : 'New'} Media</h3>
            <form onsubmit={handleSubmit}>
                <div class="form-row">
                    <div class="form-group">
                        <label for="media-title">Title</label>
                        <input id="media-title" type="text" bind:value={formData.title} required />
                    </div>
                    <div class="form-group">
                        <label for="media-type">Type</label>
                        <select id="media-type" bind:value={formData.type}>
                            <option value="film">Movie</option>
                            <option value="serie">TV Show</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="media-release-year">Release Year</label>
                        <input
                            id="media-release-year"
                            type="number"
                            bind:value={formData.release_year}
                            min="1900"
                            max="2100"
                        />
                    </div>
                    <div class="form-group">
                        <label for="media-poster-url">Poster URL</label>
                        <input
                            id="media-poster-url"
                            type="url"
                            bind:value={formData.poster_url}
                            placeholder="https://..."
                        />
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel" onclick={cancelForm}>Cancel</button>
                    <button type="submit">{editingId ? 'Save' : 'Create'}</button>
                </div>
            </form>
        </div>
    {/if}

    {#if loading}
        <p class="loading">Loading...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each media as m}
                        <tr>
                            <td>{m.id}</td>
                            <td>{m.title}</td>
                            <td><span class="type-badge {m.type}">{m.type}</span></td>
                            <td>{m.release_year || '-'}</td>
                            <td class="actions">
                                <button class="edit-btn" onclick={() => startEdit(m)}>✏️</button>
                                <button class="delete-btn" onclick={() => deleteMedia(m.id)}>🗑️</button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="5" class="empty">No media</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .admin-page {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
    }

    h1 {
        color: #eee;
    }

    .header-actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .add-btn {
        background: #e94560;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
    }

    .back-btn {
        color: #888;
        text-decoration: none;
    }

    .form-card {
        background: #1a1a2e;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
    }

    .form-card h3 {
        color: #eee;
        margin-bottom: 1rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        color: #ccc;
        margin-bottom: 0.5rem;
    }

    .form-group input, .form-group select {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #333;
        border-radius: 8px;
        background: #16213e;
        color: #eee;
        font-size: 1rem;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .form-actions button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }

    .form-actions button[type="submit"] {
        background: #e94560;
        color: white;
    }

    .form-actions button.cancel {
        background: #333;
        color: #ccc;
    }

    .table-container {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background: #1a1a2e;
        border-radius: 12px;
        overflow: hidden;
    }

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #333;
    }

    th {
        background: #16213e;
        color: #ccc;
    }

    td {
        color: #eee;
    }

    .type-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
    }

    .type-badge.film {
        background: #e94560;
        color: white;
    }

    .type-badge.serie {
        background: #0f3460;
        color: #ccc;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .edit-btn, .delete-btn {
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: transparent;
        font-size: 1rem;
    }

    .edit-btn {
        color: #4dabf7;
    }

    .delete-btn {
        color: #e94560;
    }

    .empty {
        text-align: center;
        color: #666;
    }

    .loading, .error {
        text-align: center;
        padding: 3rem;
        color: #888;
    }

    .error {
        color: #e94560;
    }
</style>
