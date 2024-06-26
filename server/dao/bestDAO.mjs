

import db from "../db.mjs";
import Best from "../Best.mjs";


// NOTE: all functions return error messages as json object { error: <string> } 
export default function BestDao() {

    // This function retrieves hte two best answers for a meme
    this.getBest = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM best_answers WHERE meme_id = ?';
            db.all(query, [id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows === undefined) {
                    resolve({error: 'best answers not found.'});
                } else {
                    if(rows.length < 2){
                        resolve({error: 'Not enough best answers.'});
                    } else {
                        let index1, index2;
                        do {
                            index1 = Math.floor(Math.random() * rows.length);
                            index2 = Math.floor(Math.random() * rows.length);
                        } while (index1 === index2);
                        resolve(new Best(rows[index1].answer_id, rows[index2].answer_id));
                    }
                }
            });
        });
    };

    //this function returns all the best phrases for a meme
    this.getAllBest = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from best_answers WHERE meme_id = ?';
            db.all(query, [id], (err, rows) =>{
                resolve(rows.map((row) => row.answer_id))
            })
        })
    }

    //this function checks if the answer is the best for a meme
    this.isBest = (meme_id, answer_id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM best_answers WHERE meme_id = ? AND answer_id = ?';
            db.get(query, [meme_id, answer_id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    };

}
