using SynonymSearchServer.Common.Dto;
using SynonymSearchServer.Common.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace SynonymSearchServer.Services
{
    public class SynonymSearchService : ISynonymSearchService
    {
        private IMemoryCache cache;
        private HttpClient client;
        private readonly ILogger<SynonymSearchService> logger;


        public SynonymSearchService(IMemoryCache cache, ILogger<SynonymSearchService> logger)
        {
            this.cache = cache;
            this.logger = logger;
            client = new HttpClient();
        }

        public async Task<bool> AddWord(string word, List<string> synonyms_list)
        {
            try
            {
                // validate synonyms
                foreach (var synonym in synonyms_list)
                {
                    if (!await IsSynonym(word, synonym))
                    {
                        logger.LogError("Error, word {Word} is not synonym with {Synonym}", word, synonym);
                        return false;
                    }
                }

                // get synonyms dictionary from cache
                var synonyms = cache.Get<Dictionary<string, List<string>>>("synonyms");

                if (synonyms == null)
                {
                    // create new dictionary if cache is empty
                    synonyms = new Dictionary<string, List<string>>();
                }

                // when word exist synonym should be added through AddSynonym method
                if (synonyms.ContainsKey(word))
                {
                    logger.LogError("Error, word {Word} already exists", word);
                    return false;
                }

                synonyms[word] = synonyms_list;
                cache.Set("synonyms", synonyms, TimeSpan.FromMinutes(30));

                foreach (var synonym in synonyms_list.ToList())
                {
                    UpdateSynonyms(synonym, word);
                }

                logger.LogInformation("Successfully added word {Word} with synonyms {Synonyms}", word, synonyms_list);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error adding word {Word} with synonyms {Synonyms}", word, synonyms_list);
                return false;
            }
        }

        public async Task<bool> AddSynonym(string word, string synonym)
        {
            try
            {
                var synonyms = cache.Get<Dictionary<string, List<string>>>("synonyms");

                // can not add synonym if word doesn't exist
                // in that case AddWord method is correct way to add synonym for a word 
                if (synonyms == null || !synonyms.ContainsKey(word))
                {
                    logger.LogError("Error adding synonym {Synonym}, word {Word} doesn't exist", synonym, word);
                    return false;
                }

                var synonymsforWord = GetSynonyms(word);

                // if synonym already exists there is no point of adding it again
                if (synonymsforWord.Count > 0 && synonymsforWord.Contains(synonym))
                {
                    logger.LogError("Error, synonym {Synonym} for word {Word} already exist", synonym, word);
                    return false;
                }

                // validate synonyms
                if (!await IsSynonym(word, synonym))
                {
                    logger.LogError("Error, word {Word} is not synonym with {Synonym}", word, synonym);
                    return false;
                }

                // add new synonym for other values which are synonyms of word
                foreach (var value in synonymsforWord)
                {
                    synonyms[value].Add(synonym);
                }

                // add new synonym for a word
                synonyms[word].Add(synonym);

                // Update synonyms for new synonym
                UpdateSynonyms(synonym, word);

                logger.LogInformation("Successfully added synonym {Synonym} for word {Word}", synonym, word);
                return true;

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error adding synonym {Synonym} with word {Word}", synonym, word);
                return false;
            }
        }

        public List<string> GetSynonyms(string word)
        {
            try
            {
                var synonyms = cache.Get<Dictionary<string, List<string>>>("synonyms");

                if (synonyms!= null && synonyms.ContainsKey(word))
                {
                    return synonyms[word];
                }

                return new List<string>();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting synonyms for word {Word}", word);
                return new List<string>();
            }

        }

        private (List<string> synonymsforWord, List<string> synonymsforSynonym) GetExistingSynonyms(string word, string synonym)
        {
            // get existing synonyms for both word and synonym
            var synonymsforWord = GetSynonyms(word);
            var synonymsforSynonym = GetSynonyms(synonym);
            return (synonymsforWord, synonymsforSynonym);
        }

        private void UpdateSyonymsForSynonym (Dictionary<string, List<string>> synonyms, List<string> synonymsforSynonym, string word)
        {
            if (synonymsforSynonym.Count > 0)
            {
                foreach (var value in synonymsforSynonym)
                {
                    if (value != word)
                    {
                        synonyms[value].Add(word);
                        synonyms[word].Add(value);
                    }
                }
            }
        }

        private void AddWordToSynonym(Dictionary<string, List<string>> synonyms, string word, string synonym)
        {
            // making sure that lookup work in both directions 
            if (synonyms.ContainsKey(synonym))
            {
                synonyms[synonym].Add(word);
            }
            else
            {
                synonyms[synonym] = new List<string> { word };
            }
        }

        private void UpdateSynonyms(string synonym, string word)
        {
            try
            {
                // get existing synonyms for both word and synonym
                var(synonymsforWord, synonymsforSynonym) = GetExistingSynonyms(word, synonym);
                var synonyms = cache.Get<Dictionary<string, List<string>>>("synonyms");

                UpdateSyonymsForSynonym(synonyms, synonymsforSynonym, word);

                if (synonymsforWord.Count > 0)
                {
                    AddWordToSynonym(synonyms, word, synonym);

                    // add the rest of the values from the "word" synonyms to the "synonym" synonyms
                    foreach (var value in synonymsforWord)
                    {
                        if (value != synonym && !synonymsforSynonym.Contains(value))
                        {
                            synonyms[synonym].Add(value);

                        }
                    }
                }
            }

            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating word {Word} with synonyms {Synonyms}", word, synonym);
            }

        }

        private bool AreSynonyms(List<DatamuseWord>? words)
        {
            if (words == null)
            {
                return false;
            }

            return words.Count > 0;
        }

        private async Task<bool> IsSynonym(string word1, string word2)
        {
            var response = await client.GetAsync($"https://api.datamuse.com/words?rel_syn={word1}&ml={word2}");

            if (!response.IsSuccessStatusCode)
            {
                return false;
            }

            var json = await response.Content.ReadAsStringAsync();
            var words = JsonConvert.DeserializeObject<List<DatamuseWord>>(json);

            return AreSynonyms(words);
        }
    }
}
