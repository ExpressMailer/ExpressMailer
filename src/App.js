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
import Login from "./components/Login/Login"
import { selectSendMessageIsOpen } from './features/mail';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, login } from './features/userSlice';
import { auth, db } from './firebase';
import Meet from './components/Meet/Meet';
import { selectShowSidebar } from './features/commonSlice';

function App() {
  const sendMessageIsOpen = useSelector(selectSendMessageIsOpen);
  const user = useSelector(selectUser);
  const showSideBar = useSelector(selectShowSidebar)
  const dispatch = useDispatch();
  

  const [emails,setEmails] = useState([])

  const getMails = () => {
    db.collection('emails').where('to','==',auth.currentUser.email).limit(10).orderBy('timestamp','desc').onSnapshot(snapshot => {
      setEmails(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
      })))
    })
  }

  const showSearchResults = (query) => {
    console.log(query)
    if(query.length == 0){
      getMails()
      return
    }
    db.collection('emails')
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
            data: doc.data()
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
  }, []);
  
  return (
    <Router>
      {!user ? (
        <Login />
      ): (
        <div className="app">
        <Header showSearchResults={showSearchResults} />
  
        <div className="app__body">
          {showSideBar && <Sidebar />}
  
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
              <EmailList emails={emails} setEmails={setEmails} />
            </Route>
          </Switch>
  
        </div>
        {sendMessageIsOpen && <SendMail />}
      </div>
      )}

    </Router>
  );
}

export default App;
