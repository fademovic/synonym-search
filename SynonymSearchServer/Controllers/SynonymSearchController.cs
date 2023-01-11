using Microsoft.AspNetCore.Mvc;
using SynonymSearchServer.Common.Dto;
using SynonymSearchServer.Common.Interfaces;

namespace SynonymSearchServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SynonymSearchController : ControllerBase
    {
        private readonly ISynonymSearchService synonymSearchService;

        public SynonymSearchController(ISynonymSearchService synonymSearchService)
        {
            this.synonymSearchService = synonymSearchService;
        }

        [HttpPost("add-word")]
        public async Task<ActionResult<bool>> AddWord([FromBody] AddWord request)
        {
            var result = await synonymSearchService.AddWord(request.Word, request.Synonyms);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpPost("add-synonym")]
        public async Task<ActionResult<bool>> AddSynonym(string word, string synonym)
        {
            var result = await synonymSearchService.AddSynonym(word, synonym);

            if (result)
            {
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet("{word}")]
        public ActionResult<List<string>> GetSynonyms(string word)
        {
            var synonyms = synonymSearchService.GetSynonyms(word);

            if (synonyms == null)
            {
                return NotFound();
            }

            return synonyms;
        }
    }
}
