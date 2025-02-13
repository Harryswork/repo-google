
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SearchBar from '../components/SearchBar';
import FormatToggle from '../components/FormatToggle';
import SearchResults from '../components/SearchResults';
import { toast } from '@/components/ui/use-toast';

interface SearchMetadata {
  searchTime: number;
  totalResults: string;
  formattedSearchTime: string;
}

const Index = () => {
  const [format, setFormat] = useState<'list' | 'preview'>('list');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState<SearchMetadata | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    try {
      const { data, error } = await supabase.functions.invoke('search', {
        body: { query }
      });

      if (error) {
        throw error;
      }

      setResults(data.results);
      setMetadata(data.metadata);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to fetch search results. Please try again.",
        variant: "destructive"
      });
      setResults([]);
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-center text-primary mb-12">
            Search Results Viewer
          </h1>
          
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {metadata && searchQuery && !isLoading && (
            <div className="text-sm text-gray-600 pl-2">
              About {metadata.totalResults} results ({metadata.formattedSearchTime} seconds)
            </div>
          )}
          
          <div className="flex justify-end">
            <FormatToggle format={format} onToggle={setFormat} />
          </div>
          
          <SearchResults
            results={results}
            format={format}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
