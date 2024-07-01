export const isNothing = (value?: string | null): boolean => {
  return value === undefined || value === null || value.trim() === ''
}
