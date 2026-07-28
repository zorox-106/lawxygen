import { useState, useEffect, useCallback } from 'react';
import { SearchResult } from '@/lib/corpus';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('cheque bounce penalty section 138');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [citedSummary, setCitedSummary] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');

  const handleSearch = useCallback(async (queryToSearch?: string) => {
    const q = queryToSearch !== undefined ? queryToSearch : searchQuery;
    if (!q.trim()) return;
    setIsSearching(true);
    setSearchError('');
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, category: categoryFilter })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      if (data.results) {
        setSearchResults(data.results);
        setCitedSummary(data.citedSummary);
      }
    } catch (err: any) {
      setSearchError(err.message || 'Search execution failed');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, categoryFilter]);

  useEffect(() => {
    handleSearch('cheque bounce penalty section 138');
  }, [handleSearch]);

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    isSearching,
    searchResults,
    citedSummary,
    searchError,
    handleSearch,
  };
}
