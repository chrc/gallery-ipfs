import React, { useContext } from 'react';

import { useSnackbar } from 'notistack';

import {
  Grid, Paper, TextField, Typography,
  makeStyles,
} from '@material-ui/core';

import { useForm, Form } from './useForm';
import Controls from './controls/Controls';

import BlockchainContext from '../context';
import { BlockchainUtils, IpfsClient } from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    margin: '80px auto',
  },
  paper: {
    padding: theme.spacing(4),
    fontSize: '1.5em',
  },
}));

const fileTypeItems = [
  { id: 'image', title: 'Image' },
  { id: 'video', title: 'Video' },
];

const initialFValues = {
  id: 0,
  mediaName: '',
  mediaTags: '',
  fileName: '',
  fileType: null,
  fileBuffer: null,
};

function AddMedia() {
  const { contracts, accounts } = useContext(BlockchainContext);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const validate = (fieldValues = values) => {
    const possibleErrors = { ...errors };

    if ('mediaName' in fieldValues) {
      possibleErrors.mediaName = fieldValues.mediaName ? '' : 'This field is required.';
    }
    if ('mediaTags' in fieldValues) {
      possibleErrors.mediaTags = fieldValues.mediaTags ? '' : 'This field is required.';
    }

    setErrors({ ...possibleErrors });

    if (fieldValues === values) {
      console.error(possibleErrors);
      return Object.values(possibleErrors).every((x) => x === '');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate() && values.fileBuffer) {
      try {
        const hash = await IpfsClient.saveMediaIntoIpfs(values);
        enqueueSnackbar(`Saved in IPFS with hash: ${hash}`, { variant: 'info' });

        BlockchainUtils.saveMediaIntoBlockchain({
          contracts,
          accounts,
          hash,
          values,
          closeSnackbar,
          enqueueSnackbar,
        });

        resetForm();
      } catch (error) {
        enqueueSnackbar('Something went wrong!', { variant: error });
        console.error(error);
      }
    }
  };

  const {
    values, errors, setErrors,
    handleInputChange, resetForm,
  } = useForm(initialFValues, true, validate);

  return (
    <div className={classes.root}>
      <Typography
        variant="h4"
        align="center"
        paragraph
        color="primary"
      >
        Add a new media
      </Typography>

      <Paper className={classes.paper}>
        <Form
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <Grid container spacing={4}>
            <Grid container item xs={6} spacing={2}>
              <Grid item xs={12}>
                <Controls.Input
                  name="mediaName"
                  label="Name of media"
                  value={values.mediaName}
                  onChange={handleInputChange}
                  error={errors.mediaName}
                />
              </Grid>
              <Grid item xs={12}>
                <Controls.Input
                  name="mediaTags"
                  label="List of tags (ex. blockchain,artist)"
                  value={values.mediaTags}
                  onChange={handleInputChange}
                  error={errors.mediaTags}
                />
              </Grid>
              <Grid item xs={12}>
                <Controls.FileButton
                  onChange={handleInputChange}
                  error={errors.fileType}
                />
              </Grid>
            </Grid>

            <Grid container item xs={6} spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  disabled
                  label="File name"
                  value={values.fileName}
                />
              </Grid>
              <Grid item xs={12}>
                <Controls.RadioGroup
                  disabled
                  name="fileType"
                  label="File type"
                  value={values.fileType}
                  items={fileTypeItems}
                />
              </Grid>
              <Grid item xs={12}>
                <Controls.Button type="submit" text="Upload to IPFS" />
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </div>

  );
}

export default AddMedia;
