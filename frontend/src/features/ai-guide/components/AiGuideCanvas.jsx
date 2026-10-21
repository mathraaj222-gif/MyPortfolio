import { History, Minimize2, Sparkles, HelpCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { LotusSpinner } from '../../portfolio/components/LotusLoader';
import { useAiGuide } from '../context/AiGuideContext';
import EditorialGrid from './EditorialGrid';
import AiChatHistoryDrawer from './AiChatHistoryDrawer';
import AiGuideBar from './AiGuideBar';

export default function AiGuideCanvas() {
  const {
    currentQuery,
    guideData,
    isLoading,
    error,
    exitGuide,
    minimizeGuide,
    toggleHistoryDrawer,
    history,
    askGuide,
  } = useAiGuide();

  return (
    <div className="ai-guide-canvas-wrapper">
      {/* Top Utility Bar */}
      <div className="ai-canvas-topbar">
        <div className="ai-canvas-topbar-left">
          <div className="ai-canvas-query-badge">
            <Sparkles size={13} className="sparkle-icon" />
            <span className="query-label">Inquiry:</span>
            <span className="query-text">"{currentQuery}"</span>
          </div>
        </div>

        <div className="ai-canvas-topbar-right">
          <button
            onClick={toggleHistoryDrawer}
            className="ai-canvas-tool-btn"
            title="View query history"
          >
            <History size={16} />
            <span>History ({history.length})</span>
          </button>
          <button
            onClick={minimizeGuide}
            className="ai-canvas-tool-btn"
            title="Minimize guide to floating badge"
          >
            <Minimize2 size={16} />
            <span>Minimize</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="ai-narrator-error" style={{ marginBottom: '1.5rem' }}>
          <p>{error}</p>
          <button onClick={() => askGuide(currentQuery)} className="ai-narrator-retry-btn">
            <RefreshCw size={13} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Main Editorial Canvas */}
      <main className="ai-editorial-main">
        {isLoading ? (
          <div className="editorial-loading-canvas">
            <div className="editorial-loading-content">
              {/* Lotus spinner replaces the old ArrowRightLeft icon */}
              <LotusSpinner size={80} className="lotus-loader-spin" />
              <div className="lotus-canvas-ring" />
              <h3 className="editorial-thinking-label">Thinking...</h3>
              <p className="editorial-thinking-sub">Retrieving your query...</p>
            </div>
          </div>
        ) : (
          <EditorialGrid genUi={guideData?.genUi} />
        )}
      </main>

      {/* Citations & Verified Proofs Footer Strip */}
      {!isLoading && guideData?.citations && guideData.citations.length > 0 && (
        <div className="editorial-citations-strip">
          <span className="citations-strip-label">VERIFIED PROOFS:</span>
          <div className="citations-strip-items">
            {guideData.citations.map((cite, cIdx) => (
              <a
                key={cite.id || cIdx}
                href={cite.link || '#'}
                target={cite.link ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`editorial-cite-pill ${cite.link ? 'has-link' : ''}`}
              >
                <span className="cite-index">[{cIdx + 1}]</span>
                <span className="cite-title">{cite.title}</span>
                {cite.reference && <span className="cite-ref">({cite.reference})</span>}
                {cite.link && <ExternalLink size={11} className="cite-link-icon" />}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up Suggestions Footer Bar */}
      {!isLoading && guideData?.suggestedQuestions && guideData.suggestedQuestions.length > 0 && (
        <div className="editorial-suggestions-strip">
          <div className="suggestions-strip-header">
            <HelpCircle size={14} />
            <span>SUGGESTED NEXT INQUIRIES:</span>
          </div>
          <div className="suggestions-strip-pills">
            {guideData.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                className="editorial-suggestion-btn"
                onClick={() => askGuide(q)}
              >
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ask Another Question Bar */}
      <div style={{ marginTop: '2rem' }}>
        <AiGuideBar />
      </div>

      {/* Slide-over Conversation History */}
      <AiChatHistoryDrawer />
    </div>
  );
}
