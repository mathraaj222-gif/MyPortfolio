import { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft, Loader2 } from 'lucide-react';
import { useAiGuide } from '../context/AiGuideContext';

const DEFAULT_SUGGESTIONS = [
  { label: 'Model Finetuning Experience', query: 'Do you know about Model Finetuning and LLM?' },
  { label: 'AWS & Cloud Work', query: 'Show me your cloud, AWS, and backend architectures' },
  { label: 'Full-Stack Projects', query: 'What are your top full-stack web applications?' },
  { label: 'Verified Credentials', query: 'Show all verified certifications and credentials' },
];

export default function AiGuideBar() {
  const [inputText, setInputText] = useState('');
  const { askGuide, isLoading } = useAiGuide();

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    askGuide(inputText);
    setInputText('');
  };

  const handleSuggestionClick = (query) => {
    if (isLoading) return;
    askGuide(query);
  };

  return (
    <div className="ai-guide-bar-wrapper">
      <div className="ai-guide-bar-card">
        {/* Glow backdrop */}
        <div className="ai-guide-glow"></div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="ai-guide-form">
          <div className="ai-guide-input-prefix">
            <Sparkles size={18} className="ai-sparkle-icon" />
          </div>

          <input
            type="text"
            className="ai-guide-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask my AI Guide anything (e.g. 'FinTech experience', 'React & AWS', 'Top projects')..."
            disabled={isLoading}
            aria-label="Ask AI Guide"
          />

          <button
            type="submit"
            className="ai-guide-submit-btn"
            disabled={!inputText.trim() || isLoading}
            aria-label="Submit question to AI Guide"
          >
            {isLoading ? (
              <Loader2 size={16} className="spinning-loader" />
            ) : (
              <>
                <span className="submit-label">Ask Guide</span>
                <ArrowRight size={14} className="submit-arrow" />
              </>
            )}
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="ai-guide-suggestions">
          <span className="suggestions-prefix">Try asking:</span>
          <div className="suggestions-chips-row">
            {DEFAULT_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="ai-chip-btn"
                onClick={() => handleSuggestionClick(item.query)}
                disabled={isLoading}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
