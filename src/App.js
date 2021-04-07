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

// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  const limit = 100

  const sendMessageIsOpen = useSelector(selectSendMessageIsOpen);
  const sendChatIsOpen = useSelector(selectSendChatIsOpen);
  const user = useSelector(selectUser);
  const showSideBar = useSelector(selectShowSidebar)
  const dispatch = useDispatch();
  

  const [emails,setEmails] = useState([])
  const [selectedSideBarItem, setSelectedSideBarItem] = useState(0)
  const [lastDoc, setLastDoc] = useState(null)

  function getQueryStatement(){
    let emailRef = db.collection('emails')
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
      emailRef = emailRef.where('from','==',auth.currentUser.email)
    }
    emailRef = emailRef.orderBy('timestamp','desc')
    if(lastDoc){
      emailRef = emailRef.startAfter(lastDoc)
    }
    emailRef = emailRef.limit(limit)
    return emailRef
  }

  const getMails = () => {
    console.log('getMails')
    let emailRef = getQueryStatement()
    
    emailRef
    .onSnapshot(snapshot => {
      console.log('hie')
      if(snapshot.docs.length != 0){
        setLastDoc(snapshot.docs[snapshot.docs.length-1])
        setEmails([...emails,...snapshot.docs.map(doc => {
          return {
            id: doc.id,
            data: {
              ...doc.data(),
              subject: decrypt(doc.data().subject,generateRoomName(auth.currentUser.email,doc.data().from)),
              message: decrypt(doc.data().message,generateRoomName(auth.currentUser.email,doc.data().from))
            }, 
          }
        })])
      }
      else{
        alert('No more mails available')
      }
    })
  }

  const showSearchResults = (query) => {
    console.log(query)
    if(query.length == 0){
      getMails()
      return
    }
    let emailRef = db.collection('emails')
    emailRef
    .where('to','==',auth.currentUser.email)
    .where('searchableKeywords','array-contains',query)
    .limit(10)
    .orderBy('timestamp','desc')
    .onSnapshot(snapshot => {
      console.log(snapshot.docs.length)
      if(snapshot.docs.length == 0){
        setEmails(getMails())
      }
      else{
        setEmails(snapshot.docs.map(doc => ({
            id: doc.id,
            data: {
              ...doc.data(), 
              subject: decrypt(doc.data()['subject'],generateRoomName(auth.currentUser.email,doc.data()['title']))
            }
        })))
      }
    })
    // setShowSearch(true)
  }

  useEffect(() => {
    auth.onAuthStateChanged(user => { 
      if (user) {
        //user is logged in
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
  }, [selectedSideBarItem]);
  
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
              <EmailList emails={emails} setEmails={setEmails} getMails={getMails}/>
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
