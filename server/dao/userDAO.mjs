import db from "../db/db.mjs";
import crypto from "crypto";

// NOTE: all functions return error messages as json object { error: <string> }
export default function UserDao() {

    // This function retrieves one user by id
    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'User not found.'});
                } else {
                    resolve(row);
                }
            });
        });
    };

    // This function retrieves one user by email
    this.getUserByCredentials = (email, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email=?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const user = { id: row.id, username: row.username, email: row.email};

                    crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { 
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) 
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }

    //function for check if a user is already registered
    this.checkUser = (email) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email=?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    //function for creating a new user
    this.createUser = (user) => {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16).toString('hex');
            crypto.scrypt(user.password, salt, 32, function (err, hashedPassword) {
                if (err) reject(err);
                const hash = hashedPassword.toString('hex');
                const sql = 'INSERT INTO users (username, email , salt, hash) VALUES (?, ?, ?, ?)';
                db.run(sql, [user.username, user.email, salt, hash], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
            });
        });
    }

}
