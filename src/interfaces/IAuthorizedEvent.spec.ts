import { IAuthorizedEvent, isAuthorizedEvent } from './IAuthorizedEvent'

describe('IAuthorizedEvent', () => {
  describe('interface', () => {
    it('accepts data that has an httpMethod and a string as an Authorization header', () => {
      const event: IAuthorizedEvent = {
        headers: {
          Authorization: 'Bearer TOKEN'
        },
        httpMethod: 'GET'
      }
      expect(event).not.toBeNull()
    })

    it('accepts data that has an httpMethod and an Array as an Authorization header', () => {
      const event: IAuthorizedEvent = {
        headers: {
          Authorization: ['Bearer TOKEN']
        },
        httpMethod: 'GET'
      }
      expect(event).not.toBeNull()
    })

    it('accepts data that has an httpMethod and a string as an authorization header with lower-case a', () => {
      const event: IAuthorizedEvent = {
        headers: {
          authorization: 'Bearer TOKEN'
        },
        httpMethod: 'GET'
      }
      expect(event).not.toBeNull()
    })

    it('accepts data with token information set in the generics', () => {
      interface IToken {
        foo: string
      }
      const event: IAuthorizedEvent<IToken> = {
        auth: {
          payload: {
            foo: ''
          },
          token: ''
        },
        headers: {
          authorization: 'Bearer TOKEN'
        },
        httpMethod: 'GET'
      }
      expect(event).not.toBeNull()
    })
  })

  describe('type guard', () => {
    describe.each(['authorization', 'Authorization'])(
      'with %s header',
      authHeader => {
        it(`accepts data that has an httpMethod and a string as an ${authHeader} header`, () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: 'Bearer TOKEN'
              },
              httpMethod: 'GET'
            })
          ).toBe(true)
        })

        it(`accepts data that has an httpMethod, a string as an ${authHeader} header and a payload verified by the given type guard`, () => {
          interface IToken {
            foo: string
          }
          function isToken (token: any): token is IToken {
            return token != null && typeof token.foo === 'string'
          }

          expect(
            isAuthorizedEvent(
              {
                auth: {
                  payload: {
                    foo: 'bar'
                  },
                  token: ''
                },
                headers: {
                  [authHeader]: 'Bearer TOKEN'
                },
                httpMethod: 'GET'
              },
              isToken
            )
          ).toBe(true)
        })

        it(`accepts data that has an httpMethod, a string as an ${authHeader} header, no auth and a type guard`, () => {
          interface IToken {
            foo: string
          }
          function isToken (token: any): token is IToken {
            return token != null && typeof token.foo === 'string'
          }

          expect(
            isAuthorizedEvent(
              {
                headers: {
                  [authHeader]: 'Bearer TOKEN'
                },
                httpMethod: 'GET'
              },
              isToken
            )
          ).toBe(true)
        })

        it(`accepts data that has an httpMethod and an array of strings as an ${authHeader} header`, () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: ['Bearer TOKEN']
              },
              httpMethod: 'GET'
            })
          ).toBe(true)
        })

        it('rejects data without an httpMethod', () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: 'Bearer TOKEN'
              }
            })
          ).toBe(false)
        })

        it('rejects data where authorization is an array with non-string members', () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: [{}]
              },
              httpMethod: 'GET'
            })
          ).toBe(false)
        })

        it('rejects data where authorization is an empty array', () => {
          expect(
            isAuthorizedEvent({
              headers: {
                [authHeader]: []
              },
              httpMethod: 'GET'
            })
          ).toBe(false)
        })
      }
    )

    it('rejects data that is null', () => {
      expect(isAuthorizedEvent(null)).toBe(false)
    })

    it('rejects data without a header', () => {
      expect(
        isAuthorizedEvent({
          httpMethod: 'GET'
        })
      ).toBe(false)
    })

    it('rejects data without authorization', () => {
      expect(
        isAuthorizedEvent({
          headers: {},
          httpMethod: 'GET'
        })
      ).toBe(false)
    })

    it('rejects data where the payload is rejected by a given type guard', () => {
      interface IToken {
        foo: string
      }
      function isToken (token: any): token is IToken {
        return token != null && typeof token.foo === 'string'
      }

      expect(
        isAuthorizedEvent(
          {
            auth: {},
            headers: {},
            httpMethod: 'GET'
          },
          isToken
        )
      ).toBe(false)
    })
  })
})
