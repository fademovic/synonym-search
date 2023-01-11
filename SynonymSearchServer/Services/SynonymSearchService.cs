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
                // other solution can be either to override existing word or
                // to enable user to remove word/synonym but that is out of the scope of this task 
                if (synonyms.ContainsKey(word))
                {
                    logger.LogError("Error, word {Word} already exists", word);
                    return false;
                }
                else
                {
                    synonyms[word] = synonyms_list;
                    cache.Set("synonyms", synonyms, TimeSpan.FromMinutes(30));

                    // Update synonyms for other words in list
                    foreach (var synonym in synonyms_list)
                    {
                        UpdateSynonyms(synonym, word);
                    }
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

                if (synonyms == null)
                {
                    logger.LogError("Error, dictionary is empty");
                    return false;
                }

                // can not add synonym if word doesn't exist
                // in that case AddWord method is correct way to add synonym for a word 
                if (!synonyms.ContainsKey(word))
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
                cache.Set("synonyms", synonyms, TimeSpan.FromMinutes(30));

                // Update synonyms for new synonym
                UpdateSynonyms(synonym, word);

                logger.LogInformation("Successfully added synonym {Synonym} for word {Word}",synonym, word);
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

                if (synonyms == null)
                {
                    return new List<string>();
                }

                if (synonyms.ContainsKey(word))
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

        private void UpdateSynonyms(string synonym, string word)
        {
            try
            {
                // get existing synonyms for word
                var synonymsforWord = GetSynonyms(word);
                var synonyms = cache.Get<Dictionary<string, List<string>>>("synonyms");

                if (synonymsforWord.Count > 0)
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

                    // add rest of values from word synonyms to synonym
                    foreach (var value in synonymsforWord)
                    {
                        if(value != synonym)
                        {
                            synonyms[synonym].Add(value);
                        }
                    }
                }

                cache.Set("synonyms", synonyms, TimeSpan.FromMinutes(30));
            }

            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating word {Word} with synonyms {Synonyms}", word, synonym);
            }

        }

        private async Task<bool> IsSynonym(string word1, string word2)
        {
            var response = await client.GetAsync($"https://api.datamuse.com/words?rel_syn={word1}&ml={word2}");

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var words = JsonConvert.DeserializeObject<List<DatamuseWord>>(json);

                if (words == null)
                {
                    return false;
                }

                return words.Count > 0;
            }

            return false;
        }
    }
}
