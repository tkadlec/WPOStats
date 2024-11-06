export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const wantsJson = request.headers.get('Accept')?.includes('application/json');

    // Add these CORS headers to a constant for reuse
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    if (!query) {
      return new Response('Query parameter required', { 
        status: 400,
        headers: corsHeaders  // Add CORS headers to error response
      });
    }

    // Determine the base URL based on the environment
    const baseUrl = url.hostname === 'localhost' 
      ? 'http://localhost:8080'
      : 'https://wpostats.com';

    // Fetch the search index
    const response = await fetch(`${baseUrl}/search-index.json`);
    const searchIndex = await response.json();

    // Perform simple search
    const results = searchIndex.filter(item => {
      const searchContent = `${item.title} ${item.content}`.toLowerCase();
      return searchContent.includes(query.toLowerCase());
    });

    // Return JSON for API requests, HTML for direct visits
    if (wantsJson) {
      return new Response(JSON.stringify(results), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    // Return HTML for direct page visits
    const templateData = {
      searchParams: { q: query },
      results: results.map(result => ({
        title: result.title,
        storySource: result.url,
        permalink: result.url,
        tags: result.tags || [],
        img: result.img || null
      }))
    };
    // Fetch the results template
    const templateResponse = await fetch(`${baseUrl}/results`);
    let template = await templateResponse.text();

    // Simple template variable replacement
    template = template.replace('Search Results for: ', `Search Results for: "${templateData.searchParams.q}"`);
    
    // Replace the results loop
    const resultsHtml = templateData.results.map(result => `
      <li>
        <img src="/img/generic.png" alt="WPO Stats Icon" />
        <p>
          <a href="${result.storySource}">${result.title}</a>
          <small>
            <a href="${result.permalink}">Permalink</a>
            <a class="share-twitter" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(result.title)} https%3A%2F%2Fwpostats.com%2F${encodeURIComponent(result.permalink)}">Share on Twitter</a>
          </small>
        </p>
        <span class="tags">
          ${(result.tags || []).map(tag => `<a class="tag" href="/tags/${tag}">#${tag}</a>`).join(' ')}
        </span>
      </li>
    `).join('');

    template = template.replace('<ul class="slats">', `<ul class="slats">${resultsHtml}`);

    // Handle no results case
    if (templateData.results.length === 0) {
      template = template.replace('<ul class="slats">', `No results found for "${templateData.searchParams.q}" <ul class="slats">`);
    } else {
      // Remove the no-results section
      template = template.replace(/{% if results.length == 0 %}.*?{% endif %}/s, '');
    }
    console.log(template);
    return new Response(template, {
      headers: {
        'Content-Type': 'text/html',
        ...corsHeaders
      },
    });
  },
}; 