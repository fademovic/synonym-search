import React from "react";
import { Formik, Form } from "formik";
import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";

import { ADD_SYNONYM_SCHEMA } from "modules/SearchSynonyms/components/AddSynonymForm/addSynonymSchema";
import {
  ADD_SYNONYM,
  ADD_SYNONYM_SUCCESS,
  ADD_SYNONYM_TITLE,
  CANCEL_TEXT,
} from "modules/SearchSynonyms/utils/constants";
import { useSynonymRequests } from "modules/SearchSynonyms/hooks/useSynonymRequests";

export const AddSynonymForm = ({ close, open, word }) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const {
    ADD_SYNONYM: {
      addSynonymForWord,
      isAddingSynonym,
      isSynonymAddedSuccessfully,
    },
  } = useSynonymRequests(word);

  const onSubmit = (values, { setSubmitting }) => {
    addSynonymForWord(values);
    setSubmitting(false);
    close();
  };

  React.useEffect(() => {
    if (isSynonymAddedSuccessfully) {
      setOpenSnackbar(true);
    }
  }, [isSynonymAddedSuccessfully, setOpenSnackbar]);

  return (
    <>
      <Dialog onClose={close} open={open} fullWidth maxWidth="sm">
        <DialogTitle>{ADD_SYNONYM_TITLE}</DialogTitle>
        <Formik
          initialValues={{ word, synonym: "" }}
          validationSchema={ADD_SYNONYM_SCHEMA}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, values, handleChange, touched, errors }) => (
            <FormContainer>
              <TextField
                label="Word"
                name="word"
                value={values.word}
                disabled
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <br />
              <TextField
                label="Synonym"
                name="synonym"
                value={values.synonym}
                onChange={handleChange}
                error={touched.synonym && Boolean(errors.synonym)}
                helperText={touched.synonym && errors.synonym}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <DialogActions>
                <Button onClick={close}>{CANCEL_TEXT}</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isAddingSynonym || isSubmitting}
                >
                  {ADD_SYNONYM}
                </Button>
              </DialogActions>
            </FormContainer>
          )}
        </Formik>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={ADD_SYNONYM_SUCCESS}
      />
    </>
  );
};

const FormContainer = styled(Form)`
  padding: 24px;
`;
