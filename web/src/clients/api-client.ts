import { None, Option, Some } from 'ts-results'
import { DescribeApiResponse, IApiClient } from '../types'

export class ApiClient implements IApiClient {
  private readonly apiHost: string

  constructor(apiHost = '') {
    this.apiHost = apiHost
  }

  describe = async (thing: string): Promise<Option<DescribeApiResponse>> =>
    await fetch(`${this.apiHost}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `{ describe(thing: "${thing}"){ background } }`,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => Some(data))
      .catch(() => None)
}
