import React from "react";
import { Formik, Form, FieldArray } from "formik";
import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { ADD_WORD_SCHEMA } from "modules/SearchSynonyms/components/AddWordForm/addWordSchema";
import {
  ADD_SYNONYM,
  ADD_WORD,
  ADD_WORD_SUCCESS,
  ADD_WORD_TITLE,
  CANCEL_TEXT,
  ERROR_MESSAGE,
} from "modules/SearchSynonyms/utils/constants";
import { Snackbar } from "components";
import { useSynonymRequests } from "modules/SearchSynonyms/hooks/useSynonymRequests";

export const AddWordForm = ({ close, open }) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const {
    ADD_WORD: {
      addWordWithSynonyms,
      isAddingWord,
      isWordAddedSuccessfully,
      isErrorAddingWord,
    },
  } = useSynonymRequests();

  const onSubmit = (values, { setSubmitting }) => {
    addWordWithSynonyms(values);
    setSubmitting(false);
    close();
  };

  React.useEffect(() => {
    if (isWordAddedSuccessfully || isErrorAddingWord) {
      setOpenSnackbar(true);
    }
  }, [isWordAddedSuccessfully, isErrorAddingWord, setOpenSnackbar]);

  return (
    <>
      <Dialog onClose={close} open={open} fullWidth maxWidth="sm">
        <DialogTitle>{ADD_WORD_TITLE}</DialogTitle>
        <Formik
          initialValues={{ word: "", synonyms: [] }}
          validationSchema={ADD_WORD_SCHEMA}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, values, handleChange, touched, errors }) => (
            <FormContainer>
              <TextField
                label="Word"
                name="word"
                value={values.word}
                onChange={handleChange}
                error={touched.word && Boolean(errors.word)}
                helperText={touched.word && errors.word}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <br />
              <FieldArray name="synonyms">
                {(arrayHelpers) => (
                  <>
                    {values.synonyms.map((synonym, index) => (
                      <Grid
                        container
                        key={index}
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                      >
                        <Grid item xs={11}>
                          <TextField
                            label={`Synonym ${index + 1}`}
                            name={`synonyms.${index}`}
                            variant="outlined"
                            margin="normal"
                            value={synonym}
                            onChange={handleChange}
                            error={synonym === ""}
                            helperText={synonym === "" && "Required"}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            aria-label="delete"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <Button type="button" onClick={() => arrayHelpers.push("")}>
                      {ADD_SYNONYM}
                    </Button>
                  </>
                )}
              </FieldArray>
              <DialogActions>
                <Button onClick={close}>{CANCEL_TEXT}</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isAddingWord || isSubmitting}
                >
                  {ADD_WORD}
                </Button>
              </DialogActions>
            </FormContainer>
          )}
        </Formik>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        close={() => setOpenSnackbar(false)}
        message={isWordAddedSuccessfully ? ADD_WORD_SUCCESS : ERROR_MESSAGE}
        type={isWordAddedSuccessfully ? "success" : "error"}
      />
    </>
  );
};

const FormContainer = styled(Form)`
  padding: 24px;
`;
