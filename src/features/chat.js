import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sendChatIsOpen: false,
    recipient_mail: null,
  },
  reducers: {
    openSendChat: (state, action) => {
      console.log('action')
      console.log(action)
      state.sendChatIsOpen = true;
      state.recipient_mail = action.payload;
    },
    closeSendChat: state => {
      state.sendChatIsOpen = false;
    },
  },
});

export const { openSendChat, closeSendChat } = chatSlice.actions;


export const selectSendChatIsOpen = state => state.chat.sendChatIsOpen;
export const selectSendChatRecipientmail = state => state.chat.recipient_mail;

export default chatSlice.reducer;
