import { configureStore } from '@reduxjs/toolkit';
import mailReducer from '../features/mailSlice';
import userReducer from '../features/userSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    mail: mailReducer,
  },
});
