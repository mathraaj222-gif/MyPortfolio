import { X, Clock, Trash2, ChevronRight, MessageSquareCode } from 'lucide-react';
import { useAiGuide } from '../context/AiGuideContext';

export default function AiChatHistoryDrawer() {
  const {
    isHistoryOpen,
    toggleHistoryDrawer,
    history,
    selectHistoryItem,
    clearHistory,
    currentQuery,
  } = useAiGuide();

  if (!isHistoryOpen) return null;

  return (
    <div className="ai-history-overlay" onClick={toggleHistoryDrawer}>
      <aside
        className="ai-history-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Conversation History"
      >
        {/* Drawer Header */}
        <div className="ai-history-header">
          <div className="ai-history-title-wrap">
            <Clock size={18} className="ai-history-icon" />
            <h3 className="ai-history-title">Query History</h3>
            <span className="ai-history-count">{history.length}</span>
          </div>
          <button
            onClick={toggleHistoryDrawer}
            className="ai-history-close-btn"
            aria-label="Close History"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="ai-history-body">
          {history.length === 0 ? (
            <div className="ai-history-empty">
              <MessageSquareCode size={36} className="empty-icon" />
              <p>No queries yet in this session.</p>
              <span>Ask the AI guide anything about projects, fintech, skills, or experience!</span>
            </div>
          ) : (
            <div className="ai-history-list">
              {history.map((item) => {
                const isSelected = item.query.toLowerCase() === currentQuery.toLowerCase();
                return (
                  <button
                    key={item.id}
                    className={`ai-history-item ${isSelected ? 'active' : ''}`}
                    onClick={() => selectHistoryItem(item.id)}
                  >
                    <div className="ai-history-item-top">
                      <span className="ai-history-item-query">"{item.query}"</span>
                      <span className="ai-history-item-time">{item.timestamp}</span>
                    </div>
                    {item.summary && (
                      <p className="ai-history-item-summary">{item.summary}</p>
                    )}
                    <div className="ai-history-item-action">
                      <span>View GenUI</span>
                      <ChevronRight size={14} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {history.length > 0 && (
          <div className="ai-history-footer">
            <button onClick={clearHistory} className="ai-history-clear-btn">
              <Trash2 size={14} />
              <span>Clear Session History</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
