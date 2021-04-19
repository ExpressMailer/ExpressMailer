import React, { useState } from 'react'

import { Jutsu } from 'react-jutsu'
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase'

const Meet = () => {
    const history = useHistory();
    const fullUrl = window.location.href
    let meetCode = ''
    let userClient = ''
    let meetPassword = ''
    const currentUser = auth.currentUser

    if(fullUrl.includes('/meet/single/')){
        userClient = fullUrl.split('/meet/single/')[1]
        if(currentUser.email > userClient){
            meetCode = userClient + '-' + currentUser.email
        }
        else{
            meetCode = currentUser.email + '-' + userClient 
        }
        meetPassword = meetCode // temporary
    }else if(fullUrl.includes('/meet/conference/')){
        let confCode = fullUrl.split('/meet/conference/')[1] || ''
        meetCode = confCode
        meetPassword = ''
    }


  const [room, setRoom] = useState(meetCode)
  const [name, setName] = useState(currentUser.displayName)
  const [call, setCall] = useState(userClient == '' ? false : true)
  const [password, setPassword] = useState(meetPassword)

  const handleClick = event => {
    event.preventDefault()
    console.log(room+" "+name+" "+password)
    if (room && name) setCall(true)
  }



  return <div
    style={{
      display:"flex",
      margin:"0 auto",
      alignItems:"center",
      // backgroundColor:"pink"
    }}
  >
    {call ? (
      <Jutsu
        roomName={room}
        displayName={name}
        password={password}
        onMeetingEnd={() => history.push('/')}
        loadingComponent={<p>loading ...</p>}
        errorComponent={<p>Oops, something went wrong</p>} />
    ) : (
      <div>
          <form>
              <input id='room' type='text' placeholder='Room' value={room} onChange={(e) => setRoom(e.target.value)} />
              <input id='name' type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
              <input id='password' type='text' placeholder='Password (optional)' value={password} onChange={(e) => setPassword(e.target.value)} />
              <button onClick={handleClick} type='submit'>
                  Start / Join
              </button>
          </form>
      </div>
    )}
  </div>
}

export default Meet