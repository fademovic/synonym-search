import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SearchSynonyms from "modules/SearchSynonyms";
import Welcome from "modules/Welcome";
import { PATHS } from "utils/constants";

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path={PATHS.SEARCH_TOOL} element={<SearchSynonyms />} />
        <Route path={PATHS.WELCOME} element={<Welcome />} />
        <Route path={PATHS.ROOT} element={<Welcome />} />
      </Routes>
    </Router>
  );
};

export default Root;
