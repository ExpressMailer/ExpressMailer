import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
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
import { getQueryStatement, processMailData } from './utilities/utils';

function App() {

  const sendMessageIsOpen = useSelector(selectSendMessageIsOpen);
  const sendChatIsOpen = useSelector(selectSendChatIsOpen);
  const user = useSelector(selectUser);
  const showSideBar = useSelector(selectShowSidebar)
  const dispatch = useDispatch();
  

  const [emails,setEmails] = useState([])
  const [selectedSideBarItem, setSelectedSideBarItem] = useState(0)// 0-> Inbox, 2-> Starred, etc
  const [selectedLabelItem, setSelectedLabelItem] = useState(0)// 0-> Primary, 1-> Social, 2->Promotions
  const [emailReff, setEmailReff] = useState(null)
  const [searchQuery, setSearchQuery] = useState()

  const getMails = () => {
    let emailRef = getQueryStatement(selectedSideBarItem,selectedLabelItem)
    setEmailReff(emailRef)
  }

  useEffect(() => {
    if(searchQuery && searchQuery.length > 0){
      const m = db.collection('emails')
      .where('to','==',auth.currentUser.email)
      .where('searchableKeywords','array-contains',searchQuery)
      .orderBy('timestamp','desc')
      .onSnapshot(snapshot => {
        setEmails(snapshot.docs.map(doc => processMailData(doc) ))
      })
      
      return () => {
        console.log('search clean up')
        m()
      }
    }
    else if(emailReff){
      console.log('----emailReff=> about to snapshot')
      const m = emailReff.onSnapshot(snapshot => {
        setEmails([...snapshot.docs.map(doc => processMailData(doc) )])
      })
      
      return () => {
        console.log('----emailReff=> calling cleanup')
        m()
        setEmails([])
      }
    }
  }, [emailReff,searchQuery])

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
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  
        <div className="app__body">
          {showSideBar && <Sidebar listLength={emails.length} selectedSideBarItem={selectedSideBarItem} setSelectedSideBarItem={setSelectedSideBarItem} />}
  
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
                selectedLabelItem={selectedLabelItem}
                setSelectedLabelItem={setSelectedLabelItem}
                getMails={getMails}
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
