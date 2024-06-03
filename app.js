const express = require('express'); // require --> commonJS
const crypto = require('node:crypto');
const movies = require('./movies.json');
const cors = require('cors');
const {validateMovie, validatePartialMovie} = require("./schemas/movies");

const app = express();
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = ['http://localhost:3000', 'http://localhost:8080'];
        callback(null, ACCEPTED_ORIGINS.includes(origin));
    }
}));
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

app.post('/movies', (req, res) => {
const result = validateMovie(req.body);
if (result.error) {
    // también se puede usar el estado 422
    return res.status(400).json({ error: JSON.parse(result.error.message) })
}
    const newMovie = {
        id: crypto.randomUUID(), // uuid v4
        ...result.data
    };
    // TODO esto no sería REST, porque estamos guardando el estado de la aplicacion en memoria. PASAR A BD.
    movies.push(newMovie);
    res.status(201).json(newMovie); // actualizar la cache del cliente
});

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex(m => m.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    movies.splice(movieIndex, 1);
    return res.status(204).end();
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body);

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex(m => m.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    movies[movieIndex] = {
        ...movies[movieIndex],
        ...result.data
    };
    return res.json(movies[movieIndex]);
});

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});