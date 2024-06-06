import { Router } from 'express';
import {readJSON} from "../utils/utils.js";
const movies = readJSON('../movies.json');
import {validateMovie, validatePartialMovie} from "../schemas/movies.js";
import crypto from "node:crypto";


export const moviesRouter = Router();

moviesRouter.get('/', (req, res) => {
    const { genre } = req.query;
    if (genre) {
        const moviesByGenre = movies.filter(
            movies => movies.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(moviesByGenre);
    }
    res.json(movies);
});

moviesRouter.get('/:id', (req, res) => { // path-to-regex
    const { id } = req.params;
    const movie = movies.find(m => m.id === id);
    if (movie) res.json(movie);
    res.status(404).json({ error: 'Movie not found' });
})

moviesRouter.post('/', (req, res) => {
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
})

moviesRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex(m => m.id === id);
    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    movies.splice(movieIndex, 1);
    return res.status(204).end();
})

moviesRouter.patch('/:id', (req, res) => {
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
})