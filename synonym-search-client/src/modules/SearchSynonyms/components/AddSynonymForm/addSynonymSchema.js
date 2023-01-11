import { object, string } from "yup";

export const ADD_SYNONYM_SCHEMA = object().shape({
  word: string().required("Required"),
  synonym: string().required("Required"),
});
