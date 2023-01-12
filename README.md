This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Important packages

- mui/material - for easier use of compnents and faster designing
- styled-components - for element styling
- react query with axios - for data fetching and updating
- formik - for easier form validation and data submiting 

## APP Demo

[Link](https://drive.google.com/file/d/1LVIDF_kGhompldJlnezUXxHMWHVLDCXB/view?usp=share_link)

## Important note

Datamuse API is used for words validation to be sure that entered words are really synonyms.
If words are not synonyms user will get error response. 

To check for each word a list of synonyms use:
https://api.datamuse.com/words?rel_syn=WORD

To check if two words are synonym and do they have common synonyms use:
https://api.datamuse.com/words?rel_syn=WORD1&ml=WORD2
