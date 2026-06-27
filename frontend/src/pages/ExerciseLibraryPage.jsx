import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { deleteExercise, listExercisesFiltered } from '../lib/exerciseApi';
import { mapSearchResultToExerciseTemplate, mapStoredExerciseToExerciseTemplate } from '../lib/exerciseTemplate';

const EXERCISE_SEARCH_API = 'https://b5zb58pdy4.execute-api.eu-north-1.amazonaws.com/prod/search';
const THUMBNAIL_BASE_URL = (import.meta.env.VITE_THUMBNAIL_BASE_URL || '').replace(/\/$/, '');

function formatPlayerCount(min, max) {
  if (Number.isFinite(min) && Number.isFinite(max)) {
    return min === max ? `${min} Spieler` : `${min}-${max} Spieler`;
  }
  if (Number.isFinite(min)) return `Ab ${min} Spielern`;
  if (Number.isFinite(max)) return `Bis ${max} Spieler`;
  return 'Keine Angabe';
}

function normalizeResults(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function formatExerciseDate(exercise) {
  // Externe/importierte Treffer und lokale Exercises nutzen aktuell
  // dieselbe Anzeige-Regel: created_at bevorzugen, sonst updated_at.
  const rawValue = exercise.created_at ?? exercise.updated_at ?? exercise.createdAt ?? exercise.updatedAt ?? '';
  if (!rawValue) return '';

  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getThumbnailUrl(exercise) {
  const directThumbnailUrl = exercise.thumbnail_url ?? exercise.thumbnailUrl ?? '';
  const thumbnailKey = exercise.thumbnail_key ?? exercise.thumbnailKey ?? '';

  if (directThumbnailUrl) return directThumbnailUrl;
  if (!thumbnailKey) return '';
  if (thumbnailKey.startsWith('http://') || thumbnailKey.startsWith('https://') || thumbnailKey.startsWith('/')) {
    return thumbnailKey;
  }

  if (!THUMBNAIL_BASE_URL) {
    return '';
  }

  return `${THUMBNAIL_BASE_URL}/${thumbnailKey.replace(/^\//, '')}`;
}

function normalizeLocalExercise(exercise) {
  const focus = Array.isArray(exercise.focus)
    ? exercise.focus
    : Array.isArray(exercise.choreography?.meta?.focus)
    ? exercise.choreography.meta.focus
    : [];

  return {
    ...exercise,
    resultType: 'local',
    sourceLabel: 'Eigene Übung',
    summary: exercise.description ?? '',
    focus,
    players_min: null,
    players_max: null,
  };
}

function normalizeExternalExercise(exercise) {
  // Externe Suchtreffer bleiben bewusst flach. Die Bibliothek braucht hier
  // nur genug Meta-Daten fuer Kartenansicht und Editor-Handoff.
  return {
    ...exercise,
    resultType: 'external',
    sourceLabel: 'Importiert',
  };
}

export default function ExerciseLibraryPage({ onOpenInEditor = () => {} }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError('');

    listExercisesFiltered({ search: initialQuery })
      .then((data) => setExercises(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Übungen konnten nicht geladen werden.'))
      .finally(() => setLoading(false));
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  const handleShowAll = () => {
    setQuery('');
    setSearchParams({});
  };

  const handleOpenInEditor = (exercise) => {
    // Lokale Übungen bringen bereits eine persistierte choreography mit.
    // Externe Treffer werden dagegen weiterhin nur als Vorlage gemappt.
    const template = exercise.resultType === 'local'
      ? mapStoredExerciseToExerciseTemplate(exercise)
      : mapSearchResultToExerciseTemplate(exercise);

    onOpenInEditor(template);
    navigate('/editor');
  };

  const handleDelete = async (exercise) => {
    if (!window.confirm('Übung wirklich löschen?')) return;

    setDeletingId(exercise.id);
    setError('');
    try {
      await deleteExercise(exercise.id);
      setExercises((prev) => prev.filter((item) => item.id !== exercise.id));
    } catch (err) {
      setError(err.message || 'Übung konnte nicht gelöscht werden.');
    } finally {
      setDeletingId(null);
    }
  };

  const thumbnailUrl = (exercise) => exercise.thumbnail_url ?? exercise.thumbnail_key ?? '';

  const focusTags = (exercise) =>
    Array.isArray(exercise.choreography?.meta?.focus)
      ? exercise.choreography.meta.focus
      : [];

  return (
    <section className="library-page">
      <div className="library-hero">
        <div>
          <p className="library-eyebrow">Eigene Übungen</p>
          <h2>Übungsbibliothek</h2>
          <p className="library-intro">
            Verwalte deine gespeicherten Trainingsübungen und öffne sie direkt im Editor.
          </p>
        </div>

        <form className="library-search" onSubmit={handleSubmit}>
          <label className="library-search-label" htmlFor="exercise-query">
            Suchbegriff
          </label>
          <div className="library-search-row">
            <input
              id="exercise-query"
              className="library-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titel, Beschreibung oder Schwerpunkt"
            />
            <button className="library-search-button" type="submit" disabled={loading}>
              {loading ? 'Suche läuft…' : 'Suchen'}
            </button>
            <button
              className="library-search-button library-search-button-secondary"
              type="button"
              onClick={handleShowAll}
              disabled={loading}
            >
              Alle anzeigen
            </button>
          </div>
        </form>
      </div>

      {error && <div className="library-state library-state-error">{error}</div>}

      {!error && loading && <div className="library-state">Lädt…</div>}

      {!error && !loading && exercises.length === 0 && (
        <div className="library-state">
          {initialQuery
            ? <>Keine Treffer für <strong>{initialQuery}</strong>.</>
            : 'Noch keine Übungen vorhanden. Erstelle deine erste Übung im Editor.'}
        </div>
      )}

      {!loading && exercises.length > 0 && (
        <>
          <div className="library-results-meta">
            {exercises.length} {exercises.length === 1 ? 'Übung' : 'Übungen'}
            {initialQuery && <> für <strong>{initialQuery}</strong></>}
          </div>

          <div className="library-grid">
            {exercises.map((exercise) => {
              const thumb = thumbnailUrl(exercise);
              const tags = focusTags(exercise);

              return (
                <article className="exercise-card" key={exercise.id}>
                  {thumb ? (
                    <div className="exercise-card-thumbnail exercise-card-thumbnail-portrait">
                      <img
                        src={thumb}
                        alt={`Vorschau für ${exercise.title || 'Übung'}`}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div
                      className="exercise-card-thumbnail exercise-card-thumbnail-placeholder exercise-card-thumbnail-portrait"
                      aria-hidden="true"
                    >
                      <span>Keine Vorschau</span>
                    </div>
                  )}

                  <div className="exercise-card-header">
                    <h3>{exercise.title || 'Unbenannte Übung'}</h3>
                    <div className="my-exercise-meta-row">
                      <span className="exercise-card-players">
                        {exercise.age_group || 'Eigene Übung'}
                      </span>
                    </div>
                  </div>

                  <p className="exercise-card-summary">
                    {exercise.description || 'Für diese Übung liegt keine Beschreibung vor.'}
                  </p>

                  <div className="exercise-card-focus">
                    {tags.length > 0 ? (
                      tags.map((item) => (
                        <span className="exercise-chip" key={item}>{item}</span>
                      ))
                    ) : (
                      <span className="exercise-chip exercise-chip-muted">Keine Schwerpunkte</span>
                    )}
                  </div>

                  <div className="exercise-card-actions">
                    <button
                      className="exercise-card-action"
                      type="button"
                      onClick={() => handleOpenInEditor(exercise)}
                    >
                      Im Editor öffnen
                    </button>
                    <button
                      className="exercise-card-action exercise-card-action-danger"
                      type="button"
                      onClick={() => handleDelete(exercise)}
                      disabled={deletingId === exercise.id}
                    >
                      {deletingId === exercise.id ? 'Löscht…' : 'Löschen'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
