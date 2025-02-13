
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink?: string;
  pagemap?: {
    metatags?: any[];
    cse_thumbnail?: any[];
    cse_image?: any[];
  };
}

interface SearchResponse {
  results: SearchResult[];
  metadata: {
    searchTime: number;
    totalResults: string;
    formattedSearchTime: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')
    const SEARCH_ENGINE_ID = '16f0db6c184454111'

    if (!query) {
      throw new Error('Query parameter is required')
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`
    
    console.log('Fetching search results for query:', query)
    const startTime = performance.now()
    const response = await fetch(url)
    const data = await response.json()
    const endTime = performance.now()

    if (!response.ok) {
      console.error('Google API error:', data)
      throw new Error('Failed to fetch search results')
    }

    const results: SearchResult[] = data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
      pagemap: item.pagemap
    })) || []

    const searchResponse: SearchResponse = {
      results,
      metadata: {
        searchTime: data.searchInformation.searchTime,
        totalResults: data.searchInformation.formattedTotalResults,
        formattedSearchTime: data.searchInformation.formattedSearchTime
      }
    }

    console.log(`Found ${results.length} results in ${searchResponse.metadata.formattedSearchTime} seconds`)
    
    return new Response(
      JSON.stringify(searchResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
