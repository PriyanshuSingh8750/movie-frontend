import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { toast } from "react-toastify";

const Header = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("loggedInUser"));

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    toast.info("You have logged out.");
    window.location.href = "/"; // Redirect to home
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" style={{ color: "gold" }}>
          <FontAwesomeIcon icon={faVideoSlash} /> Gold
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/watchList">Watch List</NavLink>
          </Nav>
          {loggedInUser && loggedInUser !== "guest" ? (
            <>
              <span className="text-light me-3">Welcome, {loggedInUser}!</span>
              <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="outline-info" className="me-2" onClick={() => setShowLoginModal(true)}>Login</Button>
              <Button variant="outline-info" onClick={() => setShowRegisterModal(true)}>Register</Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>

      {/* Modals */}
      <RegisterModal show={showRegisterModal} handleClose={() => setShowRegisterModal(false)} />
      <LoginModal show={showLoginModal} handleClose={() => setShowLoginModal(false)} setLoggedInUser={setLoggedInUser} />
    </Navbar>
  );
};

export default Header;
