import { TOOLS } from '../../lib/elementLibrary';

export default function Toolbar({ activeTool, onToolClick }) {
  return (
    <div className="toolbar">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          className={`toolbar-btn ${activeTool === tool.id ? 'active' : ''}`}
          title={tool.label}
          onClick={() => onToolClick(tool)}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}
