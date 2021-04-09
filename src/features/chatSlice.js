import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selectedChat: null,
    sendChatIsOpen: false,
    recipient_mail: null,
  },
  reducers: {
    selectChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    openSendChat: (state, action) => {
      console.log('slice mai '+ action.payload);
      state.sendChatIsOpen = true;
      state.recipient_mail = action.payload;
    },
    closeSendChat: state => {
      state.sendChatIsOpen = false;
    },
  },
}); 

export const { 
  selectChat,
  openSendChat, 
  closeSendChat, 
} = chatSlice.actions;


export const selectOpenChat = (state) => state.chat.selectedChat;
export const selectSendChatIsOpen = (state) => state.chat.selectSendChatIsOpen;
export const selectSendChatRecipientmail = state => state.chat.recipient_mail;

export default chatSlice.reducer;
