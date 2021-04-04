<template>
  <b-modal v-model="modalShow" id="ClientModal" size="lg" :title="title">
    <div>
      <b-form @submit.prevent="onSubmit" @reset="onReset">
        <b-form-group
          id="input-group-name"
          label="Name:"
          label-for="input-name"
          description="Please enter the client name.">
          <b-form-input
            id="input-name"
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            required>
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-email"
          label="Email address:"
          label-for="input-email"
          description="Please enter the client email address.">
          <b-form-input
            id="input-email"
            v-model="form.email"
            type="email"
            placeholder="Enter email address"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-phone"
          label="Phone:"
          label-for="input-phone"
          description="Please enter the client phone.">
          <b-form-input
            id="input-phone"
            v-model="form.phone"
            type="text"
            placeholder="Enter phone"
            required>
          </b-form-input>
        </b-form-group>
        <b-card bg-variant="light">
          <b-form-group
            label="Providers"
            label-size="lg"
            class="mb-0">
            <b-form-group
              id="input-group-newprovider"
              label="New provider:"
              label-for="input-newprovider"
              description="Please enter a provider name.">
              <b-input-group>
                <b-form-input
                  id="input-newprovider"
                  v-model="newProvider"
                  type="text"
                  placeholder="Enter name">
                </b-form-input>
                <b-input-group-append>
                  <b-button variant="primary" @click="onSubmitNewProvider">Add provider</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group
            id="input-group-providers"
            label="Providers:"
            label-for="checkbox-group"
            description="Please select the providers for this client.">
              <b-list-group label="Providers:">
                <b-form-checkbox-group
                  id="checkbox-group"
                  v-model="providersChecks"
                  name="checkbox-1">
                  <b-list-group-item v-for="provider in providers" :key="provider.id">
                    <div class="d-flex flex-row justify-content-between">
                      <b-form-checkbox class="pt-1"
                        :value="provider.id">
                        {{ provider.name }}
                      </b-form-checkbox>
                      <b-button-group>
                        <b-button v-b-modal.modal-multi-2 variant="light" size="sm" @click="onEditProvider(provider)">
                          <b-icon-pencil-square></b-icon-pencil-square>
                        </b-button>
                        <b-button v-b-modal.modal-multi-2 variant="light" size="sm" @click="onDeleteProvider(provider)">
                          <b-icon-trash></b-icon-trash>
                        </b-button>
                      </b-button-group>
                    </div>
                  </b-list-group-item>
                </b-form-checkbox-group>
              </b-list-group>
            </b-form-group>
          </b-form-group>
        </b-card>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
      <ProviderModal v-model="providerModalShow" :provider="providerToEdit" @submit="onSubmitEditProvider"></ProviderModal>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { IdentifiableEntity, Provider } from '../api/models'
import ProviderModal from './ProviderModal.vue'

export default Vue.component('ClientModal', {
  components: {
    ProviderModal
  },
  data () {
    return {
      modalShow: false,
      providerModalShow: false,
      providersChecks: [] as Array<string>,
      providerToEdit: null as Provider | null,
      newProvider: '',
      form: {
        email: '',
        name: '',
        phone: ''
      }
    }
  },
  props: {
    client: Object,
    providers: Array,
    clientProviders: Array,
    value: Boolean
  },
  created () {
    if (this.value === true) {
      this.modalShow = true
    }
  },
  methods: {
    onSubmit () {
      this.$emit('submit', {
        name: this.form.name,
        phone: this.form.phone,
        email: this.form.email
      }, this.providersChecks)
    },
    onReset () {
      console.log('onReset')
      console.log(this.providersChecks)
      console.log(this.providers)
    },
    onDeleteProvider (provider: Provider) {
      if (provider) {
        this.$emit('deleteProvider', provider)
      }
    },
    onEditProvider (provider: Provider) {
      this.providerToEdit = provider
      this.providerModalShow = true
    },
    onSubmitNewProvider () {
      if (this.newProvider && this.newProvider.length > 0) {
        this.$emit('addProvider', this.newProvider)
        this.newProvider = ''
      }
    },
    onSubmitEditProvider (provider: Provider) {
      this.providerToEdit = null
      this.$emit('editProvider', provider)
    }
  },
  computed: {
    title (): string {
      if (this.client) {
        return `Edit client ${this.client.name}`
      }
      return 'New client'
    }
  },
  watch: {
    // Triggered when a change in v-model directive param (of this component) is made
    // newValue is true if it is required the modal to be open, false otherwise
    value: function (newValue) {
      if (newValue === true) {
        this.modalShow = true
      } else {
        this.modalShow = false
      }
    },
    // Triggered when a change in v-model directive param (of the b-modal component) is made
    // This could happen if the user closes the modal by clicking outside it
    modalShow: function (newValue) {
      this.$emit('input', newValue)
    },
    // Triggered if the client clicks on 'Edit' button from a table row
    client: function (client) {
      if (client && client.id) {
        this.form.email = client.email
        this.form.name = client.name
        this.form.phone = client.phone
      } else {
        this.form.email = ''
        this.form.name = ''
        this.form.phone = ''
      }
    },
    // Triggered in the same way as client
    clientProviders: function (clientProviders) {
      // Empty the providerChecks array and fill it with the new clientProviders array
      this.providersChecks.splice(0, this.providersChecks.length)
      if (clientProviders && clientProviders.length > 0) {
        clientProviders.forEach((provider: IdentifiableEntity) => {
          this.providersChecks.push(provider.id)
        })
      }
    }
  }
})
</script>
