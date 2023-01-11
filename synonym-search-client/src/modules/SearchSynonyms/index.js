import React from "react";
import { styled } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

import {
  AddSynonymForm,
  AddWordForm,
  WordCard,
} from "modules/SearchSynonyms/components";
import { LOADING_SYNONYMS } from "modules/SearchSynonyms/utils/constants";
import { Navbar } from "components";
import { useDebounce } from "hooks/useDebounce";
import { useSynonymRequests } from "modules/SearchSynonyms/hooks/useSynonymRequests";

const SearchSynonyms = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [openAddWordDialog, setOpenAddWordDialog] = React.useState(false);
  const [openAddSynonymDialog, setOpenAddSynonymDialog] = React.useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm);
  const {
    GET_SYNONYMS: { synonyms, isLoadingSynonyms },
  } = useSynonymRequests(debouncedSearchTerm);

  const showLoadingMessage = searchTerm !== "" && isLoadingSynonyms;

  const closeAddWordDialog = () => {
    setOpenAddWordDialog(false);
  };

  const closeAddSynonymDialog = () => {
    setOpenAddSynonymDialog(false);
  };

  return (
    <div>
      <Navbar setSearchTerm={setSearchTerm} />
      <Main>
        {showLoadingMessage ? (
          <p>{LOADING_SYNONYMS}</p>
        ) : (
          synonyms && (
            <WordCard
              word={debouncedSearchTerm}
              synonyms={synonyms}
              onClick={() => setOpenAddSynonymDialog(true)}
            />
          )
        )}
      </Main>
      <AddSynonymForm
        close={closeAddSynonymDialog}
        open={openAddSynonymDialog}
        word={debouncedSearchTerm}
      />
      <AddWordForm close={closeAddWordDialog} open={openAddWordDialog} />
      <FabContainer>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenAddWordDialog(true)}
        >
          <AddIcon />
        </Fab>
      </FabContainer>
    </div>
  );
};

export default SearchSynonyms;

const FabContainer = styled(Box)`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

const Main = styled(Box)`
  padding: 24px;
`;
