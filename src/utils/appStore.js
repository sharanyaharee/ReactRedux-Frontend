import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice'
import adminReducer from './adminSlice'

const appStore = configureStore({
   reducer:{
    user:userReducer,
    admin:adminReducer,


   }
})

export default appStore
