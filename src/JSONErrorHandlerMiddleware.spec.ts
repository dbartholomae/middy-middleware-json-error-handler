import JSONErrorHandlerMiddleware from './JSONErrorHandlerMiddleware'

import createHttpError from 'http-errors'
import { Context } from 'aws-lambda'

describe('JSONErrorHandlerMiddleware', () => {
  describe('onError hook', () => {
    describe('with errors wit status code 400', () => {
      const statusCode = 400

      it('sets the response status code to 400', async () => {
        const next = jest.fn()
        const handler = {
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          response: {},
          callback: jest.fn()
        }
        await JSONErrorHandlerMiddleware().onError(handler, next)
        expect((handler.response as any).statusCode).toEqual(400)
      })

      it('stringifies the error message', async () => {
        const next = jest.fn()
        const handler = {
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          response: {},
          callback: jest.fn()
        }
        await JSONErrorHandlerMiddleware().onError(handler, next)
        expect(JSON.parse((handler.response as any).body)).toMatchObject({
          message: 'Oops'
        })
      })

      it('strips the stack', async () => {
        const next = jest.fn()
        const handler = {
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          response: {},
          callback: jest.fn()
        }
        await JSONErrorHandlerMiddleware().onError(handler, next)
        expect(JSON.parse((handler.response as any).body).stack).toBeUndefined()
      })
    })

    describe('with errors wit status code 500', () => {
      const statusCode = 500

      it('sets the response status code to 500', async () => {
        const next = jest.fn()
        const handler = {
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          response: {},
          callback: jest.fn()
        }
        await JSONErrorHandlerMiddleware().onError(handler, next)
        expect((handler.response as any).statusCode).toEqual(500)
      })

      it('returns only status code and the default message "Internal server error"', async () => {
        const next = jest.fn()
        const handler = {
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          response: {},
          callback: jest.fn()
        }
        await JSONErrorHandlerMiddleware().onError(handler, next)
        expect(JSON.parse((handler.response as any).body)).toEqual({
          message: 'Internal server error',
          statusCode: 500
        })
      })
    })
  })
})
