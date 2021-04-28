import { auth, db } from "../firebase"
import { generateRoomName } from "./common"
import { decrypt } from "./crypt"

export function getQueryStatement(selectedSideBarItem,selectedLabelItem){
    let emailRef = db.collection('emails')
  
    // Left side bar
    if(selectedSideBarItem == 0){// received
      emailRef = emailRef.where('to','==',auth.currentUser.email).where('spam','==',false)
    }
    else if(selectedSideBarItem == 1){ // starred
      emailRef = emailRef.where('to','==',auth.currentUser.email).where('starred','==',true).where('spam','==',false)
    }
    else if(selectedSideBarItem == 3){ // marked as imp
      console.log('imp here')
      emailRef = emailRef.where('to','==',auth.currentUser.email).where('important','==',true).where('spam','==',false)
    }
    else if(selectedSideBarItem == 4){// sent by me
      console.log('sentttt by meee')
      emailRef = emailRef.where('from','==',auth.currentUser.email)
    }
    else if(selectedSideBarItem == 6){// spam
      emailRef = emailRef.where('to','==',auth.currentUser.email).where('spam','==',true)
    }
    else{
      emailRef = emailRef.where('to',"==","somethingThatDoesntExist")
    }

    // Label
    if(selectedLabelItem == 0){
      console.log('0 called')
      emailRef = emailRef.where('label','==',"Primary")
    }
    else if(selectedLabelItem == 1){
      console.log('1 called')
      emailRef = emailRef.where('label','==',"Social")
    }
    else if(selectedLabelItem == 2){
      console.log('2 called')
      emailRef = emailRef.where('label','==',"Promotions")
    }
    else{
      emailRef = emailRef.where('label',"==","somethingThatDoesntExist")
    }


    emailRef = emailRef.orderBy('timestamp','desc')
    
    return emailRef
}

export function processMailData(doc){
    return {
        id: doc.id,
        data: {
          ...doc.data(),
          subject: decrypt(
            doc.data().subject,
            generateRoomName(doc.data().to, doc.data().from)
          ),
          message: decrypt(
            doc.data().message,
            generateRoomName(doc.data().to, doc.data().from)
          )
        }, 
    }
}

export async function toggleStarred(id){
  var current= await db.collection('emails').doc(id).get()
  if(current.data().from == auth.currentUser.email){
    // user trying to star mail sent by self => DENY
    return false
  }
  db.collection('emails').doc(id).set({
      "starred": !current.data()["starred"]
    },{merge:true})
  return true
}

export async function toggleImportant(id){
  var current= await db.collection('emails').doc(id).get()
  if(current.data().from == auth.currentUser.email){
    // user trying to imp mail sent by self => DENY
    console.log('action deny')
    return false
  }
  db.collection('emails').doc(id).set({
      "important": !current.data()["important"]
    },{merge:true})
  return true
}

export async function toggleSpam(id){
  var current= await db.collection('emails').doc(id).get()
  if(current.data().from == auth.currentUser.email){
    // user trying to imp mail sent by self => DENY
    return false
  }
  db.collection('emails').doc(id).set({
      "spam": !current.data()["spam"]
    },{merge:true})
  return true
}

export async function deleteMail(id){
  var current= await db.collection('emails').doc(id).get()
  if(current.data().from === auth.currentUser.email){
    // Only sender can delete the mail
    db.collection('emails').doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  
    return true
  }
  return false
}