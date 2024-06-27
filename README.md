[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/AVMm0VzU)
# Exam #1: "Meme Game"
## Student: s329131 PIASSO MARCO 

## React Client Application Routes

- Route `/`: home page, it contains the button for creating a new game, another button that redirect to the infos of the game and two more buttons for handling login and registration (they becomes a logout button if the user is logged in).
- Route `/info`: contains the instructions of the game and how the app works
- Route `/game`: main game page, there is a card with a meme and a caption, the user can navigate through the captions by means of the directionl buttons onto the card and choose the best fit description.
In this page the users have also the infos about remaining time and which round are they are playing.
At the end of the round appears a banner showing whether the user won and if not it shows the two right captions.
- Route `/gameover`: page that shows the final score obtained by the user and the right guessed captions with the meme image associated. It is called when the user closes the banner of the last round.
From here the user can start a new game.
- Route `/login`: contains the login form, from this page the user can login and get redirected to the homepage.
- Route `/register`: contains the registration form, if every parameter is set correctly the user get registrated, logged in and redirected to the homepage.
- Route `/profile`: contains the user infos (email and username). From here the user can navigate to its leaderboard or get logged out.
- Route `/leaderboard`: contains the log of every game that the user played, with the meme images and the points obtained for each image.
There is also a field for the total amount of point obtained across every game.
- Route `*`: it's a default page for every route that is not specified above, it shows a default image and gives the possibility to go to the homepage.


## Main React Components

- `LoginForm` in (`Auth.jsx`)
  - `Purpose`: handling user authentication by means of a form. If the credentials are wrong displays an error message by means of an Alert.
  - `Main functionality`: handles the form and navigate to the homepage if the credentials match.
- `RegisterForm` in (`Auth.jsx`)
  - `Purpose`: handling the registration of a new user by means of a form. If something goes wrong (such as wrong confirm password) an error message is displayed by means of an Alert.
  - `Main functionality`: handles the form and navigate to the homepage if everything goes smoothly.
- `Game` in (`Game.jsx`)
  - `Purpose`: providing the whole gameplay experience, it is designed as a playing card, with a meme and a possible caption below. The user can navigate through the captions with the arrow buttons.
  At the endo of every round a banner appears in a higher layer than the card showing the recap of the round and a suitable message.
  - `Main functionality`: fetching the new game, handling the timer and its animation, handling the rounds and the score obtained by the user. At the end of the third round loads the game into the db.
- `GameOver` in (`Game.jsx`)
  - `Purpose`: show the recap of the game, providing the memes images and the captions chose by the user (only for the guessed memes and for logged in user).
  From this component you can start a new game.
  - `Main functionality`: displays the round played, with info for each round and points. Offers the possibility to start a new game.
- `LeaderboardLayout` in (`PageLayout.jsx`)
  - `Purpose`: designed to display a user's game history, including details about each game and round. Provides the user total score.
  - `Main functionality`: displays every game as a card and every round as a card into it. For every round in which the user obtains more than zero points the card is coloured in green, red elsewere.
- `ProfileLayout` in (`PageLayout.jsx`)
  - `Purpose`: show the infos of the user, username and mail.
  - `Main functionality`: navigating to the personal Leaderboard.
- `HomeLayout` in (`PageLayout.jsx`)
  - `Purpose`: it is the first thing that a user sees, provides all the main functionality of the app, starting a new game, log in, registering, log out and learning about the game rules.
  - `Main functionality`: navigating through the app with the buttons.
- `InfosLayout` in (`PageLayout.jsx`)
  - `Purpose`: teaching the user the basic functionalities of the website and the rules of the game.
- `NotFoundLayout` in (`PageLayout.jsx`)
  - `Purpose`: creating a fun enviroment for the users who get lost and offering them the possibility to be redirected to the homepage.
  - `Main functionality`: navigating to the homepage.


(only _main_ components, minor ones may be skipped)


## API Server

- POST `/api/sessions`: perform login
  - receives: user
  - response body content: user if he get authenticated
  - response status codes and possible errors:
    - 401 if user not found
    - 202 if login is performed
    - 500 server error

- GET `/api/sessions/current`: check if the user is logged in or not
  - request parameters: user
  - response body content: user if he is authenticated
  - response status codes and possible errors:
    - 401 not authenticated users 

- DELETE `/api/session/current`: performs the logout of an user
  - request parameters: user

- POST `/api/users`: registers a new user
  - receives: username, email password and confirmed password
  - returns: user object or error
  - response status codes and possible errors:
    - 201 if the user is created
    - 422 if the username is already taken
    - 422 if the passwords don't match
    - 500 server error

- GET `/api/newGame`: creates a new match
  - request parameters: user
  - response body content: a Game object
  - response status codes and possible errors:
    - 201 if the game is created
    - 500 if the server fails

- POST `/api/best`: check if an answer is among the best fit for a meme
  - receives: a meme id and an answer id
  - returns: boolean
  - response status codes and possible errors:
    - 200 if everything goes smoothly
    - 500 if the server fails

- GET `/api/best/:id`: returns the id of every best caption for the meme id passed as param
  - request parameters: meme id
  - response body content: array of answer id
  - response status codes and possible errors:
    - 200 if everything goes smoothly
    - 500 if the server fails

- POST `/api/history`: retrieving the data of every match that teh user played
  - receives: user
  - response body content: array of games, each of them composed of three rounds.
  - response status codes and possible errors:
    - 201 if succesfully
    - 500 if error

- POST `/api/games`: storing a new game just finished
  - receives: user and game infos (rounds, points, memes)
  - response body content: boolean
  - response status codes and possible errors:
    - 202 if the game is inserted into the table
    - 500 if an error occurs

- GET `/api/phrases/:type`: retrieving a fun phrase to show at the end of each round
  - request parameters: type of phrase (if a winning one or not)
  - response body content: the phrase
  - response status codes and possible errors:
    - 201 if the phrase is fetched succesfully
    - 500 if the server fails


## Database Tables

- Table `users` - contains all the infos about the users, username, mail and hashed password and its key.
- Table `answers` - contains all the possible answers.
- Table `best-answers` - it's a pivot table which binds the answer id and the meme id. These are the best captions.
- Table `memes` - contains all the names of the memes.
- Table `games` - contains the log of each match that has been played. There is a field for the id of the user, one for the id and the url of a meme (the id is kept for sake of clarity while reading the table) and the vote obtained by the user per round.
- Table `meme_phrases` contains the phrases shown on the banner at the ond of each round. It has a fiel phrase and one for the status (win or loss).


## Screenshots

![Screenshot1](https://github.com/polito-WA1-2024-exam/exam-1-Pios15/blob/main/img/Screenshot1.png)

![Screenshot2](https://github.com/polito-WA1-2024-exam/exam-1-criicky/blob/main/img/Screenshot2.png)


## Users Credentials

- username: test@gmail.com, password: test1234 (has a lot of games played)
- username: test2@yahoo.it, password: test1234 (has some games on it)
- username: snorlax@gmail.com, password: zzzzzzzz (has no games because it's asleep!)
