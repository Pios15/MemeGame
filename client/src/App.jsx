import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { useEffect, useState } from 'react';
import { Container, Toast, ToastBody } from 'react-bootstrap/';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import Header from "./components/Header.jsx";
import { Game, Gameover } from './components/Game.jsx';
import { HomeLayout, NotFoundLayout, ProfileLayout, LeaderboardLayout, InfosLayout } from './components/PageLayout.jsx';
import { LoginForm, RegisterForm } from './components/Auth.jsx';
import FeedbackContext from "./contexts/FeedbackContext.js";
import API from "./API.js";

function App() {

    const navigate = useNavigate();



    // This state is used to store the feedback message to be shown in the toast
    const [feedback, setFeedback] = useState('');

    const setFeedbackFromError = (err) => {
        let message = '';
        if (err.message) message = err.message;
        else message = "Unknown Error";
        setFeedback(message); // Assuming only one error message at a time
    };


    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Checking if the user is already logged-in
        // This useEffect is called only the first time the component is mounted (i.e., when the page is (re)loaded.)
        API.getUserInfo()
            .then(user => {
                setLoggedIn(true);
                setUser(user);  // here you have the user info, if already logged in
            }).catch(e => {
                if(loggedIn)    // printing error only if the state is inconsistent (i.e., the app was configured to be logged-in)
                    setFeedbackFromError(e);
                setLoggedIn(false); setUser(null);
            }); 
    }, []);

    /**
     * This function handles the login process.
     * It requires a username and a password inside a "credentials" object.
     */
    const handleLogin = async (credentials) => {
        const user = await API.logIn(credentials);
        setUser(user); setLoggedIn(true);
        setFeedback("Welcome, "+user.username);
    };
    

    //this function handles the registration process
    const handleRegister = async (credentials) => {
        const user = await API.registerUser(credentials);
        const newCredentials = {username: credentials.email, password: credentials.password};
        const logUser = await API.logIn(newCredentials);
        setUser(logUser); setLoggedIn(true);
        setFeedback("User registered successfully! Welcome, "+user.username+"!");
    }

    /**
     * This function handles the logout process.
     */ 
    const handleLogout = async () => {
        await API.logOut();
        navigate('/')
        // clean up everything
        setLoggedIn(false); setUser(null);
    };


    


    return (
        <FeedbackContext.Provider value={{setFeedback, setFeedbackFromError}}>
            <div className="min-vh-100 d-flex homeBackground flex-column">
                <Header logout={handleLogout} user={user} loggedIn={loggedIn} />
                <Container fluid className="flex-grow-1 d-flex flex-column">
                    <Routes>
                        <Route path="/info" element={<InfosLayout />} />
                        <Route path="/" element={<HomeLayout logout={handleLogout} user={user} loggedIn={loggedIn}/>} />
                        <Route path="/game" element={<Game user={user} />} />
                        <Route path="*" element={<NotFoundLayout />} />
                        <Route path="/register" element={ /* If the user is ALREADY logged-in, redirect to root */
                            loggedIn ? <Navigate replace to='/' />
                            : <RegisterForm register={handleRegister} />
                        } />
                        <Route path="/login" element={ /* If the user is ALREADY logged-in, redirect to root */
                            loggedIn ? <Navigate replace to='/' />
                            : <LoginForm login={handleLogin} />
                        } />
                        <Route path="/profile" element={
                            loggedIn ? <ProfileLayout logout={handleLogout} user={user} loggedIn={loggedIn}/>
                            :  <Navigate replace to='/' />
                        } />
                        <Route path="/logout" element={ /* If the user is NOT logged-in, redirect to root */
                            loggedIn ? <Navigate replace to='/' />
                            : <Navigate replace to='/login' />
                        } />
                        <Route path="/leaderboard" element={ /* If the user is NOT logged-in, redirect to root */
                            loggedIn ? <LeaderboardLayout user={user}/>
                            : <Navigate replace to='/login' /> 
                        } />
                        <Route path="/gameover" element={<Gameover />} />
                    </Routes>
                    <Toast
                        show={feedback !== ''}
                        autohide
                        onClose={() => setFeedback('')}
                        delay={4000}
                        position="top-end"
                        className="position-fixed end-0 m-3"
                    >
                        <ToastBody>
                            {feedback}
                        </ToastBody>
                    </Toast>
                </Container>
            </div>
        </FeedbackContext.Provider>
    );
}

export default App;
