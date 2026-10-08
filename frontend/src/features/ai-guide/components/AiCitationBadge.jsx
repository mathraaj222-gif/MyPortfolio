import { Award, Briefcase, Code, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { useAiGuide } from '../context/AiGuideContext';

export default function AiCitationBadge({ citation, index }) {
  const { highlightCitation, activeCitationId } = useAiGuide();

  const getIcon = () => {
    switch (citation.type) {
      case 'certificate':
        return <Award size={14} className="citation-icon cert" />;
      case 'project':
        return <Code size={14} className="citation-icon proj" />;
      case 'experience':
        return <Briefcase size={14} className="citation-icon exp" />;
      case 'resume':
        return <FileText size={14} className="citation-icon resume" />;
      default:
        return <CheckCircle2 size={14} className="citation-icon default" />;
    }
  };

  const handleClick = (e) => {
    if (citation.targetId) {
      highlightCitation(citation.id);
      const element = document.getElementById(`genui-item-${citation.type}-${citation.targetId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const isActive = activeCitationId === citation.id;

  return (
    <div
      className={`ai-citation-badge ${isActive ? 'active' : ''} ${citation.targetId ? 'clickable' : ''}`}
      onClick={handleClick}
      title={citation.targetId ? 'Click to highlight evidence on canvas' : citation.title}
    >
      <div className="ai-citation-header">
        <span className="ai-citation-index">[{index + 1}]</span>
        {getIcon()}
        <span className="ai-citation-title">{citation.title}</span>
      </div>

      <div className="ai-citation-footer">
        <span className="ai-citation-ref">{citation.reference}</span>
        {citation.link && (
          <a
            href={citation.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ai-citation-link"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open link for ${citation.title}`}
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
