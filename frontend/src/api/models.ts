export interface IdentifiableEntity {
  /**
   * Entity's Id
   **/
  id: string;
}

export interface ProviderData {
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

export interface Provider extends ProviderData, IdentifiableEntity {
}

export interface Client extends ClientData, IdentifiableEntity {
}

export interface ProvidersList {
  /**
   * Providers list
   **/
  providers: Array<IdentifiableEntity>
}
