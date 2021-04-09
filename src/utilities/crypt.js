// https://dannydenenberg.com/end-to-end-nodejs
var CryptoJS = require("crypto-js");

const secret_key_from_env = "jn3ej23nu234hnr87ucnsnejsnf843nfu4n3dfsenjf"

export function encrypt(message, chat_room_name) {
    const key = chat_room_name + secret_key_from_env
    return CryptoJS.AES.encrypt(message, key).toString();
}
  
export function decrypt(message, chat_room_name) {
    const key = chat_room_name + secret_key_from_env
    return CryptoJS.AES.decrypt(message, key).toString(
        CryptoJS.enc.Utf8
    );
}

// function hash(p) {
//     return CryptoJS.SHA512(p).toString(CryptoJS.enc.Base64);
// }


// encrypted_msg = encrypt("hello there is this working hello there is this working hello there is this working hello there is this working",key)
// console.log(encrypted_msg)
// decrypted_message = decrypt(encrypted_msg,key)
// console.log(decrypted_message)