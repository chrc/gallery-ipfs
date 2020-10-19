import React from 'react';

import {
  Button as MuiButton,
  FormHelperText, Grid,
  makeStyles,
} from '@material-ui/core';

import Warning from '@material-ui/icons/Warning';

const useStyles = makeStyles({
  label: {
    textTransform: 'none',
  },
  errorDisplay: (props) => ({
    display: props.errorDisplay,
  }),
  warning: {
    color: 'error',
    'margin-right': 5,
    'vertical-align': 'bottom',
  },
});

export default function FileButton(props) {
  const {
    name, label,
    size, color, variant,
    error = null,
    onChange, ...other
  } = props;

  const errorDisplay = error ? 'block' : 'none';
  const classes = useStyles({ errorDisplay });

  return (
    <Grid container>
      <Grid item xs={12}>
        <label htmlFor={name}>
          <input
            id={name}
            name={name}
            type="file"
            onChange={onChange}
            style={{ display: 'none' }}
          />
          <MuiButton
            variant={variant || 'contained'}
            color={color || 'secondary'}
            size={size || 'large'}
            component="span"
            {...other}
            classes={{ root: classes.root, label: classes.label }}
          >
            { label || 'Choose a file' }
          </MuiButton>
          {' '}
        </label>
      </Grid>

      <Grid item xs={12} className={classes.errorDisplay}>
        <FormHelperText error>
          <Warning color="error" className={classes.warning} />
          <span>{error}</span>
        </FormHelperText>
      </Grid>
    </Grid>
  );
}
