import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import { setUserData } from './userSlice';
import axios from 'axios'

export const submitLogin =
  ({ email, password }) =>
    async (dispatch) => {
      axios.post("https://dannydb.wirelesswavestx.com/login", {
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }).then(res => {
        console.log(res)
      })
      // axios.post(`http://134.122.18.221/api/v1/users/login`,
      //   { email: "DominacRay@gmail.com", password: "123456789" }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   }
      // }).then(async (res) => {
      //   console.log("login res", res)
      // })
      // fetch('http://207.244.250.143/dannydb/login', {
      //   method: 'POST',
      //   headers: {
      //     // the content type header value is usually auto-set
      //     // depending on the request body
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: email,
      //     password: password
      //   }),
      //   referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
      //   mode: "cors", // same-origin, no-cors
      //   credentials: "same-origin",
      // }).then(res => { console.log(res) })
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
