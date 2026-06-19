import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { deleteExercise, listExercisesFiltered } from '../lib/exerciseApi';
import { mapStoredExerciseToExerciseTemplate } from '../lib/exerciseTemplate';

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
    const template = mapStoredExerciseToExerciseTemplate(exercise);
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
