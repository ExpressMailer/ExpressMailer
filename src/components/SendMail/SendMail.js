import React from 'react';
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
import { decrypt,encrypt } from '../../utilities/crypt'
import { generateRoomName } from '../../utilities/common';
import { useState } from 'react'; 

function SendMail() {

    const { register, handleSubmit, watch, errors } = useForm();
    const dispatch = useDispatch()
    const [addData, setVal] = useState("");
    const [option,setOption] = useState("Primary");
    const notify = (msg) => toast(msg);

    const handleChange = (e, editor) => {
        var data = editor.getData();
        setVal(data);
    }
    
    const handleChangeinType = (event) => {
        setOption(event.target.value)
        console.log(`Option selected:`, option);
    }

    const generateKeywords = (formData) => {
        let searchableKeywords = [auth.currentUser.email,...formData.subject.split(' ')]
        let prev = ''
        for(var i=0;i<formData.subject.length;i++){
            prev = prev  + formData.subject.charAt(i)
            searchableKeywords.push(prev)
        }
        return searchableKeywords
    }
    
    const checkIfEmailExists = async (email) => {
        const snapshot = await db.collection('users').where('email','==',email).limit(1).get()
        console.log(snapshot.empty)
        if(snapshot.empty){
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
        console.log(generateKeywords(formData))
        

        if(emailExists){   
            db.collection('emails').add({
                to: formData.to,
                from: auth.currentUser.email,
                subject:  encrypt(formData.subject, generateRoomName(auth.currentUser.email,formData.to)),
                message: encrypt(addData, generateRoomName(auth.currentUser.email,formData.to)),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                searchableKeywords: generateKeywords(formData),
                read: false,
                label: option
            })
            toast.success("Mail sent successfully.")
            dispatch(closeSendMessage())
        }
        else{
            console.log(formData.to + " doesn't exist.")
            // toast.error(formData.to + " doesn't exist.")
            toast.success("Mail sent successfully.")
        }

    }
    
    return <>
    <ToastContainer />
        <div className={styles.sendMail}>
            
            <div className={styles.sendMail__header}>
                <h3>New Message</h3>
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
                        data={addData}  
                        onChange={handleChange}
                    />
                {/* </div> */}
                {errors.to && <p className={styles.sendMail__error}>Message is required</p>}

                <div className={styles.sendMail__options}>
                    <select 
                        value="Primary"
                        onChange={handleChangeinType}
                        name='option' 
                    >
                        <option value="Primary">Primary</option>
                        <option value="Social">Social</option>
                        <option value="Promotions">Promotions</option>
                    </select>
                   
                    <Button 
                        className="sendMail__send"
                        variant="contained"
                        color="primary"
                        type="submit"
                    >Send</Button>

                   

                </div>
            </form> 
        </div>
    </>
}

export default SendMail
