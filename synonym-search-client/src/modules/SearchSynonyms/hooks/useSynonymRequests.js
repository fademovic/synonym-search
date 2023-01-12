import { useQuery, useMutation } from "@tanstack/react-query";

import API from "utils/axiosConfig";

export const useSynonymRequests = (word) => {
  const getSynonyms = async () => {
    if (!word) return [];

    const response = await API.get(`SynonymSearch/${word}`);
    return response.data;
  };

  const addWord = async (wordRequest) => {
    await API.post(`SynonymSearch/add-word`, wordRequest);
  };

  const addSynonym = async ({ word, synonym }) => {
    await API.post(`SynonymSearch/add-synonym?word=${word}&synonym=${synonym}`);
    refetch();
  };

  const {
    isLoading: isLoadingSynonyms,
    isError: isErrorGettingSynonyms,
    data: synonyms,
    refetch,
  } = useQuery(["synonyms", word], getSynonyms);

  const {
    mutate: addWordWithSynonyms,
    isLoading: isAddingWord,
    isSuccess: isWordAddedSuccessfully,
    isError: isErrorAddingWord,
  } = useMutation(addWord);

  const {
    mutate: addSynonymForWord,
    isLoading: isAddingSynonym,
    isSuccess: isSynonymAddedSuccessfully,
    isError: isErrorAddingSynonym,
  } = useMutation(addSynonym);

  return {
    ADD_SYNONYM: {
      addSynonymForWord,
      isAddingSynonym,
      isSynonymAddedSuccessfully,
      isErrorAddingSynonym,
    },
    ADD_WORD: {
      addWordWithSynonyms,
      isAddingWord,
      isWordAddedSuccessfully,
      isErrorAddingWord,
    },
    GET_SYNONYMS: {
      synonyms,
      isLoadingSynonyms,
      isErrorGettingSynonyms,
    },
  };
};
