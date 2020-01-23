import middy from 'middy'
import JSONErrorHandlerMiddleware from '../'
import createHttpError from 'http-errors'
import { APIGatewayEvent } from 'aws-lambda'

// This is your AWS handler
async function helloWorld (event: APIGatewayEvent) {
  if (event.queryStringParameters?.search == null) {
    // If you throw an error with status code, the error will be returned as stringified JSON
    // Only the stack will be omitted.
    throw createHttpError(400, 'Query has to include a search')
  }

  // If you throw an error with no status code, only a generic message will be shown to the user
  // instead of the full error
  throw new Error('Search is not implemented yet')
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
export const handler = middy(helloWorld)
  .use(JSONErrorHandlerMiddleware()) // This middleware is needed do handle the errors thrown by the JWTAuthMiddleware
