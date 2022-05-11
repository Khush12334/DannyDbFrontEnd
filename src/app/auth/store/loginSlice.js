import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import { setUserData } from './userSlice';
import axios from 'axios'

export const submitLogin =
  ({ email, password }) =>
    async (dispatch) => {
      const params = {
        "email": "murtaza.zaheer@gmail.com",
        "password": "123456"
      }
      axios.post("http://207.244.250.143/dannydb/login", params, {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range',
          'Access-Control-Expose-Headers': 'Content-Length,Content-Range'
        }
      }).then(res => {
        console.log(res)
      })
      // return jwtService
      //   .signInWithEmailAndPassword(email, password)
      //   .then((user) => {
      //     dispatch(setUserData(user));

      //     return dispatch(loginSuccess());
      //   })
      //   .catch((errors) => {
      //     return dispatch(loginError(errors));
      //   });
    };

export const submitLoginWithFireBase =
  ({ email, password }) =>
    async (dispatch) => {
      if (!firebaseService.auth) {
        console.warn("Firebase Service didn't initialize, check your configuration");

        return () => false;
      }
      return firebaseService.auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          return dispatch(loginSuccess());
        })
        .catch((error) => {
          const emailErrorCodes = [
            'auth/email-already-in-use',
            'auth/invalid-email',
            'auth/operation-not-allowed',
            'auth/user-not-found',
            'auth/user-disabled',
          ];
          const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];
          const response = [];

          if (emailErrorCodes.includes(error.code)) {
            response.push({
              type: 'email',
              message: error.message,
            });
          }

          if (passwordErrorCodes.includes(error.code)) {
            response.push({
              type: 'password',
              message: error.message,
            });
          }

          if (error.code === 'auth/invalid-api-key') {
            dispatch(showMessage({ message: error.message }));
          }

          return dispatch(loginError(response));
        });
    };

const initialState = {
  success: false,
  errors: [],
};

const loginSlice = createSlice({
  name: 'auth/login',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
