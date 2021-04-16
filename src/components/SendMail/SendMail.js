import React, { useState, useEffect } from 'react';
import styles from './SendMail.module.css';
import CloseIcon from "@material-ui/icons/Close";
import { Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { closeSendMessage } from '../../features/mail';
import { auth, db } from '../../firebase';
import firebase from 'firebase'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { decrypt,encrypt } from '../../utilities/crypt'
import { generateRoomName } from '../../utilities/common';
import EmailRow from '../EmailRow/EmailRow'

var starred= EmailRow.starred

function SendMail() {

    const { register, handleSubmit, watch, errors } = useForm();
    const dispatch = useDispatch()

    const notify = (msg) => toast(msg);

    const [spam, setSpam] = useState(0);

    useEffect(() => {
        fetch('/predict').then(res => res.json()).then(data => {
        setSpam(data.spam);
        console.log(data.spam)
        });
    }, []);

    const generateKeywords = (formData) => {
        let searchableKeywords = [auth.currentUser.email,...formData.subject.split(' ')]
        let prev = ''
        for(var i=0;i<formData.subject.length;i++){
            prev = prev  + formData.subject.charAt(i)
            searchableKeywords.push(prev)
        }
        return searchableKeywords
    }
    
    const checkIfEmailExists = async (email) => {
        const snapshot = await db.collection('users').where('email','==',email).limit(1).get()
        console.log(snapshot.empty)
        if(snapshot.empty){
            return false
        }
        return true
    }
    
    const onSubmit = async (formData) => {
        // check here if email exist (for now just setting it to true)
        const emailExists = await checkIfEmailExists(formData.to) 
        console.log(generateKeywords(formData))

   

        if(emailExists){   
            db.collection('emails').add({
                to: formData.to,
                from: auth.currentUser.email,
                subject:  encrypt(formData.subject, generateRoomName(auth.currentUser.email,formData.to)),
                message: encrypt(formData.message, generateRoomName(auth.currentUser.email,formData.to)),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                searchableKeywords: generateKeywords(formData),
                read: false,
                starred: false,
                important: false,
                spam: spam
            })
            toast.success("Mail sent successfully.")
            dispatch(closeSendMessage())
        }
        else{
            console.log(formData.to + " doesn't exist.")
            // toast.error(formData.to + " doesn't exist.")
            toast.success("Mail sent successfully.")
        }

    }
    
    return <>
    <ToastContainer />
        <div className={styles.sendMail}>
            
            <div className={styles.sendMail__header}>
                <h3>New Message</h3>
                <CloseIcon 
                    className={styles.sendMail__close} 
                    onClick={() => dispatch(closeSendMessage())}
                />
            </div>
        
            <form onSubmit={handleSubmit(onSubmit)}>
                <input 
                    name="to"
                    placeholder="To"
                    type="text" 
                    type="email"
                    ref={register({ required: true })} 
                />
                {errors.to && <p className={styles.sendMail__error}>To is required</p>}
                <input
                    name="subject"
                    placeholder="Subject"
                    type="text"
                    ref={register({ required: true })} 
                />
                {errors.to && <p className={styles.sendMail__error}>Subject is required</p>}

            <input
                    name="message"
                    placeholder="Message..."
                    type="text" 
                    className={styles.sendMail__message}
                    ref={register({ required: true })} 
                />
                {errors.to && <p className={styles.sendMail__error}>Message is required</p>}

                <div className={styles.sendMail__options}>
                    <Button 
                        classNmae="sendMail__send"
                        variant="contained"
                        color="primary"
                        type="submit"
                    >Send</Button>
                </div>
            </form> 
        </div>
    </>
}

export default SendMail
