import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Col, Row, Button, Card } from "react-bootstrap";
import { LogoutButton } from './Auth';
import { LeaderboardButton, RegisterButton, LoginButton, NewGameButton } from './Buttons';

import API from '../API.js';



//layout of the homepage, possibility of a new game or login
export function HomeLayout(props) {
    const navigate = useNavigate();
    return (
        <Row className="justify-content-md-center  align-items-center " style={{ height: '75vh'}}>
        <Col md={4}>
        <Card className=" text-center ">
            <Card.Header className="card-header">What do you meme?</Card.Header>
            <Card.Body>
                <Col>
                <NewGameButton/>
                <Button className="home-buttons button-size mt-3 mb-2" variant="outline-dark"  onClick={() => navigate("/info")}>What game?</Button>
                {props.loggedIn ? (
                <LogoutButton logout={props.logout} />
                ) : (
                <Row className="align-items-center">
                    <Col><RegisterButton /></Col>
                    <Col><LoginButton /></Col>
                </Row>
                )}
                </Col>
            </Card.Body>
            <Card.Footer className="text-muted">Have fun!</Card.Footer>
        </Card>
        </Col>
        </Row>
    );
}

//layout of the infos page
export function InfosLayout() {
    const navigate = useNavigate();
    return (
        <Row className="justify-content-md-center">
            <Col md={4}>
                <Card className="mb-3 mt-3">
                <Button variant="banner-button" style={{ position: 'absolute', top: 5, right: 5 }} onClick={() => navigate("/")}>
                        <i className="bi bi-x-lg"></i>
                    </Button>
                    <Card.Header>Infos</Card.Header>
                    <Card.Body>
                        <Card.Title>Welcome to "What Do You Meme?" 🎉</Card.Title>
                            <ul>Ready to test your meme knowledge and have some fun? Here's how to play:</ul>
                            
                            <h5>Game Rules 📜</h5>
                            <ul>
                                <li><strong>Rounds:</strong></li>
                                <ul>
                                <li>If you're logged in, you get to play three rounds! 😎</li>
                                <li>If you're not logged in, you get to play one round. But trust us, it's worth logging in! 🚪</li>
                                </ul>
                                <li><strong>Objective:</strong></li>
                                <ul>
                                    <li>Each round presents you with a meme and seven captions.</li>
                                    <li>Out of the seven captions, two are the best fit for the meme. 🕵️‍♂️</li>
                                    <li>You have 30 seconds to choose the best caption. ⏳</li>
                                    <li>Navigate through the captions with the arrows and try your senses!</li>
                                    <li>If you guess correctly, you earn 5 points! 🎯</li>
                                    <li>If you guess incorrectly, you earn 0 points. Better luck next time! 💔</li>
                                </ul>
                                <li><strong>Scoring:</strong></li>
                                <ul>
                                <li>Each correct meme earns you 5 points. Accumulate points to prove you're a meme master! 🏆</li>
                                </ul>
                            </ul>

                            <h5>Why Log In? 🔐</h5>
                            <ul>
                                <li><strong>Game History:</strong> When you log in, we keep track of your game history. 📈</li>
                                <li><strong>Progress Tracking:</strong> See how you've improved over time and strive to become the ultimate meme connoisseur! 🚀</li>
                            </ul>

                            <ul>So, what are you waiting for? Dive into the world of memes, have fun, and may the best meme win! 🌐💪</ul>
                    </Card.Body>
                    <Card.Footer className="text-muted text-center">You lost The Game!</Card.Footer>
                </Card>
            </Col>
        </Row>
    );
}




                            

//layout of the profile page
export function ProfileLayout(props) {
    return (
        <Row className="profileBackground justify-content-md-center">
            <Col className="mt-3" md={4}>
                <Card >
                    <Card.Body>
                        <Card.Header>
                            <Row className="justify-content-between align-items-center">
                                <Col xs="auto">Profile</Col>
                                <Col xs="auto"><LeaderboardButton /></Col>
                            </Row>
                        </Card.Header>
                            <p className="mt-3">Username: {props.user.username}</p>
                            <p>Email: {props.user.email}</p>
                        
                        <LogoutButton logout={props.logout} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

//layout of the leaderboard page, all the games played by the user are shown with the total score
export function LeaderboardLayout({ user }) {
    const [games, setGames] = useState([]);

    useEffect(() => {
        API.getGames(user).then(games => {
            setGames(games);
        });
    }, []);

    return (
        <Row className="scoreboardBackground justify-content-md-center">
            <Col className="mt-3 mb-3" md={5}>
                <Card>
                    <Card.Header>
                        <Row className="justify-content-between align-items-center">
                            <Col xs="auto">Leaderboard</Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>
                            <Row className="justify-content-between align-items-center">
                                <Col xs="auto">{user.username}</Col>
                                <Col xs="auto">Total Score: {games.reduce((a, b) => a + (b['vote_1'] || 0) +  (b['vote_2'] || 0) +  (b['vote_3'] || 0), 0)}</Col>
                            </Row>
                        </Card.Title>
                        {games.map((game, index) => (
                        <Card key={game.id} className="mb-3 border-secondary" md={3}>
                            <Card.Header>Game {index+1}</Card.Header>
                            <Card.Body>
                                {[game.meme_id_1, game.meme_id_2, game.meme_id_3].map((meme, index) => (
                                    <Card key={index} className="mb-3" style={{backgroundColor: game[`vote_${index + 1}`] === 5 ? 'green' : 'red'}}>
                                        <Card.Img variant="top" src={`/Memes/${meme}.jpeg`} alt={`meme ${index + 1}`} />
                                        <Card.Body>
                                            <Card.Text>Vote: {game[`vote_${index + 1}`]}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Card.Body>
                        </Card>
                    ))}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}






 


export function NotFoundLayout() {
    const navigate = useNavigate();
    return (
        <Row className="justify-content-md-center">
            <Col className="mt-3 mb-3" md={5}>
                <Card className="text-center">
                    <Card.Header>Error: page not found!</Card.Header>
                    <Card.Body>
                        <Card.Img variant="top" src="/GitHub404.png" alt="page not found" className="my-3" />
                        <Card.Text>
                            The page you're looking for doesn't exist.
                        </Card.Text>
                        <Button className="home-buttons" variant='outline-dark' onClick={() => navigate("/")}>Go Home!</Button>
                    </Card.Body>
                </Card>
        </Col>
      </Row>
    );
}


