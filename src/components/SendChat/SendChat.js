import React, { useEffect, useState } from 'react';
import styles from './SendChat.module.css';
import CloseIcon from "@material-ui/icons/Close";
import { Button, Grid, IconButton } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { closeSendChat, selectSendChatRecipientmail } from '../../features/chat';
import { auth, db } from '../../firebase';
import firebase from 'firebase'
import AllChats from '../Chat/AllChats'

import SendIcon from '@material-ui/icons/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import DuoIcon from "@material-ui/icons/Duo";

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

    return <div style={{
        height:"350px",
        position:"absolute",
        bottom:"10px",
        right:"50px",
        backgroundColor:"white",
        width:"250px",
        boxShadow: "0px 5px 7px 8px rgba(0,0,0,0.24)"
    }}>
        <div style={{
            backgroundColor:"#404040",
            // height:"10%",
            padding:"5px"
        }}>
            <div style={{
                width:"100%",
                color:"white"
            }}
            >
                {recipient_mail}
                <div style={{
                    float:"right"
                }}>
                    <DuoIcon 
                        className={styles.sendChat__close} 
                        onClick={() => dispatch(closeSendChat())}
                    />
                    <CloseIcon 
                        className={styles.sendChat__close} 
                        onClick={() => dispatch(closeSendChat())}
                    />
                </div>
            </div>
        </div>
        <div style={{
            height:"80%",
        }}>
            <ScrollToBottom className={styles.scrollClass}>
                {[1,4,2,6,9,9,2,4,2,6,9,9,2,4].map(chat => {
                    return <>
                    <div style={{
                            maxWidth:"80%",
                            padding:"10px",
                            marginTop:"10px",
                            backgroundColor:"#f2f2f2",
                            float:chat%2 == 0 ? "right" : "left",
                            clear:"both"
                        }}>
                            scrollClassscrollClass scrollClass wajnaw awjdaw dawd nwa dawmdnw ad amwnd 
                    </div><br></br>
                    </>
                })}
            </ScrollToBottom>
        </div>
        <div style={{
            height:"10%",
            width:"100%"
        }}>
            <div style={{}}>
                <hr></hr>
                <input 
                    type="text"
                    style={{width:"80%",padding:'5px',outline: "none",border:"none"}}
                />
            
                <div style={{
                        float:"right",
                        padding:"2px"
                    }}>
                        <SendIcon
                            className={styles.sendChat__close} 
                            onClick={() => dispatch(closeSendChat())}
                        />
                </div>
            </div>
        </div>
    </div>
}

export default SendChat
