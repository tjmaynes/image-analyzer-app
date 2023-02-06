import { None, Option, Some } from 'ts-results'
import { IApiClient } from '../types'

export class ApiClient implements IApiClient {
  private readonly apiHost: string

  constructor(apiHost: string) {
    this.apiHost = apiHost
  }

  infer = async (context: string): Promise<Option<{ description: string }>> =>
    await fetch(`${this.apiHost}/conversation`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ context }),
    })
      .then((resp) => resp.json())
      .then((data) => Some(data))
      .catch(() => None)
}
