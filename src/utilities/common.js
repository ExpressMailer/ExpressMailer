export const generateRoomName = (sender_email,receiver_email) => {
    var docName;
    if(sender_email < receiver_email){
        docName = sender_email + '-' + receiver_email;
    }
    else{
        docName = receiver_email + '-' + sender_email;
    }
    return docName
}