

import db from "../db.mjs";
import Games from "../Games.mjs";




// NOTE: all functions return error messages as json object { error: <string> } 
export default function GamesDao() {

    // This function retrieves all the previous games of a user.
    this.getGames = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM games WHERE user_id = ?';
            db.all(query, [id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows === undefined) {
                    resolve({error: 'No games yet, start playing!'});
                } else {
                    const games = rows.map(row => new Games(row.id, row.user_id, row.meme_url_1, row.meme_url_2, row.meme_url_3, row.vote_1, row.vote_2, row.vote_3));
                    resolve(games);
                }
            });
        });
    };

    // This function inserts a game into the database.
    this.storeGame = (id, game) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO games (user_id, meme_id_1, meme_url_1, meme_id_2, meme_url_2, meme_id_3, meme_url_3, vote_1, vote_2, vote_3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.run(query, [id, game[0].meme.id, game[0].meme.url, game[1].meme.id, game[1].meme.url, game[2].meme.id, game[2].meme.url, game[0].points, game[1].points, game[2].points], function (err) {
                if (err) {
                    reject(err);
                }
                resolve({id: this.lastID});
            });
        });
    };

    // This function retrieves a random phrase from the database.
    this.getPhrase = (type) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM meme_phrases WHERE type = ? ORDER BY RANDOM() LIMIT 1';
            db.get(query, [type], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'phrase not found.'});
                } else {
                    resolve(row.phrase);
                }
            });
        });
    }


}
