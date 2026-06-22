import { useMemo, useState } from 'react';
import { TOOLS } from '../../lib/elementLibrary';

export default function Toolbar({ activeTool, onToolClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const primaryMobileTools = useMemo(
    () => TOOLS.filter((tool) => ['select', 'player', 'equipment'].includes(tool.id)),
    []
  );
  const secondaryMobileTools = useMemo(
    () => TOOLS.filter((tool) => !['select', 'player', 'equipment'].includes(tool.id)),
    []
  );
  const mobileMenuActive = secondaryMobileTools.some((tool) => tool.id === activeTool);

  const handleToolSelect = (tool) => {
    onToolClick(tool);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="toolbar toolbar-desktop">
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

      <div className="toolbar toolbar-mobile">
        <div className="toolbar-mobile-grid">
          {primaryMobileTools.map((tool) => (
            <button
              key={tool.id}
              className={`toolbar-btn ${activeTool === tool.id ? 'active' : ''}`}
              title={tool.label}
              onClick={() => handleToolSelect(tool)}
            >
              {tool.label}
            </button>
          ))}

          <div className="toolbar-mobile-menu">
            <button
              className={`toolbar-btn toolbar-mobile-menu-toggle ${mobileMenuActive ? 'active' : ''}`}
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-expanded={mobileMenuOpen}
            >
              Mehr Werkzeuge
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="toolbar-mobile-dropdown">
            {secondaryMobileTools.map((tool) => (
              <button
                key={tool.id}
                className={`toolbar-mobile-item ${activeTool === tool.id ? 'active' : ''}`}
                type="button"
                onClick={() => handleToolSelect(tool)}
              >
                {tool.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
