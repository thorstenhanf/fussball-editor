const EXERCISE_SEARCH_API = 'https://b5zb58pdy4.execute-api.eu-north-1.amazonaws.com/prod/search';
const SEARCH_ASSET_BASE_URL = (
  import.meta.env.VITE_SEARCH_ASSET_BASE_URL
  || import.meta.env.VITE_S3_PUBLIC_BASE_URL
  || ''
).replace(/\/$/, '');

function isAbsoluteAssetUrl(value) {
  return typeof value === 'string' && /^(https?:)?\/\//.test(value);
}

export function resolveSearchAssetUrl(asset = {}) {
  const thumbnailUrl = asset.thumbnail_url ?? asset.thumbnailUrl ?? '';
  const thumbnailKey = asset.thumbnail_key ?? asset.thumbnailKey ?? '';

  if (typeof thumbnailUrl === 'string' && thumbnailUrl.trim()) {
    return thumbnailUrl.trim();
  }

  if (typeof thumbnailKey !== 'string' || !thumbnailKey.trim()) {
    return '';
  }

  const normalizedKey = thumbnailKey.trim();

  if (isAbsoluteAssetUrl(normalizedKey) || normalizedKey.startsWith('/')) {
    return normalizedKey;
  }

  if (!SEARCH_ASSET_BASE_URL) {
    return '';
  }

  return `${SEARCH_ASSET_BASE_URL}/${normalizedKey.replace(/^\//, '')}`;
}

export function normalizeSearchExercise(exercise = {}) {
  const thumbnailUrl = resolveSearchAssetUrl(exercise);

  return {
    ...exercise,
    thumbnail_url: thumbnailUrl,
    thumbnailUrl,
    thumbnail_key: exercise.thumbnail_key ?? exercise.thumbnailKey ?? '',
    thumbnailKey: exercise.thumbnailKey ?? exercise.thumbnail_key ?? '',
  };
}

export function normalizeExerciseSearchResults(payload) {
  const rawItems = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
    ? payload.results
    : Array.isArray(payload?.items)
    ? payload.items
    : [];

  return rawItems.map(normalizeSearchExercise);
}

export async function searchExercises(query = '') {
  const response = await fetch(`${EXERCISE_SEARCH_API}?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error(`Search API-Fehler (${response.status})`);
  }

  return normalizeExerciseSearchResults(await response.json());
}
