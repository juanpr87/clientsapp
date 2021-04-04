
import { ApiUtils } from './utils'
import { ClientData, Client, ProvidersList } from './models'
export class ClientApi {
  /**
   * Gets all the clients from the DB
   **/
  public static clientsGet () {
    const axiosArgs = {
      options: {
        method: 'GET' as const
      },
      url: '/clients/'
    }

    return ApiUtils.makeCall(axiosArgs)
  }

  /**
   * Creates a new client
   **/
  public static clientsPost (clientData: ClientData) {
    const axiosArgs = {
      options: {
        method: 'POST' as const,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(clientData)
      },
      url: '/clients/'
    }

    return ApiUtils.makeCall(axiosArgs)
  }

  /**
   * Edits an existent client
   **/
  public static clientsPut (client: Client) {
    const urlPath = '/clients/{clientId}/'
      .replace(`{${'clientId'}}`, encodeURIComponent(String(client.id)))
    const clientData: ClientData = client
    const axiosArgs = {
      options: {
        method: 'PUT' as const,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(clientData)
      },
      url: urlPath
    }

    return ApiUtils.makeCall(axiosArgs)
  }

  /**
   * Edits the client's providers list
   **/
  public static providersByClientPut (clientId: string, providers: ProvidersList) {
    const urlPath = '/providersbyclient/{clientId}/'
      .replace(`{${'clientId'}}`, encodeURIComponent(clientId))
    const axiosArgs = {
      options: {
        method: 'PUT' as const,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(providers)
      },
      url: urlPath
    }

    return ApiUtils.makeCall(axiosArgs)
  }

  /**
   * Deletes a client
   **/
  public static clientDelete (clientId: string) {
    const urlPath = '/clients/{clientId}/'
      .replace(`{${'clientId'}}`, encodeURIComponent(clientId))
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

  /**
   * Gets the number of clients who have a provider
   **/
  public static clientsByProviderGet (providerId: string) {
    const urlPath = '/clientsbyprovider/{providerId}/'
      .replace(`{${'providerId'}}`, encodeURIComponent(providerId))
    const axiosArgs = {
      options: {
        method: 'GET' as const,
        headers: {
          'Content-Type': 'application/json'
        }
      },
      url: urlPath
    }

    return ApiUtils.makeCall(axiosArgs)
  }
}
