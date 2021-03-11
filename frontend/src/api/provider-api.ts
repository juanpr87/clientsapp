import { ApiUtils } from './utils'

export class ProviderApi {
  /**
   * Gets all the clients from the DB
   **/
  public static providersGet () {
    const axiosArgs = {
      options: {
        method: 'GET' as const
      },
      url: '/providers/'
    }

    return ApiUtils.makeCall(axiosArgs)
  }

  /**
   * Gets the client's providers list from the DB
   **/
  public static providersByClientGet (clientId: string) {
    const axiosArgs = {
      options: {
        method: 'GET' as const
      },
      url: `/providersbyclient/${clientId}/`
    }

    return ApiUtils.makeCall(axiosArgs)
  }
}
