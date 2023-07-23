import { Context } from 'aws-lambda'
import JSONErrorHandlerMiddleware from './JSONErrorHandlerMiddleware'
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

      it('strips the stack by default', async () => {
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

      it('strips the name and statusCode when specified in options', async () => {
        const handler = {
          callback: jest.fn(),
          context: {} as Context,
          error: createHttpError(statusCode, 'Oops'),
          event: {},
          internal: {},
          response: {}
        }
        await JSONErrorHandlerMiddleware({ errorPropertiesToOmit: ['name', 'statusCode'] }).onError(handler)
        expect(JSON.parse((handler.response as any).body).name).toBeUndefined()
        expect(JSON.parse((handler.response as any).body).statusCode).toBeUndefined()
        expect(JSON.parse((handler.response as any).body).stack).toBeDefined()
      })
    })

    describe('with errors with status code 500', () => {
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
    })
  })

  describe('with errors with expose property', () => {
    it('returns the error when expose is true and the status is lower than 500', async () => {
      const request = {
        callback: jest.fn(),
        context: {} as Context,
        error: createHttpError(400, 'Oops', { expose : true}),
        event: {},
        internal: {},
        response: {}
      }
      await JSONErrorHandlerMiddleware().onError(request)
      expect(JSON.parse((request.response as any).body)).toEqual({
        message: 'Oops',
        name: 'BadRequestError'
      })
    })

    it('returns the error 500 when expose is false and the status is lower than 500', async () => {
      const request = {
        callback: jest.fn(),
        context: {} as Context,
        error: createHttpError(400, 'Oops', { expose : false}),
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

    it('returns the error with status greater than 500 when expose is true', async () => {
      const request = {
        callback: jest.fn(),
        context: {} as Context,
        error: createHttpError(504, 'Oops', { expose : true}),
        event: {},
        internal: {},
        response: {}
      }
      await JSONErrorHandlerMiddleware().onError(request)
      expect(JSON.parse((request.response as any).body)).toEqual({
        message: 'Oops',
        name: 'GatewayTimeoutError',
      })
    })

    it('returns the error with status 500 when any error than HttpError is sent with statusCode defined', async () => {
      // tslint:disable-next-line:max-classes-per-file
      class CustomError extends Error {
        statusCode = 504
      };
      const request = {
        callback: jest.fn(),
        context: {} as Context,
        error: new CustomError('Oops'),
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

    it('returns the error when any error than HttpError is sent with statusCode lower than 500', async () => {
      // tslint:disable-next-line:max-classes-per-file
      class CustomError extends Error {
        statusCode = 404
      };
      const request = {
        callback: jest.fn(),
        context: {} as Context,
        error: new CustomError('Oops'),
        event: {},
        internal: {},
        response: {}
      }
      await JSONErrorHandlerMiddleware().onError(request)
      expect(JSON.parse((request.response as any).body)).toEqual({
        message: 'Oops',
        name: 'Error',
        statusCode: 404
      })
    })
  })
})
