import React from 'react';
import GoogleLogin from 'react-google-login';

export default () => {
    const login = async (code) => {
        return fetch('http://localhost:3005/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        }).then((res) => {
            return res.json();
        });
    }

    const responseGoogle = async (authResult) => {
        console.log('AUTH RESULT', authResult);
        if (authResult['code']) {
            const result = await login(authResult['code'])
            console.log('RESULT', result);
        }
    };

    return (
        <div className="login-page">
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login with google"
                responseType="code"
                /**
                 * To get access_token and refresh_token in server side,
                 * the data for redirect_uri should be postmessage.
                 * postmessage is magic value for redirect_uri to get credentials without actual redirect uri.
                 */
                redirectUri="postmessage"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                scope="profile email"
            />
        </div>
    );
};
