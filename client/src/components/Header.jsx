import PropTypes from "prop-types";
import { Button, Col, Container, Row } from "react-bootstrap/";
import { LoginButton, RegisterButton } from './Auth';
import { ProfileButton, HomeButton } from './Buttons';


function Header(props) {
    return <header className="py-1 py-md-3 border-bottom header">
        <Container fluid className="gap-3 align-items-center">
            <Row>
                <Col xs={3} className="d-md-none">
                    <Button
                        onClick={() => props.setIsSidebarExpanded(p => !p)}
                        aria-expanded={props.isSidebarExpanded}
                    >
                        <i className="bi bi-list"/>
                    </Button>
                </Col>
                <Col xs={4} md={4}>
                    <a 
                       className="d-flex align-items-center justify-content-center justify-content-md-start h-100 link-light text-decoration-none">
                        <HomeButton />
                        <span className="h5 mb-0">What do you meme?</span>
                    </a>
                </Col>
                <Col xs={5} md={8} className="d-flex align-items-center justify-content-end">
                    <span className="ml-md-auto">
                        { props.loggedIn ? <ProfileButton/> : <Row><Col><RegisterButton/></Col><Col><LoginButton /></Col></Row>}
                    </span>
                </Col>
            </Row>
        </Container>
    </header>;
}

Header.propTypes = {
    isSidebarExpanded: PropTypes.bool,
    setIsSidebarExpanded: PropTypes.func,
    logout: PropTypes.func,
    user: PropTypes.object,
    loggedIn: PropTypes.bool
}

export default Header;
