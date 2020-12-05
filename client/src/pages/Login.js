import React from 'react';
import Login from '../components/Login/index';
import { Container, Card, CardBody } from 'reactstrap';
import '../../src/Forms.css'

const LoginPage = () => {
    return(
    <Container className="form-container">
        <div>
        <Card>
        <CardBody className="login-card">
          <Login />
        </CardBody>
      </Card>  
        </div> 
    </Container>
    )};

export default LoginPage;