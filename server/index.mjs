/*** Importing modules ***/
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import {check, validationResult} from 'express-validator'; // validation middleware
import UserDao from "./dao/userDAO.mjs";
import GamesDao from "./dao/gamesDAO.mjs";
import NewGameController from "./NewGameController.mjs";
import BestDao from './dao/bestDAO.mjs';


//initiate the DAOs
const userDao = new UserDao();
const gamesDao = new GamesDao();
const newGameController = new NewGameController();
const bestDao = new BestDao();


//init express and set up the middlewares
const app = express();
app.use(morgan('dev'));
app.use(express.json());


// Set up and enable Cross-Origin Resource Sharing (CORS)
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));

//Passport

import passport from 'passport';
import LocalStrategy from 'passport-local';

passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUserByCredentials(username, password);
    if (!user) {
        return callback(null, false, 'Incorrect username or password, try again!');
    }
    return callback(null, user);
}));

passport.serializeUser(function (user, callback){
    callback(null, user);
});

passport.deserializeUser(function (user,callback){
    try {
        userDao.checkUser(user.email)
        .then((user) => {
            if (!user) {
                return callback(null, false, 'User not found');
            } else {
                return callback(null, user);
            }
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
    //this would solve the samesite problem but since we are not using https it would not work
    // cookie: {
    //     sameSite: 'None', // Ensure the SameSite attribute is set to None
    //     secure: true // Ensure the cookie will only be sent over HTTPS
    //   }

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

app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        return res.status(401).json({ error: info});
      }
      req.login(user, (err) => {
        if (err)
          return next(err);
        return res.status(202).json(req.user);
      });
  })(req, res, next);
});

//2.Get session

app.get('/api/sessions/current', (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
} else
    res.status(401).json({error: 'Not authenticated'});
});

//3.Logout

app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});

//4.Register
app.post('/api/users', [
    check('username').isLength({min: 3}),
    check('password').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return onValidationErrors(errors, res);
    }
    const user = req.body;
    const isPresent = await userDao.checkUser(user.email);
    if(user.password !== req.body.confirmPassword){
        return res.status(422).json({error: 'Passwords do not match'});
    }  else if (!isPresent) {
        const result = await userDao.createUser(user);
        res.status(201).json(await userDao.getUserById(result));
    } else {
      return res.status(422).json({error: 'Username already in use'});
  }
});

//NewGames API
//1. Returns a new game, checking if the user is logged in, if so calls newLogGame, else calls newGuestGame
app.get('/api/newGame',  async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const result = await newGameController.newLogGame();
            res.status(201).json(result);
        } else {
            const result = await newGameController.newGuestGame();
            res.status(201).json(result);
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//2.Check if the answer is a best fit
app.post('/api/best', async (req, res) => {
    try {
        const result = await bestDao.isBest(req.body.meme.id, req.body.answer.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//3.Returns all the best answers id for a meme
app.get('/api/best/:id', async (req, res) => {
    try{
        const result = await bestDao.getAllBest(req.params.id)
        res.status(200).json(result)
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})



//Games history api
//1. Returns the list of all the games played by the user.
app.post('/api/history', isLoggedIn, async (req, res) => {
    try {
        const games = await gamesDao.getGames(req.body.user.id);
        res.status(202).json(games);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//2. Stores the result of a game played by the user.
app.post('/api/games', isLoggedIn, async (req, res) => {
    const game = req.body.game;
    const user = req.body.user;
    try {
        const result = await gamesDao.storeGame(user.id, game);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Endround phrases api
//1. Returns a phrase of the specified type.
app.get('/api/phrases/:type', async (req, res) => {
    try {
        const phrase = await gamesDao.getPhrase(req.params.type);
        res.status(201).json(phrase);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});







// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
