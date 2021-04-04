import { ApiUtils } from './utils'

import { ProviderData } from './models'

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

  /**
   * Creates a new provider
   **/
  public static providersPost (providerName: string) {
    const providerData: ProviderData = {
      name: providerName
    }
    const axiosArgs = {
      options: {
        method: 'POST' as const,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(providerData)
      },
      url: '/providers/'
    }

    return ApiUtils.makeCall(axiosArgs)
  }

  /**
   * Edits a provider
   **/
  public static providersPut (providerId: string, providerName: string) {
    const urlPath = '/providers/{providerId}/'
      .replace(`{${'providerId'}}`, encodeURIComponent(providerId))
    const providerData: ProviderData = {
      name: providerName
    }
    const axiosArgs = {
      options: {
        method: 'PUT' as const,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(providerData)
      },
      url: urlPath
    }

    return ApiUtils.makeCall(axiosArgs)
  }

  /**
   * Deletes a provider
   **/
  public static providerDelete (providerId: string) {
    const urlPath = '/providers/{providerId}/'
      .replace(`{${'providerId'}}`, encodeURIComponent(providerId))
    const axiosArgs = {
      options: {
        method: 'DELETE' as const,
        headers: {
          'Content-Type': 'application/json'
        }
      },
      url: urlPath
    }

    return ApiUtils.makeCall(axiosArgs)
  }
}
