import JWT from 'jsonwebtoken'
import request from 'supertest'
const server = request('http://localhost:3000')

// Unfortunately the error middleware does not set correct content-type 'text', but instead 'application/json' is
// used by default. This means we need to overwrite the parser as otherwise the error tests would fail as superagent
// would try to parse them as JSON.
//
// TODO: Delete these two lines as soon as the error middleware sets the correct content-type
import superagent from 'superagent'
superagent.parse['application/json'] = superagent.parse.text

describe('Handler with JWT Auth middleware', () => {
  it('returns 200 and "Hello world! Here\'s your token: {TOKEN}" with the token used if authorized', async () => {
    const token = JWT.sign({ permissions: ['helloWorld'] }, 'secret')
    return server
      .get('/hello')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res: any) => {
        // TODO: Use this code instead as soon as the error middleware sets the correct content-type
        // expect(res.body.data).toEqual('Hello world!')
        const body = JSON.parse(res.text)
        expect(body.data).toEqual(`Hello world! Here's your token: ${token}`)
      })
  })

  it('returns 200 and "Hello world!" if authorized via query parameter', async () => {
    const token = JWT.sign({ permissions: ['helloWorld'] }, 'secret')
    return server
      .get(`/hello?token=${token}`)
      .expect(200)
      .then((res: any) => {
        // TODO: Use this code instead as soon as the error middleware sets the correct content-type
        // expect(res.body.data).toEqual('Hello world!')
        const body = JSON.parse(res.text)
        expect(body.data).toEqual(`Hello world! Here's your token: ${token}`)
      })
  })

  it('returns 403 and error message if not authorized', async () => {
    const token = JWT.sign({ permissions: [] }, 'secret')
    return server
      .get('/hello')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .then((res: any) => {
        expect(res.text).toEqual('User not authorized for helloWorld, only found permissions []')
      })
  })

  it('returns 400 and error message if not authenticated', async () => {
    const token = JWT.sign({ iat: 1, permission: 'helloWorld' }, 'secret')
    return server
      .get('/hello')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .then((res: any) => {
        expect(res.text).toEqual('Token payload malformed, was {"iat":1,\"permission\":\"helloWorld\"}')
      })
  })

  it('returns 401 and error message if token is malformed', async () =>
    server
      .get('/hello')
      .set('Authorization', `Malformed token`)
      .expect(401)
      .then((res: any) => {
        expect(res.text).toEqual('Format should be "Authorization: Bearer [token]", received "Authorization: Malformed token" instead')
      })
  )

  it('returns 401 and error message if payload is malformed', async () => {
    return server
      .get('/hello')
      .set('Authorization', `Malformed token`)
      .expect(401)
      .then((res: any) => {
        expect(res.text).toEqual('Format should be "Authorization: Bearer [token]", received "Authorization: Malformed token" instead')
      })
  })

  it('returns 401 and error message if token is missing', async () => {
    return server
      .get('/hello')
      .expect(401)
      .then((res: any) => {
        expect(res.text).toEqual('No valid bearer token was set in the authorization header')
      })
  })
})
