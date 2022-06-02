import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';
import jwtService from 'app/services/jwtService';
import { setUserData } from './userSlice';
import axios from 'axios'

export const submitLogin =
  ({ email, password }) =>
    async (dispatch) => {
      let formdata = new FormData();
      formdata.append("email", email)
      formdata.append("password", password)
      axios.post("https://dannydb.wirelesswavestx.com/login", formdata, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }).then(result => {
        console.log(result)
        if (result.status == 200) {
          let res = result.data.data
          res['displayName'] = res.name
          res['photoURL'] = ""
          res['settings'] = {}
          res['shortcuts'] = []
          res['isLogin'] = true

          console.log(res)
          dispatch(setUserData({
            data: res,
            role: "admin"
          }));

          return dispatch(loginSuccess());
        }
      }).catch((e) => {
        console.log(e.response)
        return dispatch(loginError(
          [
            {
              message: "Check your email address",
              type: "email",
            }, {
              message: "Check your password",
              type: "password",
            }
          ]
        ));
      })
      // return jwtService
      //   .signInWithEmailAndPassword(email, password)
      //   .then((user) => {
      //     console.log(user)
      //     dispatch(setUserData(user));

      //     return dispatch(loginSuccess());
      //   })
      //   .catch((errors) => {
      //     console.log(errors)
      //     return dispatch(loginError(errors));
      //   });
    };

export const submitUpdate =
  (user, { displayName, email, password }) =>
    async (dispatch) => {
      let formdata = new FormData();
      formdata.append("id", user.data.id)
      formdata.append("name", displayName)
      formdata.append("email", email)
      formdata.append("password", password)
      axios.post("https://dannydb.wirelesswavestx.com/updateprofile", formdata, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }).then(result => {
        console.log(result)
        if (result.status == 200) {
          let res = []
          res['email'] = email
          res['password'] = password
          res['displayName'] = displayName
          res['photoURL'] = ""
          res['settings'] = {}
          res['shortcuts'] = []
          res['isLogin'] = true

          console.log(res)
          dispatch(setUserData({
            data: res,
            role: "admin"
          }));


        }
      }).catch((e) => {
        console.log(e.response)
        // return dispatch(loginError(
        //   [
        //     {
        //       message: "Check your email address",
        //       type: "email",
        //     }, {
        //       message: "Check your password",
        //       type: "password",
        //     }
        //   ]
        // ));
      })
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
