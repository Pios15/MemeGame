

import db from "../db/db.mjs";
import Meme from "../Components/Meme.mjs";



function mapRowsToMeme(row) {
    // Note: the parameters must follow the same order specified in the constructor.
    return new Meme(row.id, row.url);
}


// NOTE: all functions return error messages as json object { error: <string> } 
export default function MemeDao() {

    // This function retrieves a meme given its id and the associated user id.
    this.getMeme = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM memes WHERE id = ?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'meme not found.'});
                } else {
                    resolve(mapRowsToMeme(row));
                }
            });
        });
    };

    //returns the total number of memes in the database
    this.getMemeNumber = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as number FROM memes';
            db.get(query, (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'meme not found.'});
                } else {
                    resolve(row.number);
                }
            });
        });
    };

}
