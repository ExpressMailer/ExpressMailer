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
import { auth, db } from '../../firebase';
 
 
import ReactHtmlParser from 'react-html-parser';
import { toggleImportant, toggleStarred } from '../../utilities/utils';

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
    const rowColor = read ? "white" : "rgb(221, 221, 221)"  
    const sentValname = "To: " + to
    const inboxOrSent = from === auth.currentUser.email && to != auth.currentUser.email ? sentValname : to
    return (
        <div onClick= {openMail} className={styles.emailRow} style={{backgroundColor: rowColor}}>
            <div className={styles.emailRow__options}>
                <Checkbox />
                <IconButton onClick={(e) => {
                        e.stopPropagation();
                        toggleStarred(id)
                    }
                }>
                   {starred ? <StarIcon style={{fill: "orange"}}/> : <StarBorderOutlinedIcon /> }
                </IconButton>
                <IconButton onClick={(e) => {
                        e.stopPropagation();
                        toggleImportant(id)
                    }
                }>
                    {important ? <LabelImportantOutlinedIcon style={{fill: "orange"}}/> : <LabelImportantOutlinedIcon /> }
                </IconButton>
            </div>
        
            <h3 className={styles.emailRow__title}>
                {inboxOrSent}
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
