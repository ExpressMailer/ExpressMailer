import { configureStore } from '@reduxjs/toolkit';
import mailReducer from '../features/mailSlice';
import userReducer from '../features/userSlice';
import commonReducer from '../features/commonSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    mail: mailReducer,
    common: commonReducer
  },
});
