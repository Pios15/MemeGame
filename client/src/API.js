
const SERVER_URL = 'http://localhost:3001/api';

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
    return await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',  // this parameter specifies that authentication cookie must be forwared. It is included in all the authenticated APIs.
        body: JSON.stringify(credentials),
    }).then(handleInvalidResponse)
    .then(response => response.json());
};
  
/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
    return await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include'
    }).then(handleInvalidResponse)
    .then(response => response.json());
};
  
  /**
   * This function destroy the current user's session (executing the log-out).
   */
const logOut = async() => {
return await fetch(SERVER_URL + '/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
}).then(handleInvalidResponse);
}

//this function is used for registering a new user
const registerUser = async (user) => {
    return await fetch(SERVER_URL + '/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user)
    }).then(handleInvalidResponse)
    .then(response => response.json());
};

//this function check if the answer is one of the best
const isBest = async (answer, meme) => {
    return await fetch(SERVER_URL + '/best', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({answer: answer, meme: meme})
    }).then(handleInvalidResponse)
    .then(response => response.json());
};


//this function is used for starting a new game
const newGame = async () => {
    return await fetch(SERVER_URL + '/newGame', {
        credentials: 'include'
    }).then(handleInvalidResponse)
    .then(response => response.json());
};

//this function is used for register a new game in the db
const registerGame = async (game, user) => {
    return await fetch(SERVER_URL + '/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ game: game, user: user })
    }).then(handleInvalidResponse);
};

//this function is used for getting all the games played by the user
const getGames = async (user) => {
    return await fetch(SERVER_URL + '/history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ user: user })
    }).then(handleInvalidResponse)
    .then(response => response.json());
};

//this function gets the best answers for a meme
const errorCheck = async (meme) => {
    return await fetch(SERVER_URL + '/best/' +meme.id)
    .then(handleInvalidResponse)
    .then(response => response.json());
}


//this function returns a random phrase of the specified type
const getPhrase = async (type) => {
    return await fetch(SERVER_URL + '/phrases/' + type).then(handleInvalidResponse)
    .then(response => response.json());
};


function handleInvalidResponse(response) {
    if (!response.ok) { throw Error(response.statusText) }
    let type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1){
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}



const API = {logIn, getUserInfo, logOut, newGame, registerGame, getGames, registerUser, isBest, getPhrase, errorCheck};
export default API;
