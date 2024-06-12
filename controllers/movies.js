// import {MovieModel} from "../models/local-file-system/movie.js";
import {MovieModel} from "../models/mysql/movie.js";
import {validateMovie, validatePartialMovie} from "../schemas/movies.js";


export class MovieController {
    static async getAll (req, res) {
        const { genre } = req.query;
        const movies = await MovieModel.getAll({ genre });
        res.json(movies)
    }

    static async getById (req, res) { // path-to-regex
        const { id } = req.params;
        const movie = await MovieModel.getById({ id });
        if (movie) res.json(movie);
        else res.status(404).json({ error: 'Movie not found' });
    }

    static async create (req, res) {
        const result = validateMovie(req.body);
            if (result.error) {
            // también se puede usar el estado 422
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newMovie = MovieModel.create({ input: req.body });
        res.status(201).json(newMovie); // actualizar la cache del cliente
    }

    static async delete (req, res) {
        const { id } = req.params;
        const result = await MovieModel.delete({ id });
        if (result === false) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        return res.status(204).end();
    }

    static async update (req, res) {
        const result = validatePartialMovie(req.body);

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params;

        const updatedMovie = await MovieModel.update({ id, input: result.data });

        return res.json(updatedMovie);

    }
}