import React, { useState } from 'react';
import styles from './SendMail.module.css';
import CloseIcon from "@material-ui/icons/Close";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Button, Chip } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { closeSendMessage } from '../../features/mail';
import { auth, db, storage } from '../../firebase';
import firebase from 'firebase'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { encrypt } from '../../utilities/crypt';
import { generateRoomName } from '../../utilities/common';
import axios from 'axios';
 
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


function SendMail() {

    const { register, handleSubmit, watch, errors } = useForm();
    const dispatch = useDispatch()
    const [addData, setVal] = useState("");
    const [option,setOption] = useState("Primary");

    //For file
    const [fileUrls, setFileUrls] = useState([])
    function handleFileChange(e) {
        handleUpload(e.target.files[0])
    }

    function handleUpload(file) {
        console.log('About to upload')
        console.log(file)
        const fileName = file.name.replace(" ","") + "-" + new Date().getTime().toString()
        // const fileName = new Date().getTime().toString()
        const uploadTask = storage.ref(`/images/${fileName}`).put(file);
        uploadTask.on("state_changed", console.log, console.error, () => {
          storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then((url) => {
              setFileUrls([...fileUrls,url])
            //   setVal(addData + `<br></br><a href=${url}>attachment:${fileName}</a><br></br>${' '}`)
            });
        });
        
    }
    /////////
    
    

    const sendEmail = async(msg) =>{
        console.log('addData')
        let cleanMsg = addData.replace( /(<([^>]+)>)/ig, '')
        // cleanMsg = addData.replace(/attachment:(\w+)/g,'')

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
                label: option,
                attachments: fileUrls
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

            
                    <CKEditor
                        editor={ ClassicEditor } 
                        // styles={{overflow:"auto",back}}
                        id="body_ckeditor"
                        data={addData}  
                        onChange={handleChange}
                    />
                    <div>
                        {/* {fileUrls.map(u => <a href={u} style={{marginRight:"2px"}} >{u}</a>)} */}

                        





                    </div>
            
                {errors.to && <p className={styles.sendMail__error}>Message is required</p>}

                <div className={styles.sendMail__buttons}>
                    <div className={styles.sendMail__buttons__left}>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={option}
                            name='option' 
                            // className="sendMail__sendtype"
                            style={{"backgroundColor":"white"}}
                            onChange={handleChangeinType}
                            >
                            <MenuItem  value="Primary">Primary</MenuItem>
                            <MenuItem value="Social">Social</MenuItem>
                            <MenuItem value="Promotions">Promotions</MenuItem>
                        </Select>
                        <div>
                            <input
                                type="file"
                                hidden
                                id="file-upload"
                                onChange={handleFileChange} 
                            />
                            <label htmlFor="file-upload">
                                <AttachFileIcon 
                                style={{color:'white',cursor:'pointer'}} 
                                />
                            </label>
                        </div>
                    </div>

                        {fileUrls.length > 0 && <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            flex:1,
                            height:'30px',overflow:'auto'
                        }}>
                            {fileUrls.map((k,index) => {
                                return <li key={index}>
                                    <Chip
                                        onClick={() => window.open(k)}
                                        label={k}
                                        style={{ marginBottom:'2px',marginRight:'3px',maxWidth:'100px' }}
                                    />
                                </li>
                            })}
                        </div>}
                    {/* </div> */}

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
