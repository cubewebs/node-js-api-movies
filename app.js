const express = require('express'); // require --> commonJS
const movies = require('./movies.json');

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT ?? 3000;

// Todos los recursos que sean MOVIES se identifican con /movies
app.get('/movies', (req, res) => {
    const { genre } = req.query;
    if (genre) {
        const moviesByGenre = movies.filter(
            movies => movies.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(moviesByGenre);
    }
    res.json(movies);
});

app.get('/movies/:id', (req, res) => { // path-to-regex
    const { id } = req.params;
    const movie = movies.find(m => m.id === id);
    if (movie) res.json(movie);
    res.status(404).json({ error: 'Movie not found' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});