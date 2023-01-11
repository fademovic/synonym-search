namespace SynonymSearchServer.Common.Interfaces
{
    public interface ISynonymSearchService
    {
        Task<bool> AddWord(string word, List<string> synonyms_list);
        Task<bool> AddSynonym(string word, string synonym);
        List<string> GetSynonyms(string word);
    }
}
