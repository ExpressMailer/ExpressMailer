import { Button, InputLabel, TextField } from '@material-ui/core';
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
      <div style={{
        backgroundColor:"#f2f2f2",
        display:"flex",flexWrap:"wrap",flexDirection:"column",
        padding:"10px",width:"500px"
      }}>
        <div style={{ width:"100%",textAlign:"center",marginBottom:"30px" }}>
          <h1>Join the meet!</h1>
        </div>
        
              <br></br>
              <InputLabel htmlFor="room">Enter room name</InputLabel>
              <TextField  id='room' type='text' placeholder='Room' value={room} onChange={(e) => setRoom(e.target.value)} />
              
              <br></br>
              <InputLabel htmlFor="name">Your name</InputLabel>
              <TextField  id='name' type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
              <br></br>
              <InputLabel htmlFor="password">Password(optional)</InputLabel>
              <TextField  id='password' type='text' placeholder='' value={password} onChange={(e) => setPassword(e.target.value)} />

              <Button variant="contained"  color="primary" onClick={handleClick} type='submit'>
                  Start / Join
              </Button>

          {/* <form>
            <Paper style={{ padding: 16 }}>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={6}>
                  <Field
                    fullWidth
                    required
                    name="firstName"
                    component={TextField}
                    type="text"
                    label="First Name"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    fullWidth
                    required
                    name="lastName"
                    component={TextField}
                    type="text"
                    label="Last Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="email"
                    fullWidth
                    required
                    component={TextField}
                    type="email"
                    label="Email"
                  />
                </Grid>
                
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </form> */}
      </div>
    )}
  </div>
}

export default Meet