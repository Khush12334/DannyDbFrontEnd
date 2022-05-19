import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import { createUserSettingsFirebase, setUserData } from './userSlice';
import axios from 'axios';

export const submitRegister =
  ({ displayName, password, email }) =>
    async (dispatch) => {
      let formdata = new FormData();
      formdata.append("email", email)
      formdata.append("name", displayName)
      formdata.append("password", password)

      axios.post("https://dannydb.wirelesswavestx.com/signup", formdata, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }).then(result => {
        console.log(result)
        if (result.status == 200) {
          dispatch(setUserData({
            data: {
              displayName: displayName,
              email: email,
              photoURL: "",
              settings: {},
              shortcuts: [],
              isLogin: true
            },
            role: "admin"
          }));
          return dispatch(registerSuccess());
        }
      }).catch((e) => {
        console.log(e.response.data)
        let type = e.response.data == "Email Already Exist" ? "email" : ""
        return dispatch(registerError([{
          message: e.response.data,
          type: type,
        }]));
      })
      // return jwtService
      //   .createUser({
      //     displayName,
      //     password,
      //     email,
      //   })
      //   .then((user) => {
      //     dispatch(setUserData(user));
      //     return dispatch(registerSuccess());
      //   })
      //   .catch((errors) => {
      //     console.log(errors)
      //     return dispatch(registerError(errors));
      //   });
    };

export const registerWithFirebase = (model) => async (dispatch) => {
  if (!firebaseService.auth) {
    console.warn("Firebase Service didn't initialize, check your configuration");

    return () => false;
  }
  const { email, password, displayName } = model;

  return firebaseService.auth
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      dispatch(
        createUserSettingsFirebase({

          ...response.user,
          displayName,
          email,
        })
      );

      return dispatch(registerSuccess());
    })
    .catch((error) => {
      const usernameErrorCodes = [
        'auth/operation-not-allowed',
        'auth/user-not-found',
        'auth/user-disabled',
      ];

      const emailErrorCodes = ['auth/email-already-in-use', 'auth/invalid-email'];

      const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];

      const response = [];

      if (usernameErrorCodes.includes(error.code)) {
        response.push({
          type: 'username',
          message: error.message,
        });
      }

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

      return dispatch(registerError(response));
    });
};

const initialState = {
  success: false,
  errors: [],
};

const registerSlice = createSlice({
  name: 'auth/register',
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    registerError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
  },
  extraReducers: {},
});

export const { registerSuccess, registerError } = registerSlice.actions;

export default registerSlice.reducer;
