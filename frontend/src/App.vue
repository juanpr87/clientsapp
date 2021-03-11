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
    @submit="onSubmitClient" v-model="clientModalOpen"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Table from './components/Table.vue'
import ClientModal from './components/ClientModal.vue'
import { ClientApi } from './api/client-api'
import { ProviderApi } from './api/provider-api'
import { Client, ClientData, Provider, IdentifiableEntity } from './api/models'

export default Vue.extend({
  name: 'App',
  components: {
    Table,
    ClientModal
  },
  data () {
    return {
      title: 'Clients',
      // Clients and providers lists
      clients: [] as Array<Client>,
      providers: [] as Array<Provider>,
      // Saves the client which the user wants to edit
      clientToEdit: null as Client | null,
      // Client's providers list (fetched when the user edits a client)
      clientProviders: [] as Array<IdentifiableEntity>,
      loading: false,
      clientModalOpen: false,
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
      ClientApi.clientsPost(clientData).then((result) => {
        console.log('Post result ', result)
        if (result && result.data && result.data.id && result.data.id.length > 0) {
          // Client saved successfully
          const client = { ...result.data }
          this.clients.push(client)
          this.clientModalOpen = false
          this.showSuccessMessage('Client added successfully')
          if (providers && providers.length > 0) { // there are providers selected

          }
        } else {
          this.showErrorMessage('An error has occurred saving the new client')
          console.error('Error while posting a new client. response data.id null')
        }
      }).catch((err) => {
        this.showErrorMessage('An error has occurred saving the new client')
        console.error('Post err ', err)
      })
    },
    onNewClient () {
      this.clientToEdit = null
      this.clientModalOpen = true
    },
    onEditClient (client: Client) {
      console.log('Editing ', client)
      this.fetchClientProviders(client.id).then(() => {
        this.clientToEdit = client
        this.clientModalOpen = true
      })
    },
    onRemoveClient (client: Client) {
      console.log('Removing ', client)
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
        title: 'Error',
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
