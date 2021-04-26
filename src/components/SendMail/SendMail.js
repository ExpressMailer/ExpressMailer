import React, { useState, useEffect } from 'react';
import styles from './SendMail.module.css';
import CloseIcon from "@material-ui/icons/Close";
import { Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { closeSendMessage } from '../../features/mail';
import { auth, db } from '../../firebase';
import firebase from 'firebase'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { decrypt,encrypt } from '../../utilities/crypt';
import { generateRoomName } from '../../utilities/common';
import EmailRow from '../EmailRow/EmailRow';
import axios from 'axios';
 
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import ReactHtmlParser from 'react-html-parser';
import Loading from '../Loading/Loading';

// const api= axios.create({
//     baseURL: 'http://127.0.0.1:5000/'
// })


function SendMail() {

    const { register, handleSubmit, watch, errors } = useForm();
    const dispatch = useDispatch()
    const [addData, setVal] = useState("");
    const [option,setOption] = useState("Primary");
    const notify = (msg) => toast(msg);
    

    const sendEmail = async(msg) =>{
        console.log('addData')
        let cleanMsg = addData.replace( /(<([^>]+)>)/ig, '')
        let config = {headers: {  
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }}

        const resp = await axios.post('https://gmail-clone-ml.herokuapp.com/predict', {message: cleanMsg},config)
        return resp.data['val']
    }

    const handleChange = (e, editor) => {
        var data = editor.getData();
        setVal(data);
    }
    
    const handleChangeinType = (event) => {
        setOption(event.target.value)
        console.log(`Option selected:`, option);
    }

    const generateKeywords = async (formData) => {
        let searchableKeywords = [auth.currentUser.email,...formData.subject.split(' ')]
        let prev = ''
        for(var i=0;i<formData.subject.length;i++){
            prev = prev  + formData.subject.charAt(i)
            searchableKeywords.push(prev)
        }
        // top n Keywords from the body 
        let cleanMsg = addData.replace( /(<([^>]+)>)/ig, '')
        let config = {headers: {  
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }}

        const resp = await axios.post('https://gmail-clone-ml.herokuapp.com/keywords', {message: cleanMsg,n:5},config)
        searchableKeywords = [...searchableKeywords,...resp.data['keywords']]
        console.log(searchableKeywords)
        return searchableKeywords
    }
    
    const checkIfEmailExists = async (email) => {
        const snapshot = await db.collection('users').where('email','==',email).limit(1).get()
        console.log(snapshot.empty)

        if(snapshot.empty || email == auth.currentUser.email){
            return false
        }
        return true
    }
    
    const onSubmit = async (formData) => {
        // check here if email exist (for now just setting it to true)
        if(addData == "")
        {
            return; 
        }
        const emailExists = await checkIfEmailExists(formData.to) 
    
        // console.log(await generateKeywords(formData))

        if(emailExists){   
            db.collection('emails').add({
                to: formData.to,
                from: auth.currentUser.email,
                subject:  encrypt(formData.subject, generateRoomName(auth.currentUser.email,formData.to)),
                message: encrypt(addData, generateRoomName(auth.currentUser.email,formData.to)),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                searchableKeywords: await generateKeywords(formData),
                read: false,
                starred: false,
                important: false,
                spam: await sendEmail(formData.message),
                label: option
            })
            dispatch(closeSendMessage())
        }
        else{
            console.log(formData.to + " doesn't exist.")
            toast.error("Cannot send mail to "+formData.to)
            // toast.success("Mail sent successfully.")
        }
        
    }

    

    return <>
    <ToastContainer />
        <div className={styles.sendMail}>
            
            <div className={styles.sendMail__header}>
                <h3>New Mail</h3>
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

            {/* <input
                    name="message"
                    placeholder="Message..."
                    type="text" 
                    className={styles.sendMail__message}
                    ref={register({ required: true })} 
                /> */}

                {/* <div className={styles.sendMail__message}> */}
                    <CKEditor
                        editor={ ClassicEditor } 
                        // styles={{"minHeight":"500px"}}
                        id="body_ckeditor"
                        data={addData}  
                        onChange={handleChange}
                    />
                {/* </div> */}
                {errors.to && <p className={styles.sendMail__error}>Message is required</p>}

                <div className={styles.sendMail__options}>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={option}
                        name='option' 
                        // className="sendMail__sendtype"
                        style={{"backgroundColor":"white", "margin":" 15px !important"}}
                        onChange={handleChangeinType}
                        >
                        <MenuItem  value="Primary">Primary</MenuItem>
                        <MenuItem value="Social">Social</MenuItem>
                        <MenuItem value="Promotions">Promotions</MenuItem>
                    </Select>

                    <Button 
                        className="sendMail__send"
                        variant="contained"
                        color="primary"
                        type="submit"
                        name="mailClick"
                    >Send</Button>

                   

                </div>
            </form> 
        </div>
    </>
}

export default SendMail
