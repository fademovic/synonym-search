import React from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { Copyright } from "components";
import {
  GET_STARTED_TEXT,
  WELCOME_TEXT,
} from "modules/Welcome/utils/constants";
import { PATHS, WELCOME_BACKGROUND } from "utils/constants";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <BackgroundContainer item xs={false} sm={4} md={7} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6}>
        <MessageContainer>
          <Typography align="center" component="h1" variant="h5">
            {WELCOME_TEXT}
          </Typography>
          <ButtonContainer>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(PATHS.SEARCH_TOOL)}
            >
              {GET_STARTED_TEXT}
            </Button>
          </ButtonContainer>
          <Copyright />
        </MessageContainer>
      </Grid>
    </Grid>
  );
}

const BackgroundContainer = styled(Grid)`
  background-image: url(${WELCOME_BACKGROUND});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-color: #f8f8f8;
`;

const MessageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 50px;
`;

const ButtonContainer = styled(Box)`
  margin: 50px;
`;
