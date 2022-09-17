import { Alert, Button } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Head from 'next/head';
import React from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import { auth, provider } from '../firebase';


const Login = () => {

    const [message, setMessage] = useState("");

    const onLogin = () => {
        signInWithPopup(auth, provider).
            then((result) => {

                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

            }).catch((error) => {

                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;

                setMessage(errorMessage);


                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);

            })
    }

    return (
        <Container>

            <Head>
                <title>Login</title>
            </Head>

            {
                message ?
                    <Alert severity="warning" sx={{
                        margin:2,
                  
                    }}>
                        {message}
                    </Alert>
                    : null
            }
            
            <LoginContainer>
                <Logo src='/assets/img/whatsapp-logo.png' />

                <Button variant='outlined' onClick={onLogin} >
                    Login with Google
                </Button>
            </LoginContainer>
        </Container>
    )
}

export default Login;

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 100px;
    border-radius: 5px;
    box-shadow: 0px 4px 40px -5px rgba(0,0,0,0.4);
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;


`;