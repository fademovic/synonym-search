import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useSynonymRequests = (word) => {
  const getSynonyms = async () => {
    if (word) {
      const response = await axios.get(
        `https://localhost:7032/api/SynonymSearch/${word}`
      );
      return response.data;
    }
  };

  const addWord = async (wordRequest) => {
    await axios.post(
      `https://localhost:7032/api/SynonymSearch/add-word`,
      wordRequest
    );
  };

  const addSynonym = async ({ word, synonym }) => {
    await axios.post(
      `https://localhost:7032/api/SynonymSearch/add-synonym?word=${word}&synonym=${synonym}`
    );
    refetch();
  };

  const {
    isLoading: isLoadingSynonyms,
    data: synonyms,
    refetch,
  } = useQuery(["synonyms", word], getSynonyms);

  const {
    mutate: addWordWithSynonyms,
    isLoading: isAddingWord,
    isSuccess: isWordAddedSuccessfully,
  } = useMutation(addWord);

  const {
    mutate: addSynonymForWord,
    isLoading: isAddingSynonym,
    isSuccess: isSynonymAddedSuccessfully,
  } = useMutation(addSynonym);

  return {
    ADD_SYNONYM: {
      addSynonymForWord,
      isAddingSynonym,
      isSynonymAddedSuccessfully,
    },
    ADD_WORD: {
      addWordWithSynonyms,
      isAddingWord,
      isWordAddedSuccessfully,
    },
    GET_SYNONYMS: {
      synonyms,
      isLoadingSynonyms,
    },
  };
};
