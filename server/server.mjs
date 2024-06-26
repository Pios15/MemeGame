/*** Importing modules ***/
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import {check, validationResult} from 'express-validator'; // validation middleware
import UserDao from "./dao/userDAO.mjs";
import GamesDao from "./dao/gamesDAO.mjs";
import NewGameController from "./NewGameController.mjs";


//initiate the DAOs
const userDao = new UserDao();
const gamesDao = new GamesDao();
const newGameController = new NewGameController();


//init express and set up the middlewares
const app = express();
app.use(morgan('dev'));
app.use(express.json());


// Set up and enable Cross-Origin Resource Sharing (CORS)
const corsOptions = {
    origin: 'http://localhost:5173/',
    credentials: true
};
app.use(cors(corsOptions));

//Passport

import passport from 'passport';
import LocalStrategy from 'passport-local';

passport.use(new LocalStrategy(async function verify(username, password, callback) {
    try {
        const user = await userDao.getUserByCredentials(username, password);
        if (!user) {
            return callback(null, false, 'Incorrect username or password, try again!');
        }
        return callback(null, user);
    } catch (err) {
        return callback(err);
    }

}));

passport.serializeUser(function (user, callback){
    callback(null, user.id);
});

//TODO check if this is correct
passport.deserializeUser(function (user,callback){
    try {
        const user = userDao.getUserById(id)
        .then((user) => {
            if (!user) {
                return callback(null, false, 'User not found');
            }
            return callback(null, user);
        }).catch((err) => {
            reject (err)
        })
    } catch {
        return callback(err);
    }
});

//creating the session

import session from 'express-session';

app.use(session({
    secret: 'I surely hope this works!',
    resave: false,
    saveUninitialized: false

}));
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({error: 'Unauthorized'});

};



// Utility Functions

// This function is used to handle validation errors
const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    return res.status(422).json({validationErrors: errors.mapped()});
};

// Only keep the error message in the response
const errorFormatter = ({msg}) => {
    return msg;
};




//Session API
//1.Login

app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({error: info});
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.json(user);
        });
    });
});

//2.Get session

app.get('/api/session/current', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json(req.user);
    }
    return res.status(401).json({error: 'Unauthorized'});
});

//3.Logout

app.delete('/api/sessions', (req, res) => {
    req.logout(() => {
        res.end();
    });
});

//NewGames API
//1. Returns a new game, checking if the user is logged in, if so calls newLogGame, else calls newGuestGame
app.get('/api/newGame',  async (req, res) => {
    if (req.isAuthenticated()) {
        const result = await newGameController.newLogGame(req, res);
        res.json(result);
    } else {
        const result = newGameController.newGuestGame(req, res);
        res.json(result);
    }
});


//Games history api
//1. Returns the list of all the games played by the user.
app.get('/api/games', isLoggedIn, async (req, res) => {
    try {
        const games = await gamesDao.getGames(req.user.id);
        res.json(games);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//2. Stores the result of a game played by the user.
app.post('/api/games', isLoggedIn, async (req, res) => {
    const game = req.body;
    try {
        const result = await gamesDao.storeGame(req.user.id, game);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});







// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
