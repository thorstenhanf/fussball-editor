function normalizeDurationMinutes(value) {
  if (value === '' || value === null || value === undefined) return null;

  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : null;
}

export function buildExercisePayload({
  title,
  description,
  ageGroup,
  durationMinutes,
  fieldTemplate,
  objects,
  keyframes,
}) {
  return {
    title: title.trim(),
    description: description.trim() || null,
    age_group: ageGroup.trim() || null,
    duration_minutes: normalizeDurationMinutes(durationMinutes),
    field_template: fieldTemplate,
    choreography: {
      objects,
      keyframes,
    },
  };
}
