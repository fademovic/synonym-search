using System.ComponentModel.DataAnnotations;

namespace SynonymSearchServer.Common.Dto
{
    public class AddWord
    {
        [Required]
        public string Word { get; set; }
        [Required]
        public List<string> Synonyms { get; set; }
    }
}
