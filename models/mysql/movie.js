import mysql from 'mysql2/promise';

const config = {
    host: '127.0.0.1',
    user: 'root',
    port: 3306,
    password: '',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config);

export class MovieModel {

    static async getAll ({ genre }) {

        if ( genre ) {
            const lowerCaseGenre = genre.toLowerCase();
            console.log(lowerCaseGenre)
            // coger todos los generos con el mismo nombre en la base de datos MySQL
            const [genres] = await connection.query(
                'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
            )
            console.log(genres[0].id)
            if (genre === 0) return [];
            const filteredMovies = await connection.query(
                `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie JOIN movie_genres ON movie.id=movie_genres.movie_id WHERE genre_id =?;`,
                [genres[0].id]
            )
            console.log(filteredMovies[0])
            return filteredMovies[0]

        }

        // get all movies
        const [movies] = await connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
        )
        console.log(movies)
        return movies
    }

    static async getById ({ id }) {
        console.log(id)
        if (!{id}) return;
        const [movie] = await connection.query(
            'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE BIN_TO_UUID(id) = ?;', [id]
        )
        console.log(movie)
        return movie;
    }

    static async create ({ input }) {

        const [movie] = await connection.query(
            'INSERT INTO movie (title, year, director, duration, poster, rate) VALUES (?, ?, ?, ?, ?, ?);',
            [input.title, input.year, input.director, input.duration, input.poster, input.rate]
        )
        return movie

    }

    static async delete ({ id }) {

        const [movie] = await connection.query(
            'DELETE FROM movie WHERE id = ?;', [id]
        )
        return movie

    }

    static async update ({ id, input }) {

        const [movie] = await connection.query(
            'UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = ?;',
            [input.title, input.year, input.director, input.duration, input.poster, input.rate, id]
        )
        return movie

    }
}
