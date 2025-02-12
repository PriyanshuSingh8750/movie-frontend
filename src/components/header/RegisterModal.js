import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterModal = ({ show, handleClose }) => {
  const [registerDetails, setRegisterDetails] = useState({
    userId: "",
    password: "",
    email: "",
  });

  const handleRegister = async () => {
    try {
      const response = await axios.post("https://enthusiastic-encouragement-production.up.railway.app/api/v1/auth/register", {
        userId: registerDetails.userId,
        password: registerDetails.password, // Send plaintext password
        email: registerDetails.email,
      });

      toast.success("✅ User registered successfully!");
      handleClose();
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter user ID"
              value={registerDetails.userId}
              onChange={(e) => setRegisterDetails({ ...registerDetails, userId: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={registerDetails.password}
              onChange={(e) => setRegisterDetails({ ...registerDetails, password: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={registerDetails.email}
              onChange={(e) => setRegisterDetails({ ...registerDetails, email: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleRegister}>
            Register
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;