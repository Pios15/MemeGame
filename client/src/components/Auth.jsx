import { useState } from 'react';
import { Alert, Button, Col, Form, Row, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";


function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.login(credentials)
      .then ( () => navigate( "/" ) )
      .catch( (err) => {
        if(err.message === "Unauthorized")
          setErrorMessage("Invalid username and/or password");
        else
          setErrorMessage(err.message);
        setShow(true);
      });
  };

  return (
    <Row className="mt-3 vh-100 justify-content-md-center">
        <Col md={4}>
            <Card>
                <Card.Body>
                    <Card.Header className="mb-3">Login</Card.Header>
                    <Form onSubmit={handleSubmit}>
                        <Alert
                            dismissible
                            show={show}
                            onClose={() => setShow(false)}
                            variant="danger">
                            {errorMessage}
                        </Alert>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={username} placeholder="Example: count.dooku@gmail.com"
                                onChange={(ev) => setUsername(ev.target.value)}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password} placeholder="Enter the password."
                                onChange={(ev) => setPassword(ev.target.value)}
                                required={true}
                            />
                        </Form.Group>
                        <Button className='home-buttons mt-3' variant='outline-dark' type="submit">
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    </Row>
);
}

function RegisterForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, email, password, confirmPassword };

    props.register(credentials)
      .then ( () => navigate( "/" ) )
      .catch( (err) => {
        if(err.message === "Unauthorized")
          setErrorMessage("Invalid username and/or password");
        else
          setErrorMessage(err.message);
        setShow(true);
      });
  };

  return (
    <Row className="mt-3 vh-100 justify-content-md-center">
        <Col md={4}>
            <Card>
                <Card.Body>
                    <Card.Header className="mb-3" >Register</Card.Header>
                    <Form onSubmit={handleSubmit}>
                        <Alert
                            dismissible
                            show={show}
                            onClose={() => setShow(false)}
                            variant="danger">
                            {errorMessage}
                        </Alert>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username} placeholder="Example: Xx_DarkAngelCraft_xX"
                                onChange={(ev) => setUsername(ev.target.value)}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email} placeholder="Example: lightning.mcQueen@pixar.com"
                                onChange={(ev) => setEmail(ev.target.value)}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password} placeholder="Enter the password."
                                onChange={(ev) => setPassword(ev.target.value)}
                                required={true}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword} placeholder="Confirm your password."
                                onChange={(ev) => setConfirmPassword(ev.target.value)}
                                required={true}
                            />
                        </Form.Group>
                        <Button className='home-buttons mt-3' variant='outline-dark' type="submit">
                            Register
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    </Row>
);

}


LoginForm.propTypes = {
  login: PropTypes.func,
}

function LogoutButton(props) {
  return (
    <Button className='home-buttons' variant="outline-dark"  onClick={props.logout}>Logout</Button>
  )
}

LogoutButton.propTypes = {
  logout: PropTypes.func
}

function LoginButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outline-light" onClick={()=> navigate('/login')}>Login</Button>
  )
}

function RegisterButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outline-light" onClick={()=> navigate('/register')}>Register</Button>
  )
}





export { LoginForm, LogoutButton, LoginButton, RegisterForm, RegisterButton };
