function formatValue(value: boolean | number | string) {
  return typeof value === 'string' ? `'${value}'` : `${value}`
}

export function buildGoogleDriveConditions(
  conditions: Record<string, { operator: string; value: boolean | number | string } | boolean | number | string>,
) {
  const mergedConditions: typeof conditions = { trashed: false, ...conditions }
  return Object.entries(mergedConditions)
    .map(([key, value]) =>
      typeof value === 'object'
        ? `${key} ${value.operator} ${formatValue(value.value)}`
        : `${key} = ${formatValue(value)}`,
    )
    .join(' and ')
}
