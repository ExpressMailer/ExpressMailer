import React, { useEffect, useState } from 'react';
import styles from './SendChat.module.css';
import CloseIcon from "@material-ui/icons/Close";
import { Button, Grid, IconButton } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { closeSendChat, selectSendChatRecipientmail } from '../../features/chat';
import { auth, db } from '../../firebase';
import { selectUser } from '../../features/userSlice';
import firebase from 'firebase'
import AllChats from '../Chat/AllChats'

import SendIcon from '@material-ui/icons/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import DuoIcon from "@material-ui/icons/Duo";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SendChat() {

    const recipient_mail = useSelector(selectSendChatRecipientmail);
    // const { register, handleSubmit, watch, errors } = useForm();
    const dispatch = useDispatch();
    console.log(recipient_mail);

    const [chatmsg, setChatmsg] = useState('')
    const [userDetails, setuserDetails] = useState([])

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
    
    const onSubmit =  async () => {
            db.collection('echats')
            .doc(docName)
            .collection('chats').add({
                to: recipient_mail,
                from: auth.currentUser.email,
                message: chatmsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
        
        //     let arrayData = [];
        // // checking no of elements in array recentlychatedperson
        //     arrayData = await db.collection('users').where('email','==',auth.currentUser.email).onSnapshot( async (snapshot) => {
        //     let userData = snapshot.docs.map(doc => ({
        //         id: doc.id,
        //         data: doc.data()
        //     }))
            
        //     console.log(userData[0].data.recentlychatedwith);
        //     arrayData = userData[0].data.recentlychatedwith;
            
           
        //     console.log("check array data -------------");
        //     console.log(arrayData);
        //     console.log(arrayData.length);
        //     console.log("upar check array data");


        //     let obj = arrayData.find(o => o.email === recipient_mail);

        //     // if recipient present in recently chat array
        //     if(obj){
        //         console.log(obj);
        //         let temp;
        //         // get index where recipient is present
        //         let index = arrayData.findIndex(x => x.email === recipient_mail);
        //         console.log("index at which recipient is already present " + index);
        //         // store its index 
        //         temp = arrayData[index];
        //         // if recipient is not at first position 
        //         if(index!=0){
        //             arrayData = arrayData.splice(index, 1);
        //             arrayData.unshift(temp);  // put recent on front
        //         }
        //     }

        //     else{
        //         // get recipient details
        //         var userRecipient = await db.collection('users').where('email', '==', recipient_mail).get();

        //         // make object for this new person
        //         let addPerson = {
        //             "docID" : userData[0].id,
        //             "email" : recipient_mail,
        //             "displayName" : userRecipient.docs[0].data()['displayName'], 
        //             "photoUrl" : userRecipient.docs[0].data()['photoUrl'],
        //         }
        //         // if array length is less than 5 add new object directly
        //         if(arrayData.length < 5)
        //         {
        //             arrayData.unshift(addPerson);
        //         }
        //         // if array length is greater delete the last element and push this new object to index 0
        //         else{
        //             arrayData.splice(-1);
        //             arrayData.unshift(addPerson);
        //         }
                
        //     }  
  
            
        //     return arrayData;
     
        //   })

        //     console.log("rugved check array data ")
        //     console.log(arrayData);

        //     // get user id to update
        //     var userRef = await db.collection('users').where('email', '==', auth.currentUser.email).get();
        //     console.log(userRef.docs[0].id);

        //     // update recentlychatedwith array
        //     var userRef1 = await db.collection('users').doc(userRef.docs[0].id);
        //     return userRef1.update({
        //     recentlychatedwith: arrayData,
        //     }).then(() => {
        //         console.log("Document successfully updated!");
        //     })
        //     .catch((error) => {
        //         // The document probably doesn't exist.
        //         console.error("Error updating document: ", error);
        //     }); 


        // dispatch(closeSendChat())
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

    
    // return <div>
    //         {chats.map(({id,data:{from,message,timestamp,to}}) => {
    //             return <AllChats
    //                 id={id}
    //                 key={id}
    //                 title={from}
    //                 chatmsg={message}
    //                 time={new Date(timestamp?.seconds*1000).toUTCString()}
    //             />
    //         })}
    //     </div>

    return <div style={{
            height:"350px",
            position:"absolute",
            bottom:"10px",
            right:"50px",
            backgroundColor:"white",
            width:"250px",
            boxShadow: "0px 5px 7px 8px rgba(0,0,0,0.24)"
        }}>
            {/* {chats.map(({id,data:{from,message,timestamp,to}}) => {
            return <> */}
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
                        {chats.map(({id,data:{from,message,timestamp,to}}) => {
                            return <>
                            <div style={{
                                    maxWidth:"80%",
                                    padding:"10px",
                                    marginTop:"10px",
                                    backgroundColor:"#f2f2f2",
                                    float: from === auth.currentUser.email ? "right" : "left",
                                    clear:"both"
                                }}>
                                    {message}
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
                            onChange={(e) => setChatmsg(e.target.value)}
                            type="text"
                            style={{width:"80%",padding:'5px',outline: "none",border:"none"}}
                        />
                    
                        <div style={{
                                float:"right",
                                padding:"2px"
                            }}>
                                <SendIcon
                                    className={styles.sendChat__close} 
                                    onClick={() => onSubmit()}
                                />
                        </div>
                    </div>
                </div>
        </div>;
}

export default SendChat
