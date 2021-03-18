import React from 'react';
import styles from './SendMail.module.css';
import CloseIcon from "@material-ui/icons/Close";
import { Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { closeSendMessage } from '../../features/mail';
import { auth, db } from '../../firebase';
import firebase from 'firebase'

function SendMail() {

    const { register, handleSubmit, watch, errors } = useForm();
    const dispatch = useDispatch()

    const generateKeywords = (formData) => {
        let searchableKeywords = [auth.currentUser.email,...formData.subject.split(' ')]
        let prev = ''
        for(var i=0;i<formData.subject.length;i++){
            prev = prev  + formData.subject.charAt(i)
            searchableKeywords.push(prev)
        }
        return searchableKeywords
    }
    
    
    const onSubmit = (formData) => {
        // check here if email exist (for now just setting it to true)
        const emailExists = true 
        console.log(generateKeywords(formData))
        if(emailExists){   
            db.collection('emails').add({
                to: formData.to,
                from: auth.currentUser.email,
                subject: formData.subject,
                message: formData.message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                searchableKeywords:generateKeywords(formData),
                read: false
            })
        }
        else{
            console.log(formData.to + " doesn't exist.")
        }
        dispatch(closeSendMessage())

    }

    return <div className={styles.sendMail}>
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
    </div>;
}

export default SendMail
