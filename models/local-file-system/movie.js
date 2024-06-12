import {readJSON} from "../../utils/utils.js";
const movies = readJSON('../movies.json');
import { randomUUID } from 'node:crypto';

export class MovieModel {
    static async getAll ({ genre }) {
        if ( genre ) {
            return movies.filter(
                movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            )
        } else {
            return movies
        }
    }

    static async getById ({ id }) {
        return movies.find(movie => movie.id === id);
    }

    static async create ({ input }) {
        const newMovie = {
            id: randomUUID(),
            ...input
        };
        movies.push(newMovie);
        return newMovie;
    }

    static async delete ({ id }) {
        const movieIndex = movies.findIndex(m => m.id === id);
        if (movieIndex === -1) return false;
        movies.splice(movieIndex, 1);
        return true;
    }

    static async update ({ id, input }) {
        const movieIndex = movies.findIndex(m => m.id === id);
        if (movieIndex === -1) return false;
        movies[movieIndex] = {
            ...movies[movieIndex],
            ...input
        };
        return movies[movieIndex];
    }
}