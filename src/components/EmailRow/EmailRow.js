import React from 'react'
import Checkbox from "@material-ui/core/Checkbox";
import { IconButton } from "@material-ui/core";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import StarIcon from '@material-ui/icons/Star';
import LabelImportantOutlinedIcon from "@material-ui/icons/LabelImportantOutlined";
import styles from './EmailRow.module.css';
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { selectMail } from '../../features/mailSlice';
import { db } from '../../firebase';
 
 
import ReactHtmlParser from 'react-html-parser';

function EmailRow({ id, title, subject, description, time, starred, important,read,to,from }) 
{
    const history = useHistory();
    const dispatch = useDispatch();

    const openMail = () => {
        dispatch(
            selectMail({
                id, 
                title,
                subject,
                description,
                time,
                starred,
                important,
                read,
                to,
                from
            })
        );
        history.push("/mail");
    };

    async function toggleStarred(){
        var current= await db.collection('emails').doc(id).get()
        console.log(current.data()["starred"])
        db.collection('emails').doc(id).set({
            "starred": !current.data()["starred"]
          },{merge:true})
      }

    async function toggleImportant(){
        var current= await db.collection('emails').doc(id).get()
        console.log(current.data()["important"])
        db.collection('emails').doc(id).set({
            "important": !current.data()["important"]
          },{merge:true})
      } 

    return (
        <div onClick= {openMail} className={styles.emailRow}>
            <div className={styles.emailRow__options}>
                <Checkbox />
                <IconButton onClick={toggleStarred}>
                   {starred ? <StarIcon style={{fill: "orange"}}/> : <StarBorderOutlinedIcon /> }
                </IconButton>
                <IconButton onClick={toggleImportant}>
                    {important ? <LabelImportantOutlinedIcon style={{fill: "orange"}}/> : <LabelImportantOutlinedIcon /> }
                </IconButton>
            </div>
        
            <h3 className={styles.emailRow__title}>
                {title}
            </h3>

            <div className={styles.emailRow__message}>
                <h4> {subject} {" "}
                <span className={styles.emailRow__description}>- {ReactHtmlParser(description)}
                </span>
                </h4>
            </div>

            <p className={styles.emailRow__description}>
                {time}
            </p>

        </div>
    )
}


export default EmailRow
