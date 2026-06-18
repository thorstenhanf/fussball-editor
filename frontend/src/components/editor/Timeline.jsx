// Einfache Keyframe-Timeline am unteren Rand des Editors.
// Jeder Keyframe speichert die Positionen aller Objekte zu diesem Zeitpunkt;
// zwischen zwei Keyframes interpoliert der Player später linear (Tweening),
// um die Lauf-/Passbewegungen zu animieren.

export default function Timeline({ keyframes, activeIndex, onSelect, onAddKeyframe, onDeleteKeyframe, onPlay, isPlaying }) {
  return (
    <div className="timeline">
      <button className="timeline-play" onClick={onPlay}>
        {isPlaying ? '⏸ Pause' : '▶ Abspielen'}
      </button>

      <div className="timeline-track">
        {keyframes.map((kf, i) => (
          <div key={kf.id} className="timeline-frame-wrapper">
            <button
              className={`timeline-frame ${i === activeIndex ? 'active' : ''}`}
              onClick={() => onSelect(i)}
              title={`Keyframe ${i + 1}`}
            >
              {i + 1}
            </button>
            {keyframes.length > 1 && (
              <button
                className="timeline-frame-delete"
                onClick={() => onDeleteKeyframe(i)}
                title="Keyframe löschen"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button className="timeline-add" onClick={onAddKeyframe} title="Neuen Keyframe hinzufügen">
          + Keyframe
        </button>
      </div>
    </div>
  );
}
