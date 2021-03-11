export interface Provider {
  /**
   * Provider's Id
   **/
  id: string;

  /**
   * Provider's name
   **/
  name: string;
}

export interface ClientData {
  /**
   * Client's name
   **/
  name: string;

  /**
   * Client's email
   **/
  email: string;

  /**
   * Client's phone number
   **/
  phone: string;
}

export interface Client extends ClientData {
    /**
     * Client's Id
     **/
    id: string;
}

export interface IdentifiableEntity {
  /**
   * Entity's Id
   **/
  id: string;
}
