<template>
  <div id="app">
    <div class="titlebar">
      <h1>{{ title }}</h1>
      <b-button-toolbar class="toolbar" key-nav>
        <b-button variant="outline-primary" @click="onNewClient">New client</b-button>
      </b-button-toolbar>
    </div>
    <b-alert :show="errorVisible" variant="danger" dismissible>{{ errorMessage }}</b-alert>
    <Table :clients="clients" :loading="loading" @edit="onEditClient" @remove="onRemoveClient"/>
    <ClientModal :client="clientToEdit" :providers="providers" :clientProviders="clientProviders"
    @submit="onSubmitClient" @addProvider="onAddNewProvider" @deleteProvider="onDeleteProvider"
    @editProvider="onSubmitEditProvider"
    v-model="clientEditModalOpen"/>
    <DeleteConfirmationModal :name="entityToDeleteName" :entity="entityToDelete" :extraInfo="deleteModalExtraInfo"
    @submit="onSubmitDeleteEntity" v-model="deleteModalOpen"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Table from './components/Table.vue'
import ClientModal from './components/ClientModal.vue'
import DeleteConfirmationModal from './components/DeleteConfirmationModal.vue'
import { ClientApi } from './api/client-api'
import { ProviderApi } from './api/provider-api'
import { Client, ClientData, Provider, IdentifiableEntity, ProvidersList } from './api/models'

export default Vue.extend({
  name: 'App',
  components: {
    Table,
    ClientModal,
    DeleteConfirmationModal
  },
  data () {
    return {
      title: 'Clients',
      // Clients and providers lists
      clients: [] as Array<Client>,
      providers: [] as Array<Provider>,
      // Saves the client which the user wants to edit
      clientToEdit: null as Client | null,
      // Saves the client which the user wants to delete
      clientToDelete: null as Client | null,
      // Saves the provider which the user wants to delete
      providerToDelete: null as Provider | null,
      // Name of the entity to delete
      entityToDeleteName: null as string | null,
      // May be 'client' or 'provider'
      entityToDelete: null as string | null,
      deleteModalExtraInfo: null as string | null,
      // Client's providers list (fetched when the user edits a client)
      clientProviders: [] as Array<IdentifiableEntity>,
      loading: false,
      clientEditModalOpen: false,
      deleteModalOpen: false,
      errorVisible: false,
      errorMessage: ''
    }
  },
  created () {
    this.loading = true
    Promise.all([
      this.fetchClients(),
      this.fetchProviders()
    ]).finally(() => {
      this.loading = false
    })
  },
  methods: {
    fetchClients () {
      // `this` points to the vm instance
      return ClientApi.clientsGet().then((result) => {
        if (result && result.data && result.data.length > 0) {
          result.data.forEach((client: Client) => {
            this.clients.push({ ...client })
          })
        } else if (!result || !result.data) {
          this.showErrorMessage('An error has occurred while fetching clients')
          console.error('Error fetching clients: response data null')
        }
      }).catch((err) => {
        this.showErrorMessage('An error has occurred while fetching clients')
        console.error('Api clients GET error: ', err)
      })
    },
    fetchProviders () {
      return ProviderApi.providersGet().then((result) => {
        if (result && result.data && result.data.length > 0) {
          result.data.forEach((provider: Provider) => {
            this.providers.push({ ...provider })
          })
        } else if (!result || !result.data) {
          this.showErrorMessage('An error has occurred while fetching providers')
          console.error('Error fetching providers: response data null')
        }
      }).catch((err) => {
        this.showErrorMessage('An error has occurred while fetching providers')
        console.error('Api providers GET error: ', err)
      })
    },
    fetchClientProviders (clientId: string) {
      // Empty the clientProviders array
      this.clientProviders.splice(0, this.clientProviders.length)
      return ProviderApi.providersByClientGet(clientId).then((result) => {
        if (result && result.data && result.data.length > 0) {
          result.data.forEach((provider: IdentifiableEntity) => {
            this.clientProviders.push({ ...provider })
          })
          // console.log('clientProviders in fetch: ', this.clientProviders)
        } else if (!result || !result.data) {
          this.showErrorMessage('An error has occurred while fetching providers')
          console.error('Error fetching providers: response data null')
        }
      }).catch((err) => {
        this.showErrorMessage('An error has occurred while fetching providers')
        console.error('Api providers GET error: ', err)
      })
    },
    onSubmitClient (clientData: ClientData, providers: string[]) {
      if (this.clientToEdit === null) {
        // New client
        ClientApi.clientsPost(clientData).then((result) => {
          console.log('Post result ', result)
          if (result && result.data && result.data.id && result.data.id.length > 0) {
            // Client saved successfully
            const client = { ...result.data }
            this.clients.push(client)
            if (providers && providers.length > 0) { // there are providers selected
              this.updateClientProviders(result.data.id, providers).then(() => {
                this.showSuccessMessage('Client added successfully')
                this.clientEditModalOpen = false
              })
            } else {
              this.showSuccessMessage('Client added successfully')
              this.clientEditModalOpen = false
            }
          } else {
            this.showErrorMessage('An error has occurred saving the new client')
            console.error('Error while posting a new client. response data.id null')
          }
        }).catch((err) => {
          this.showErrorMessage('An error has occurred saving the new client')
          console.error('Post err ', err)
        })
      } else {
        // Edit client
        const editedClient: Client = { ...clientData, id: this.clientToEdit.id }
        ClientApi.clientsPut(editedClient).then((result) => {
          console.log('PUT result: ', result)
          if (result && result.data && result.data.result === 'OK' &&
            (result.data.affectedNumber === 1 || result.data.affectedNumber === 0)) {
            const tableClient = this.clients.find((client: Client) => client.id === editedClient.id)
            if (tableClient) {
              // Update the client on the table
              tableClient.phone = editedClient.phone
              tableClient.email = editedClient.email
              tableClient.name = editedClient.name
            }
            if (!this.providersArraysAreEquals(this.mapProvidersToEntities(providers), this.clientProviders)) {
              this.updateClientProviders(editedClient.id, providers).then(() => {
                this.showSuccessMessage('Client saved successfully')
                this.clientEditModalOpen = false
              })
            } else {
              this.showSuccessMessage('Client saved successfully')
              this.clientEditModalOpen = false
            }
          } else {
            this.showErrorMessage('An error has occurred saving the client')
            console.error('Error while putting an existent client. result: ', result)
          }
        }).catch((err) => {
          this.showErrorMessage('An error has occurred saving the client')
          console.error('PUT err ', err)
        })
      }
    },
    updateClientProviders (clientId: string, providers: Array<string>) {
      const providersList: ProvidersList = {
        providers: this.mapProvidersToEntities(providers)
      }
      return new Promise((resolve, reject) => {
        ClientApi.providersByClientPut(clientId, providersList).then((result) => {
          console.log('PUT providers result: ', result)
          if (result && result.data && result.data.result === 'OK' && result.data.affectedNumber === 1) {
            resolve(result)
          } else {
            this.showErrorMessage('An error has occurred saving the client\'s providers')
            console.error('providers PUT error result ', result)
            reject(result)
          }
        }).catch((err) => {
          this.showErrorMessage('An error has occurred saving the client\'s providers')
          console.error('providers PUT err ', err)
          reject(err)
        })
      })
    },
    mapProvidersToEntities (providers: Array<string>) {
      const identifiableProviders: Array<IdentifiableEntity> =
      providers.map((provider: string) => {
        const result: IdentifiableEntity = { id: provider }
        return result
      })
      return identifiableProviders
    },
    providersArraysAreEquals (providers1: Array<IdentifiableEntity>, providers2: Array<IdentifiableEntity>) {
      if (providers1.length !== providers2.length) {
        return false
      }
      const providersIn1ButNotIn2 = providers1.filter((provider: IdentifiableEntity) => providers2.find((prov: IdentifiableEntity) => prov.id === provider.id) === undefined)
      const providersIn2ButNotIn1 = providers2.filter((provider: IdentifiableEntity) => providers1.find((prov: IdentifiableEntity) => prov.id === provider.id) === undefined)
      return providersIn1ButNotIn2.length === 0 && providersIn2ButNotIn1.length === 0
    },
    onNewClient () {
      // Clear the clientToEdit as this is a new client
      this.clientToEdit = null
      // Empty clientProviders array
      this.clientProviders.splice(0, this.clientProviders.length)
      // Open the modal
      this.clientEditModalOpen = true
    },
    onEditClient (client: Client) {
      // Fetch the current client providers
      this.fetchClientProviders(client.id).then(() => {
        this.clientToEdit = client
        this.clientEditModalOpen = true
      }).catch((err) => {
        this.showErrorMessage('An error has occurred getting the client providers')
        console.error('providers GET err ', err)
      })
    },
    onRemoveClient (client: Client) {
      this.providerToDelete = null
      // Assign the client to delete to the component attribute
      this.clientToDelete = client
      this.entityToDeleteName = client.name
      this.entityToDelete = 'client'
      this.deleteModalExtraInfo = null
      // Open the confirmation modal
      this.deleteModalOpen = true
    },
    onSubmitDeleteEntity () {
      if (this.clientToDelete) {
        this.submitDeleteClient()
      } else if (this.providerToDelete) {
        this.submitDeleteProvider()
      }
    },
    onSubmitEditProvider (provider: Provider) {
      console.log('Edit provider ', provider)
      if (provider) {
        ProviderApi.providersPut(provider.id, provider.name).then((result) => {
          console.log('Put result ', result)
          if (result.data.result === 'OK' && result.data.affectedNumber === 1) {
            // Delete OK
            const listProvider = this.providers.find((listProvider: Provider) => listProvider.id === provider.id)
            if (listProvider) {
              // Remove client from table
              listProvider.name = provider.name
              this.showSuccessMessage('Provider edited successfully')
            }
          } else {
            this.showErrorMessage('An error has occurred editin the provider')
            console.error('PUT response invalid ', result)
          }
        }).catch((err) => {
          this.showErrorMessage('An error has occurred editing the provider')
          console.error('Put err ', err)
        })
      }
    },
    submitDeleteClient () {
      if (this.clientToDelete) {
        const clientToDelete = this.clientToDelete
        ClientApi.clientDelete(this.clientToDelete.id).then((result) => {
          console.log('Delete result ', result)
          if (result.data.result === 'OK' && result.data.affectedNumber === 1) {
            // Delete OK
            const tableClient = this.clients.find((client: Client) => client.id === clientToDelete.id)
            if (tableClient) {
              // Remove client from table
              this.clients.splice(this.clients.indexOf(tableClient), 1)
              this.showSuccessMessage('Client deleted successfully')
            }
          } else {
            this.showErrorMessage('An error has occurred deleting the client')
            console.error('DELETE response invalid ', result)
          }
        }).catch((err) => {
          this.showErrorMessage('An error has occurred deleting the client')
          console.error('Delete err ', err)
        })
      }
    },
    submitDeleteProvider () {
      if (this.providerToDelete) {
        const providerToDelete = this.providerToDelete
        ProviderApi.providerDelete(providerToDelete.id).then((result) => {
          console.log('Delete result ', result)
          if (result.data.result === 'OK' && result.data.affectedNumber === 1) {
            // Delete OK
            const listProvider = this.providers.find((provider: Provider) => provider.id === providerToDelete.id)
            if (listProvider) {
              // Remove client from table
              this.providers.splice(this.providers.indexOf(listProvider), 1)
              this.showSuccessMessage('Provider deleted successfully')
            }
          } else {
            this.showErrorMessage('An error has occurred deleting the provider')
            console.error('providers DELETE response invalid ', result)
          }
        }).catch((err) => {
          this.showErrorMessage('An error has occurred deleting the provider')
          console.error('providers Delete err ', err)
        })
      }
    },
    buildExtraInfoDeleteProviderMessage (clientsNumber: number) {
      if (clientsNumber === 1) {
        return 'There is 1 client using this provider. If you confirm, this reference will be lost.'
      }
      if (clientsNumber > 1) {
        return `There are ${clientsNumber} clients using this provider. If you confirm, these references will be lost.`
      }
      return null
    },
    onDeleteProvider (provider: Provider) {
      this.clientToDelete = null
      this.providerToDelete = provider
      if (provider) {
        ClientApi.clientsByProviderGet(provider.id).then((result) => {
          if (result && result.data && result.data.clients >= 0) {
            this.entityToDeleteName = provider.name
            this.entityToDelete = 'provider'
            this.deleteModalExtraInfo = this.buildExtraInfoDeleteProviderMessage(result.data.clients)
            this.deleteModalOpen = true
          } else {
            this.showErrorMessage('An error has occurred while fetching clients')
            console.error('Error fetching clients: invalid response ', result)
          }
        }).catch((err) => {
          this.showErrorMessage('An error has occurred while fetching clients')
          console.error('Api clientsbyprovider GET error: ', err)
        })
      }
    },
    onAddNewProvider (data: string) {
      ProviderApi.providersPost(data).then((result) => {
        if (result && result.data && result.data.id && result.data.id.length > 0) {
          this.showSuccessMessage('Provider added successfully')
          this.providers.push({ ...result.data })
        } else {
          this.showErrorMessage('An error has occurred saving the provider')
          console.error('POST providers response invalid ', result)
        }
      }).catch((err) => {
        this.showErrorMessage('An error has occurred saving the provider')
        console.error('Providers POST err: ', err)
      })
    },
    showErrorMessage (message: string) {
      this.$bvToast.toast(message, {
        title: 'Error',
        variant: 'danger',
        solid: true
      })
    },
    showSuccessMessage (message: string) {
      this.$bvToast.toast(message, {
        title: 'Success',
        variant: 'success',
        solid: true
      })
    }
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 20px;
  text-align: left;
  color: #2c3e50;

  .titlebar {
    display: flex;
    justify-content: space-between;
    .toolbar {
      padding: 0.5rem;
    }
  }
}
</style>
