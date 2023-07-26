import {
  IErrorWithExpose,
  isErrorWithExpose
} from './IErrorWithExpose'

import createHttpError from 'http-errors'

describe('IErrorWithExpose', () => {
  describe('interface', () => {
    it('accepts a valid error with expose', () => {
      const error: IErrorWithExpose = createHttpError(400, 'Oh no', {expose: true})
      expect(error).toBeDefined()
    })
  })

  describe('type guard', () => {
    it('validates a valid error with expose', () => {
      const error = createHttpError(400, 'Oh no', {expose: true})
      expect(isErrorWithExpose(error)).toBe(true)
    })

    it('rejects an error without status code', () => {
      const error = new Error('Oh no')
      expect(isErrorWithExpose(error)).toBe(false)
    })
  })
})