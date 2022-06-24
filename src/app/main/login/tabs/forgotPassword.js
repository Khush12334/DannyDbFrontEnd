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

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  forgotEmail: yup.string().required('You must enter a email')
});

const defaultValues = {
  forgotEmail: ''
};

function ForgotPass(props) {
  const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [forgotShow, setForgotShow] = useState(false)

  useEffect(() => {
    setValue('forgotEmail', '', { shouldDirty: true, shouldValidate: true });
  }, [reset, setValue, trigger]);

  function onforgotSubmit(model) {
    let formdata = new FormData();
    formdata.append("email", model.forgotEmail)
    axios.post("https://dannydb.wirelesswavestx.com/forgotpassword", {
      "email": model.forgotEmail
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(result => {

      console.log(result)
    })
  }


  return (
    <div className="flex flex-col justify-center w-full mb-16" style={{ padding: 10, justifyContent: "center", alignItems: 'center' }} >

      <Typography style={{ fontWeight: 'bold', fontSize: 20 }}>Forgot Password?</Typography>
      <Typography>Enter your registered email below </Typography>
      <Typography>to receive password reset instruction</Typography>

      <div className="w-full mb-16" style={{ padding: 10 }} onSubmit={handleSubmit(onforgotSubmit)}>
        <form className="flex flex-col justify-center w-full" >
          <Controller
            name="forgotEmail"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-16"
                type="text"
                error={!!errors.forgotEmail}
                helperText={errors?.forgotEmail?.message}
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
            )}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full mx-auto mt-16"
            aria-label="LOG IN"
            // disabled={_.isEmpty(dirtyFields) || !isValid}
            value="legacy"
          >
            Submit
          </Button>
        </form>
      </div>

    </div>
  );
}

export default ForgotPass;
