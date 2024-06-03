const z = require('zod');

const movieSchema = z.object({
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string'
    }),
    year: z.number().int().positive().gte(1900),
    director: z.string(),
    duration: z.number().int().positive(),
    poster: z.string().url(),
    genre: z.array(
        z.enum(['Action', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Thriller', 'Horror', 'Adventure']),
        {
            required_error: 'Genre is required',
            invalid_type_error: 'Genre must be an array of enum Genre'
        }
    ),
    rate: z.number().min(0).max(10).default(5)
})

function validateMovie(movie) {
    return movieSchema.safeParse(movie);
}

function validatePartialMovie(movie) {
    return movieSchema.partial().safeParse(movie);
}

module.exports = {
    movieSchema,
    validateMovie,
    validatePartialMovie
}