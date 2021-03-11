
import { ApiUtils } from './utils'
import { ClientData } from './models'
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
}
