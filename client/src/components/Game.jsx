import { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row, Card, ListGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../API.js";


//This function loads the rounds of the game and updates the score
function Game({ user }) {
    const [image, setImage] = useState(null);
    const [rounds, setRounds] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const [descriptions, setDescriptions] = useState([]);
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [points, setPoints] = useState([]);
    const [seconds, setSeconds] = useState(30);
    const [showBanner, setShowBanner] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const [phrase, setPhrase] = useState('');
    const [correctAns, setCorrectAns] = useState([]);
    const [timerExpired, setTimerExpired] = useState(false);




    const fetchRound = () => {
        API.newGame()
            .then((data) => {
                if(data.meme !== undefined) {
                    console.log(data.meme);
                    setRounds(data);
                    setImage(data.meme);
                    setDescriptions(data.answers);
                } else {
                    setRounds(data);
                    setImage(data[0].meme);
                    setDescriptions(data[0].answers);
                    }
            })
            .catch((err) => {
                setErrorMessage(err.message);
                setShow(true);
            });
    };

    const submitAnswer = (description, image) => {
        API.isBest(description, image)
        .then((res) => {
            if(res) {
                setScore((score) => (score + 5));
                setPoints((points) => [...points, {meme: image, answer: description, points: 5}]);
            } else {
                setPoints((points) => [...points, {meme: image, answer: description, points: 0}]);
                API.errorCheck(image)
                .then((ans) => {
                    ans.forEach((ansIndex) => {
                        for(let i = 0; i < descriptions.length; i++) {
                            if(descriptions[i].id === ansIndex) {
                                setCorrectAns((correctAns) => [...correctAns, i]);
                            }
                        }
                    });
                })
                .catch((err) => {
                    setErrorMessage(err.message);
                    setShow(true);
                })
            }
            API.getPhrase(res ? 'win' : 'loss')
            .then((phrase) => {
                setPhrase(phrase);
                setShowBanner(true);  // Show the banner when the round ends
            }).catch((err) => {
                setErrorMessage(err.message);
                setShow(true);
            });
        }).catch((err) => {
            setErrorMessage(err.message);
            setShow(true);
        });
    }
    
    useEffect(() => {
        fetchRound()
    }, []);
    
    useEffect(() => {
        if (!showBanner && currentRound < rounds.length - 1) {
            setCurrentRound((current) => (current + 1));
            setImage(() => rounds[currentRound + 1].meme);
            setDescriptions(() => rounds[currentRound + 1].answers);
            setCurrentIndex(0);
            setAnimationKey((key) => key + 1); // Increment the animation key to restart the animation
            setCorrectAns([]);
            setTimerExpired(false);
        } else if (!showBanner && rounds.meme !== undefined) {
            navigate('/');
        } 
        if(showBanner && points.length === 3) {
            API.registerGame(points, user)
            .catch((err) => {
                setErrorMessage(err.message);
                setShow(true);
            })
        }
        if(!showBanner && points.length === 3) {
            navigate('/gameover', {state: {points: points}});
        }
    }, [showBanner]);
    


    useEffect(() => {
        if (seconds > 0 && showBanner === false) {
            const timerId = setTimeout(() => {
                setSeconds((seconds) => seconds - 1);
            }, 1000);
            return () => clearTimeout(timerId); // This will clear the timer if the component is unmounted
        } else if (showBanner === true) {
            setSeconds(30); // Reset the timer when the banner is closed
        } else {
            // Time's up! You can put your code here to handle what happens when the time is up
            setTimerExpired(true);
            API.errorCheck(image)
            .then((ans) => {
                ans.forEach((ansIndex) => {
                    for(let i = 0; i < descriptions.length; i++) {
                        if(descriptions[i].id === ansIndex) {
                            setCorrectAns((correctAns) => [...correctAns, i]);
                        }
                    }
                 });
            })
            .catch((err) => {
                setErrorMessage(err.message);
                setShow(true);
            })
            API.getPhrase('loss')
            .then((phrase) => {
                setPhrase(phrase);
                setPoints((points) => [...points, {meme: image, answer: descriptions[currentIndex], points: 0}]);
                setShowBanner(true);  // Show the banner when the round endsS
            }).catch((err) => {
                setErrorMessage(err.message);
                setShow(true);
            })
        }
    }, [seconds, showBanner]);
    
    

    return (
        <div style={{ position: 'relative' }}>
        {showBanner && (
            <Card className="mb-3 banner text-center">
                <Button variant="banner-button" style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => setShowBanner(false)}>
                    <i className="bi bi-x-lg"></i>
                </Button>
                <Row >
                    <Col>
                        <Card.Body>
                            <Card.Header className="mb-3">Round Ended!</Card.Header>
                            {points[currentRound].points > 0 ? (
                                <Row>
                                    <Col>
                                        <Card.Img variant="top" src={"/gifs/winGIF.gif"} alt='winGif'/>
                                    </Col>
                                    <Col>
                                    <Card.Text>
                                        Congratulations, five fresh points for you!
                                    </Card.Text>
                                    <Card.Text style={{fontStyle: 'italic', fontSize: '1.2em'}}>
                                         {phrase}
                                    </Card.Text>
                                    </Col>
                                </Row>
                            ) : (
                                <Row>
                                    <Col>
                                        <Card.Img variant="top" src={timerExpired ?
                                            "/gifs/timeLossGIF.gif"
                                            : "/gifs/lossGIF.gif"
                                            } />
                                    </Col>
                                    <Col>
                                        <Card.Text className="mb-3" style={{fontStyle: 'italic', fontSize: '1.2em'}}>
                                            {phrase}
                                        </Card.Text>
                                        {timerExpired ?
                                            <p>Tick-tock, the time is over, don't sleep! Check the answers below.</p>
                                            : <p>Wrong answer, try this next time!</p>
                                        }
                                        {correctAns.map((ansIndex) => (
                                            <Card key={ansIndex} className="mb-3" style={{backgroundColor: 'rgb(0, 255, 64)'}}>
                                                {descriptions[ansIndex].text}
                                            </Card>
                                        ))}
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        )}
        <Row className="gameBackground justify-content-md-center">
            <Col md={4}>
                <Card className="mt-3 mb-3">
                    <Card.Body >
                        <Card.Header className="round-title mb-3">Round {currentRound+1}</Card.Header>
                        <Card.Subtitle>
                            <Row className="justify-content-between align-items-center">
                                <Col xs='auto' className="mb-2 text-muted">Score: {score}</Col>
                                <Col className="timer" key={animationKey}><span className={showBanner ? 'paused' : ''}>00:{seconds < 10 ? `0${seconds}` : seconds}</span></Col>    
                            </Row>
                        </Card.Subtitle>
                            <Form>
                            <Alert
                                dismissible
                                show={show}
                                onClose={() => setShow(false)}
                                variant="danger">
                                {errorMessage}
                            </Alert>
                            <Card.Img className="mb-3" variant="top" src={image ? `/Memes/${image.url}.jpeg` : ''} />
                            <Col>
                                <Row className="mb-3">
                                <Col md={6}>
                                    <Button className="btn-card w-100" disabled={showBanner} onClick={() => {
                                        setCurrentIndex(currentIndex => currentIndex - 1 >= 0 ? currentIndex - 1 : descriptions.length - 1);
                                    }}>
                                        <i className="bi bi-arrow-left-circle-fill"></i>
                                    </Button>
                                </Col>
                                <Col md={6}>
                                    <Button className="btn-card w-100" disabled={showBanner} onClick={() => {
                                        setCurrentIndex(currentIndex => currentIndex + 1 < descriptions.length ? currentIndex + 1 : 0);
                                    }}>
                                        <i className="bi bi-arrow-right-circle-fill"></i>
                                    </Button>
                                </Col>
                                </Row>
                                
                                    <Button className="btn-description mb-3" disabled={showBanner} onClick={() => {
                                        submitAnswer(descriptions[currentIndex], image);
                                    }}>
                                        {descriptions[currentIndex] ? descriptions[currentIndex].text : ''}
                                    </Button>
                                
                            </Col>
                        </Form>
                        <Card.Footer className="d-flex justify-content-end">
                             {currentIndex + 1}/{descriptions.length}
                        </Card.Footer>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        </div>
    );
}


//layout of the end game page, the total score is shown with the correct couple of meme and descriptions and a button for a new game
function Gameover() {
    const navigate = useNavigate();
    const location = useLocation();
    const points = location.state ? location.state.points : [];
    return (
        <Row className="gameOverBackground justify-content-md-center">
            <Col className='mt-3 mb-3' md={4}>
                <Card>
                    <Card.Body>
                        <Col>
                        <Card.Title className="round-title">Game Over</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Total Score: {points.reduce((acc, point) => acc + point.points, 0)}</Card.Subtitle>
                        {points.some(point => point.points > 0)&& (
                            <ListGroup>
                                {points.filter(point => point.points > 0).map((point, index) => (
                                    <ListGroup.Item key={index}>
                                        <Card.Img src={`/Memes/${point.meme.url}.jpeg`} />
                                            {point.answer.text}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                        <Button className="home-buttons mt-3"  onClick={() => navigate("/game")} >New Game</Button>
                        </Col>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export { Game, Gameover };