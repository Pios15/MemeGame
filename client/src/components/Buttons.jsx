import { Button, Col, Row } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


//home Button
function HomeButton() {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
  
    return (
      <Row>
        <Col>
          <Button 
            className="homeButton" 
            variant="light" 
            onClick={() => navigate("/")} 
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          > 
            <i className={`bi ${hover ? 'bi-house-fill' : 'bi-house'}`}></i>
          </Button>
        </Col>
      </Row>
    )
  }
  
//profile Button
function ProfileButton() {
    const navigate = useNavigate();
    return (
      <Row>
        <Col>
          <Button className="circular-button" variant="outline-light" onClick={() => navigate("/profile")}> 
                 <i className="bi bi-person "></i>
          </Button>
        </Col>
      </Row>
    )
  }



//leaderboard Button
function LeaderboardButton() {
    const navigate = useNavigate();
    return (
      <Row>
        <Col>
          <Button className="circular-button2" variant="outline-dark" onClick={() => navigate("/leaderboard")}> 
                 <i className="bi bi-trophy "></i>
          </Button>
        </Col>
      </Row>
    )
}

function LoginButton() {
  const navigate = useNavigate();
  return (
    <Button className='home-buttons' variant="outline-dark" onClick={()=> navigate('/login')}>Login</Button>
  )
}
  
function RegisterButton() {
  const navigate = useNavigate();
  return (
    <Button className='home-buttons' variant="outline-dark" onClick={()=> navigate('/register')}>Register</Button>
  )
}

function NewGameButton() {
  const navigate = useNavigate();
  return(
    <Button className='play-button' onClick={()=> navigate('/game')}>New game</Button>
  )
}

export { HomeButton, ProfileButton, LeaderboardButton, LoginButton, RegisterButton, NewGameButton };