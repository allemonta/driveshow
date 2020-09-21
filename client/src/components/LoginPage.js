import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios'

import {
    Container, Typography, Button, Box, Paper
} from '@material-ui/core';

export default () => {
    const login = async (authResult) => {
        console.log(authResult.code)

        if (authResult.code) {
            axios.post('http://localhost:3005/api/auth/google', { 
                code: authResult.code 
            }, { 
                headers: { 
                    'Content-Type': 'application/json' 
                } 
            }).then(({ data }) => {
                if (data.error)
                    return console.log(data.error)

                localStorage.setItem('jwtToken', data.jwtToken)
                window.location = '/folders'
            })
        }
    }

    const responseGoogle = (authResult) => {
        console.log('FAILED', authResult)
    };

    return (
        <div className="login-page">
            <Paper mt={7} mb={7} elevation={15}
                style={{
                    width: '80%',
                    margin: 'auto',
                    marginTop: '55px',
                    padding: '20px',
                    paddingBottom: '40px',
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                <img
                    src="https://img.icons8.com/clouds/100/000000/lock--v1.png"
                    alt="lockIcon"
                    style={{
                        display: "block",
                        margin: "auto",
                        marginBottom: '30px',
                    }}
                />

                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Login with google"
                    responseType="code"
                    redirectUri="postmessage"
                    onSuccess={login}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    scope="profile email https://www.googleapis.com/auth/drive"
                />
            </Paper>
        </div>
    );
};
