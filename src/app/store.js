import { configureStore } from '@reduxjs/toolkit';
import mailReducer from '../features/mailSlice';
import userReducer from '../features/userSlice';
import commonReducer from '../features/commonSlice';
import chatReducer from '../features/chatSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    mail: mailReducer,
    common: commonReducer,
    chat: chatReducer,
  },
});
