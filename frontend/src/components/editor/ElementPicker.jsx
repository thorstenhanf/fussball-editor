import { PLAYER_GROUPS, EQUIPMENT_GROUPS } from '../../lib/elementLibrary';

export default function ElementPicker({ groupSet, onSelect, onClose }) {
  const groups = groupSet === 'players' ? PLAYER_GROUPS : EQUIPMENT_GROUPS;

  return (
    <div className="picker-overlay" role="dialog" aria-modal="true">
      <div className="picker-header">
        <h2>{groupSet === 'players' ? 'Spieler auswählen' : 'Material auswählen'}</h2>
        <button className="picker-close" onClick={onClose}>
          ✕ Schließen
        </button>
      </div>

      <div className="picker-body">
        {groups.map((g) => (
          <section key={g.group} className="picker-group">
            <h3>{g.group}</h3>
            <div className="picker-grid">
              {g.items.map((item) => (
                <button
                  key={item.id}
                  className="picker-card"
                  onClick={() => onSelect({ ...item, team: g.team })}
                >
                  <div className="picker-icon" aria-hidden="true">
                    {item.iconPath ? (
                      <img src={item.iconPath} alt={item.label} className="picker-icon-img" />
                    ) : (
                      item.label.slice(0, 1)
                    )}
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
