import { Sparkles, Maximize2 } from 'lucide-react';
import { useAiGuide } from '../context/AiGuideContext';

export default function AiFloatingTrigger() {
  const { isMinimized, restoreGuide, currentQuery, history } = useAiGuide();

  if (!isMinimized) return null;

  return (
    <div className="ai-floating-trigger-wrapper">
      <button
        onClick={restoreGuide}
        className="ai-floating-trigger-btn"
        title="Restore AI Guide GenUI canvas"
        aria-label="Restore AI Guide"
      >
        <div className="ai-trigger-icon-wrap">
          <Sparkles size={18} className="ai-trigger-sparkle" />
          <span className="ai-trigger-pulse"></span>
        </div>

        <div className="ai-trigger-info">
          <span className="ai-trigger-title">AI Guide Active</span>
          {currentQuery && (
            <span className="ai-trigger-query">"{currentQuery}"</span>
          )}
        </div>

        <div className="ai-trigger-badge">
          <span>{history.length}</span>
          <Maximize2 size={12} className="ai-trigger-max-icon" />
        </div>
      </button>
    </div>
  );
}
