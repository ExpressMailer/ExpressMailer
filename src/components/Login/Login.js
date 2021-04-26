import React from 'react';
import styles from "./Login.module.css";
import { Button } from '@material-ui/core';
import { auth, db, provider } from '../../firebase';
import { login } from '../../features/userSlice';
import { useDispatch } from 'react-redux';
import logo from '../Header/email.png'
function Login() {
    const dispatch = useDispatch()

    const saveUserToDb = async (user) => {
        const snapshot = await db.collection('users').where('email','==',user.email).get()
        if (snapshot.empty) {
            await db.collection('users').add({
                displayName: user.displayName,
                email: user.email,
                photoUrl: user.photoURL,
                recentlychatedwith: []
            })
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
                    src={logo}
                    alt=""
                />
                <Button name="btnLogin" variant="contained" color="primary" onClick={signIn}>
                    Login</Button>
            </div>
        </div>
        
    );
}

export default Login


