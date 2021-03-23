import React from 'react';
import styles from "./Login.module.css";
import { Button } from '@material-ui/core';
import { auth, db, provider } from '../../firebase';
import { login } from '../../features/userSlice';
import { useDispatch } from 'react-redux';

function Login() {
    const dispatch = useDispatch()

    const saveUserToDb = async (user) => {
        console.log('saveUserToDb called')
        const snapshot = await db.collection('users').where('email','==',user.email).get()
        if (snapshot.empty) {
            console.log('No matching documents.');
            console.log('before user saved to db')
            await db.collection('users').add({
                displayName: user.displayName,
                email: user.email,
                photoUrl: user.photoURL
            })
            console.log('user saved to db')
            return;
        } 
    }

    const signIn = () => {
        auth.signInWithPopup(provider)
            .then( async ({user}) => {
                await saveUserToDb(user)
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


