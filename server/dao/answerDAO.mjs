
import db from "../db/db.mjs";
import Answer from "../Components/Answer.mjs";



function mapRowsToAnswer(rows) {
    // Note: the parameters must follow the same order specified in the constructor.
    return rows.map(row => new Answer(row.id, row.text));
}


// NOTE: all functions return error messages as json object { error: <string> } 
export default function AnswerDao() {

    // This function retrieves an answer given its id.
    this.getAnswer = (ids) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM answers WHERE id = ? OR id = ? OR id = ? OR id = ? OR id = ?';
            db.all(query, [ids[0], ids[1], ids[2], ids[3], ids[4]], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows === undefined) {
                    resolve({error: 'answer not found.'});
                } else if(rows.length < 5){
                    resolve({error: 'Not enough answers.'});
                } else {
                    resolve(mapRowsToAnswer(rows));
                }
            });
        });
    };

    // This function returns the total number of answers in the database.
    this.getAnswerNumber = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as number FROM answers';
            db.get(query, (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'answer not found.'});
                } else {
                    resolve(row.number);
                }
            });
        });
    };

    this.getBests = (best) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM answers WHERE id = ? OR id = ?';
            db.all(query, [best.best1, best.best2], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows.length !== 2) {
                    resolve({error: 'best answers not found.'});
                } else {
                    resolve(mapRowsToAnswer(rows));
                }
            });
        });
    };

}
