import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import _ from '@lodash';
import axios from 'axios';

function ForgotPass(props) {
  const {
    forgotShowClose
  } = props

  const [status, setStatus] = useState(1)
  const [forgotEmail, setForgotEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')


  function onforgotSubmit() {
    let formdata = new FormData();
    formdata.append("email", forgotEmail)
    axios.post("https://dannydb.wirelesswavestx.com/forgetpassword", formdata, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(result => {
      if (result.status == 200) {
        setStatus(2)
      }

      console.log(result)

    })
  }

  function onVerifyCodeSubmit() {
    let formdata = new FormData();
    formdata.append("verify_token", verifyCode)
    axios.post("https://dannydb.wirelesswavestx.com/verifycode", formdata, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(result => {
      if (result.status == 200) {
        setStatus(1)
        forgotShowClose()
        setForgotEmail('')
        setVerifyCode('')
      }

      console.log(result)

    })
  }

  const checkValidation = () => {
    if (forgotEmail && status == 1) {
      onforgotSubmit()
    }
    if (verifyCode && status == 2) {
      onVerifyCodeSubmit()
    }
  }


  return (
    <div className="flex flex-col justify-center w-full mb-16" style={{ padding: 10, justifyContent: "center", alignItems: 'center' }} >

      <Typography style={{ fontWeight: 'bold', fontSize: 20 }}>Forgot Password?</Typography>
      {
        status == 1 ?
          <>
            <Typography>Enter your registered email below </Typography>
            <Typography>to receive password reset instruction</Typography>
          </>
          : status == 2 ?
            <Typography>Check Your Email</Typography>
            : <Typography>Enter New Password</Typography>
      }


      <div className="flex flex-col w-full mb-16 justify-center" style={{ padding: 10 }} >

        {
          status == 1 ?

            <TextField
              // {...field}
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.currentTarget.value)}
              className="mb-16"
              type="text"
              error={!!errors.forgotEmail}
              // helperText={errors?.forgotEmail?.message}
              label={'Email'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon className="text-20" color="action">
                      email
                    </Icon>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            : status == 2 ?

              <TextField
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.currentTarget.value)}
                className="mb-16"
                type="text"
                // error={!!errors.verifyCode}
                // helperText={errors?.verifyCode?.message}
                label={'Verify Code'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="text-20" color="action">
                        email
                      </Icon>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

              :
              <TextField
                className="mb-16"
                type="text"
                // error={!!errors.verifyCode}
                // helperText={errors?.verifyCode?.message}
                label={'Verify Code'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon className="text-20" color="action">
                        email
                      </Icon>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />

        }
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto mt-16"
          aria-label="LOG IN"
          // disabled={_.isEmpty(dirtyFields) || !isValid}
          value="legacy"
          onClick={checkValidation}
        >
          Submit
        </Button>
      </div>

    </div>
  );
}

export default ForgotPass;
