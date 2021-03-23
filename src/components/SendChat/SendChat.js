import React, { useEffect, useState } from 'react';
import styles from './SendChat.module.css';
import CloseIcon from "@material-ui/icons/Close";
import { Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { closeSendChat, selectSendChatRecipientmail } from '../../features/chat';
import { auth, db } from '../../firebase';
import firebase from 'firebase'
import AllChats from '../Chat/AllChats'

function SendChat() {

    const recipient_mail = useSelector(selectSendChatRecipientmail);
    const { register, handleSubmit, watch, errors } = useForm();
    const dispatch = useDispatch();
    console.log(recipient_mail);

    // check which is lexicographically bigger and set docNAme accordingly
    var docName;
    if(auth.currentUser.email < recipient_mail)
        {
            docName = auth.currentUser.email + '-' + recipient_mail;
        }
    else
        {
            docName = recipient_mail + '-' + auth.currentUser.email;
        }
    
    const onSubmit = (formData) => {
        // need to check if email exists
        const echatExists = true 
        // adding chat message details to document of subcollection
        if(echatExists){
            db.collection('echats')
            .doc(docName)
            .collection('chats').add({
                to: recipient_mail,
                from: auth.currentUser.email,
                message: formData.message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })

        // checking no of documents in recently chatted person's collection
            var allrecent;
            db.collection('last5chatpersons').get()
            .then(snapshot => {
                if(snapshot.size >=5){
                    console.log(snapshot.size);
                    // if size is greater then 5 delete the oldest person from list
                    console.log("more than 5 he bhaiii");

                    // allrecent = db.collection('last5chatpersons').orderBy('timestamp');
                    // console.log('allrecent' + allrecent);
                    // allrecent.get().then(function(querySnapshot) {
                    // querySnapshot.forEach(function(doc) {
                    //     doc[0].ref.delete();
                    // });
                    // });
                }
            });

            
            // add/modify the current chart person in last5chatperson 
            db.collection('last5chatpersons').doc('asdaf-adasd')
            .add({
                person: recipient_mail,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }
        else{
            console.log(formData.to + " doesn't exist.")
        }
        dispatch(closeSendChat())
    }

    const [chats,setChats] = useState([])

    useEffect(() => {
        db.collection('echats')
        .doc(docName)
        .collection('chats')
        .orderBy('timestamp').onSnapshot(snapshot => {
            setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    },[])

    return <div className={styles.sendChat}>
        <div className={styles.sendChat__header}>
            <h3>{recipient_mail}</h3>
            <CloseIcon 
                className={styles.sendChat__close} 
                onClick={() => dispatch(closeSendChat())}
            />
        </div>
        <div>
                {chats.map(({id,data:{from,message,timestamp,to}}) => {
                    return <AllChats
                        id={id}
                        key={id}
                        title={from}
                        chatmsg={message}
                        time={new Date(timestamp?.seconds*1000).toUTCString()}
                    />
                })}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
           <input
                name="message"
                placeholder="Message..."
                type="text" 
                className={styles.sendChat__message}
                ref={register({ required: true })} 
            />
            {errors.to && <p className={styles.sendChat__error}>Message is required</p>}

            <div className={styles.sendChat__options}>
                <Button 
                    className="sendChat__send"
                    variant="contained"
                    color="primary"
                    type="submit"
                >Send</Button>
            </div>
        </form> 
    </div>;
}

export default SendChat
