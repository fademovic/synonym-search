import { object, string } from "yup";

export const ADD_WORD_SCHEMA = object().shape({
  word: string().required("Required"),
});
