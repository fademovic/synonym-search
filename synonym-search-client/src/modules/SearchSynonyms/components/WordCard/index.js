import React from "react";
import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import {
  ADD_SYNONYM,
  ADD_SYNONYM_TOOLTIP,
  WORD_CARD_TITLE,
} from "modules/SearchSynonyms/utils/constants";

export const WordCard = ({ word, synonyms, onClick }) => (
  <CardContainer>
    <CardContent>
      <Typography color="text.secondary" gutterBottom>
        {WORD_CARD_TITLE}
      </Typography>
      <Typography variant="h5" component="div">
        {word}
      </Typography>
      <SynonymsContainer>
        {synonyms.map((synonym) => (
          <Typography key={synonym} color="text.secondary">
            {synonym}
            <BullContainer component="span">•</BullContainer>
          </Typography>
        ))}
      </SynonymsContainer>
    </CardContent>
    <CardActionsContainer>
      <Tooltip title={synonyms.length === 0 ? ADD_SYNONYM_TOOLTIP : ""}>
        <span>
          <Button
            size="small"
            variant="contained"
            color="info"
            onClick={onClick}
            disabled={synonyms.length === 0}
          >
            {ADD_SYNONYM}
          </Button>
        </span>
      </Tooltip>
    </CardActionsContainer>
  </CardContainer>
);

const BullContainer = styled(Box)`
  padding: 2px 4px 0 4px;
`;

const CardContainer = styled(Card)`
  min-wdith: 275px;
`;

const CardActionsContainer = styled(CardActions)`
  display: flex;
  justify-content: end;
`;

const SynonymsContainer = styled(Box)`
  display: flex;
`;
