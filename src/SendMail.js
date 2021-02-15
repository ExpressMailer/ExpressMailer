import React from 'react';
import './SendMail.css';
import CloseIcon from "@material-ui/icons/Close";
import { Button } from '@material-ui/core';

function SendMail() {
    return <div className='sendMail'>
        <div className="sendMail__header">
            <h3>New Message</h3>
            <CloseIcon className="sendmail__close" />
        </div>

        <form>
            <input type="text"/>
            <input type="text"/>
            <input type="text"/>

            <div className="sendMail__options">
                <Button>Send</Button>
            </div>
        </form> 
    </div>;
}

export default SendMail
