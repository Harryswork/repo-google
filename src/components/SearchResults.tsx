
interface SearchResult {
  title: string;
  description: string;
  link: string;
  displayLink?: string;
  pagemap?: {
    metatags?: any[];
    cse_thumbnail?: any[];
    cse_image?: any[];
  };
}

interface SearchResultsProps {
  results: SearchResult[];
  format: 'list' | 'preview';
  isLoading: boolean;
}

const SearchResults = ({ results, format, isLoading }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="result-card space-y-3">
            <div className="loading-skeleton h-4 w-1/3 rounded" />
            <div className="loading-skeleton h-6 w-3/4 rounded" />
            <div className="loading-skeleton h-4 w-full rounded" />
            <div className="loading-skeleton h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const renderResult = (result: SearchResult, index: number) => {
    const displayUrl = result.displayLink || new URL(result.link).hostname;
    
    return (
      <div key={index} className="result-card space-y-2">
        <div className="flex items-center space-x-2">
          {result.pagemap?.cse_thumbnail?.[0] && (
            <img
              src={result.pagemap.cse_thumbnail[0].src}
              alt=""
              className="w-8 h-8 rounded object-cover"
            />
          )}
          <div>
            <div className="text-sm text-gray-600">
              {displayUrl}
            </div>
          </div>
        </div>
        
        <h2 className="text-xl text-blue-600 hover:underline">
          <a
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {result.title}
          </a>
        </h2>
        
        <p className="text-sm text-gray-700">{result.description}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {results.map((result, index) => renderResult(result, index))}
    </div>
  );
};

export default SearchResults;
