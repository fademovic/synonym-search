using SynonymSearchServer.Common.Interfaces;
using SynonymSearchServer.Services;

namespace SynonymSearchServer.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddServiceMapping(this IServiceCollection services)
        {
            services.AddScoped<ISynonymSearchService, SynonymSearchService>();
            services.AddHttpContextAccessor();
        }
    }
}
