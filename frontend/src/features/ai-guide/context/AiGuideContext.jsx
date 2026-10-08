import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { queryAiGuide } from '../services/aiGuideService';

const AiGuideContext = createContext(null);

const STORAGE_KEY_HISTORY = 'portfolio_ai_guide_history';

export function AiGuideProvider({ children, portfolioData }) {
  const [activeMode, setActiveMode] = useState('static'); // 'static' | 'genui'
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [guideData, setGuideData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeCitationId, setActiveCitationId] = useState(null);

  // Load history from session/local storage
  const [history, setHistory] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync history to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // ignore in restricted env
    }
  }, [history]);

  // Main ask function
  const askGuide = useCallback(async (queryText) => {
    const trimmed = queryText?.trim();
    if (!trimmed) return;

    setCurrentQuery(trimmed);
    setIsLoading(true);
    setError(null);
    setActiveMode('genui');
    setIsMinimized(false);
    setIsHistoryOpen(false);

    try {
      const result = await queryAiGuide(trimmed, portfolioData);
      setGuideData(result);

      // Add to session history
      setHistory((prev) => {
        const item = {
          id: `hist-${Date.now()}`,
          query: trimmed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          summary: result.summary || trimmed,
          data: result,
        };
        // Avoid duplicate identical consecutive queries
        if (prev.length > 0 && prev[0].query.toLowerCase() === trimmed.toLowerCase()) {
          return [item, ...prev.slice(1)];
        }
        return [item, ...prev].slice(0, 20); // Keep last 20
      });
    } catch (err) {
      console.error('AI Guide Error:', err);
      setError('Could not connect to AI guide. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [portfolioData]);

  // Restore a previous query from history
  const selectHistoryItem = useCallback((historyId) => {
    const item = history.find((h) => h.id === historyId);
    if (item) {
      setCurrentQuery(item.query);
      setGuideData(item.data);
      setActiveMode('genui');
      setIsMinimized(false);
      setIsHistoryOpen(false);
      setError(null);
    }
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // ignore
    }
  }, []);

  const exitGuide = useCallback(() => {
    setActiveMode('static');
    setIsMinimized(false);
    setIsHistoryOpen(false);
  }, []);

  const enterGenUI = useCallback(() => {
    setActiveMode('genui');
    setIsMinimized(false);
    setIsHistoryOpen(false);
  }, []);

  const minimizeGuide = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const restoreGuide = useCallback(() => {
    setIsMinimized(false);
    setActiveMode('genui');
  }, []);

  const toggleHistoryDrawer = useCallback(() => {
    setIsHistoryOpen((prev) => !prev);
  }, []);

  const highlightCitation = useCallback((citationId) => {
    setActiveCitationId(citationId);
    // Auto-clear highlight after 3 seconds
    setTimeout(() => {
      setActiveCitationId((curr) => (curr === citationId ? null : curr));
    }, 3000);
  }, []);

  return (
    <AiGuideContext.Provider
      value={{
        activeMode,
        isMinimized,
        currentQuery,
        guideData,
        isLoading,
        error,
        history,
        isHistoryOpen,
        activeCitationId,
        askGuide,
        selectHistoryItem,
        clearHistory,
        exitGuide,
        enterGenUI,
        minimizeGuide,
        restoreGuide,
        toggleHistoryDrawer,
        highlightCitation,
      }}
    >
      {children}
    </AiGuideContext.Provider>
  );
}

export function useAiGuide() {
  const context = useContext(AiGuideContext);
  if (!context) {
    throw new Error('useAiGuide must be used within an AiGuideProvider');
  }
  return context;
}
