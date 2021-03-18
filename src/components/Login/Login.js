import React from 'react';
import styles from "./Login.module.css";
import { Button } from '@material-ui/core';
import { auth, db, provider } from '../../firebase';
import { login } from '../../features/userSlice';
import { useDispatch } from 'react-redux';

function Login() {
    const dispatch = useDispatch()

    const saveUserToDb = (user) => {
        // db.collection('users').where('email','==',user.email)
        //     if(!snapshot.exists){
        //         db.collection('users').add({
        //             displayName: user.displayName,
        //             email: user.email,
        //             photoUrl: user.photoURL
        //         })
        //     }
    }

    const signIn = () => {
        auth.signInWithPopup(provider)
            .then(({user}) => {
                saveUserToDb(user)
                dispatch(
                    login({
                        displayName: user.displayName,
                        email: user.email,
                        photoUrl: user.photoURL
                    })
                );
            })
            .catch((error) => alert(error.message));
    }; 

    return (
        <div className={styles.login}>
            <div className={styles.login__container}>
                <img 
                    src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png"
                    alt=""
                />
                <Button variant="contained" color="primary" onClick={signIn}>
                    Login</Button>
            </div>
        </div>
        
    );
}

export default Login


