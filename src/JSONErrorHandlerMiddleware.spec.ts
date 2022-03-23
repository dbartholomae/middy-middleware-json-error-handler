import JSONErrorHandlerMiddleware from './JSONErrorHandlerMiddleware'

import { Context } from 'aws-lambda'
import createHttpError from 'http-errors'

describe('JSONErrorHandlerMiddleware', () => {
  describe('onError hook', () => {
    describe('with errors wit status code 400', () => {
      const statusCode = 400

      it('sets the response status code to 400', async () => {
        const handler = {
          callback: jest.fn(),
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          internal: {},
          response: {}
        }
        await JSONErrorHandlerMiddleware().onError(handler)
        expect((handler.response as any).statusCode).toEqual(400)
      })

      it('stringifies the error message', async () => {
        const handler = {
          callback: jest.fn(),
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          internal: {},
          response: {}
        }
        await JSONErrorHandlerMiddleware().onError(handler)
        expect(JSON.parse((handler.response as any).body)).toMatchObject({
          message: 'Oops'
        })
      })

      it('strips the stack', async () => {
        const handler = {
          callback: jest.fn(),
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          internal: {},
          response: {}
        }
        await JSONErrorHandlerMiddleware().onError(handler)
        expect(JSON.parse((handler.response as any).body).stack).toBeUndefined()
      })

      it('adds Content-Type header', async () => {
        const handler = {
          callback: jest.fn(),
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          internal: {},
          response: {}
        }
        await JSONErrorHandlerMiddleware().onError(handler)
        expect((handler.response as any).headers["Content-Type"]).toBe('application/json')
      })
    })

    describe('with errors wit status code 500', () => {
      const statusCode = 500

      it('sets the response status code to 500', async () => {
        const handler = {
          callback: jest.fn(),
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          internal: {},
          response: {}
        }
        await JSONErrorHandlerMiddleware().onError(handler)
        expect((handler.response as any).statusCode).toEqual(500)
      })

      it('returns only status code and the default message "Internal server error"', async () => {
        const request = {
          callback: jest.fn(),
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          internal: {},
          response: {}
        }
        await JSONErrorHandlerMiddleware().onError(request)
        expect(JSON.parse((request.response as any).body)).toEqual({
          message: 'Internal server error',
          statusCode: 500
        })
      })

      it('adds Content-Type header', async () => {
        const request = {
          callback: jest.fn(),
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          internal: {},
          response: {}
        }
        await JSONErrorHandlerMiddleware().onError(request)
        expect((request.response as any).headers["Content-Type"]).toBe('application/json')
      })
    })
  })
})
