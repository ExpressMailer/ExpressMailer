import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Mail from './components/Mail/Mail';
import EmailList from './components/EmailList/EmailList';
import SendMail from './components/SendMail/SendMail';
import SendChat from './components/SendChat/SendChat';
import Login from "./components/Login/Login"
import { selectSendMessageIsOpen } from './features/mail';
import { selectSendChatIsOpen } from './features/chat';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, login } from './features/userSlice';
import { auth, db } from './firebase';
import Meet from './components/Meet/Meet';
import { selectShowSidebar } from './features/commonSlice';
import { decrypt } from './utilities/crypt';
import { generateRoomName } from './utilities/common';
import Loading from './components/Loading/Loading';

function App() {

  const sendMessageIsOpen = useSelector(selectSendMessageIsOpen);
  const sendChatIsOpen = useSelector(selectSendChatIsOpen);
  const user = useSelector(selectUser);
  const showSideBar = useSelector(selectShowSidebar)
  const dispatch = useDispatch();
  

  const [emails,setEmails] = useState([])
  const [selectedSideBarItem, setSelectedSideBarItem] = useState(0)// 0-> Inbox, 2-> Starred, etc
  const [selectedLabelItem, setSelectedLabelItem] = useState(0)// 0-> Primary, 1-> Social, 2->Promotions

  function getQueryStatement(){
    let emailRef = db.collection('emails')

    // Left side bar
    if(selectedSideBarItem == 0){// received
      emailRef = emailRef.where('to','==',auth.currentUser.email)
    }
    else if(selectedSideBarItem == 1){ // starred
      emailRef = emailRef.where('to','==',auth.currentUser.email).where('starred','==',true)
    }
    else if(selectedSideBarItem == 3){ // marked as imp
      emailRef = emailRef.where('to','==',auth.currentUser.email).where('important','==',true)
    }
    else if(selectedSideBarItem == 4){// sent by me
      console.log('sentttt by meee')
      emailRef = emailRef.where('from','==',auth.currentUser.email)
    }

    // Label
    if(selectedLabelItem == 0){
      console.log('0 called')
      emailRef = emailRef.where('label','==',"Primary")
    }
    else if(selectedLabelItem == 1){
      console.log('1 called')
      emailRef = emailRef.where('label','==',"Social")
    }
    else if(selectedLabelItem == 2){
      console.log('2 called')
      emailRef = emailRef.where('label','==',"Promotions")
    }


    emailRef = emailRef.orderBy('timestamp','desc')
    
    return emailRef
  }

  const getMails = () => {
    let emailRef = getQueryStatement()
    
    emailRef
    .onSnapshot(snapshot => {
        setEmails([...snapshot.docs.map(doc => {//...emails
          return {
            id: doc.id,
            data: {
              ...doc.data(),
              subject: decrypt(
                doc.data().subject,
                generateRoomName(doc.data().to, doc.data().from)
              ),
              message: decrypt(
                doc.data().message,
                generateRoomName(doc.data().to, doc.data().from)
              )
            }, 
          }
        })])
    })
  }

  const showSearchResults = (query) => {
    if(query.length == 0){
      getMails()
      return
    }
    let emailRef = db.collection('emails')
    emailRef
    .where('to','==',auth.currentUser.email)
    .where('searchableKeywords','array-contains',query)
    .orderBy('timestamp','desc')
    .onSnapshot(snapshot => {
        setEmails(snapshot.docs.map(doc => ({
            id: doc.id,
            data: {
              ...doc.data(), 
              subject: decrypt(
                doc.data().subject,
                generateRoomName(doc.data().to, doc.data().from)
              ),
              message: decrypt(
                doc.data().message,
                generateRoomName(doc.data().to, doc.data().from)
              )
            }
        })))
    })
  }

  useEffect(() => {
    auth.onAuthStateChanged(user => { 
      if (user) {
        dispatch(
          login({
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoURL
          })
        );
        getMails()
      }
    });
  }, [selectedSideBarItem,selectedLabelItem]);
  
  return (
    <Router>
      {!user ? (
        <Login />
      ): (
        <div className="app">
        <Header showSearchResults={showSearchResults} />
  
        <div className="app__body">
          {showSideBar && <Sidebar selectedSideBarItem={selectedSideBarItem} setSelectedSideBarItem={setSelectedSideBarItem} />}
  
          <Switch>
            <Route path="/mail">
              <Mail />
            </Route>
            <Route path="/meet/single/:userMail">
              <Meet />
            </Route>
            <Route path="/meet/conference/:userMail">
              <Meet />
            </Route>
            <Route path="/">
              
              <EmailList 
                emails={emails} 
                setEmails={setEmails} 
                getMails={getMails}
                selectedLabelItem={selectedLabelItem}
                setSelectedLabelItem={setSelectedLabelItem}
              />
            </Route>
          </Switch>
  
        </div>
        
      {sendChatIsOpen && <SendChat />}
      {sendMessageIsOpen && <SendMail />}
      </div>
      )}

    </Router>
  );
}

export default App;
