export interface IErrorWithExpose {
  expose: boolean
}

export function isErrorWithExpose (
  error: any
): error is IErrorWithExpose {
  return typeof error.expose === 'boolean'
}
