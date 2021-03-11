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
                <b-form-checkbox
                  :value="provider.id">
                  {{ provider.name }}
                </b-form-checkbox>
              </b-list-group-item>
            </b-form-checkbox-group>
          </b-list-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { IdentifiableEntity } from '../api/models'

export default Vue.component('ClientModal', {
  data () {
    return {
      modalShow: false,
      providersChecks: [] as Array<string>,
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
    }
  },
  computed: {
    title (): string {
      if (this.client) {
        return `Edit client ${this.client.name}`
      } else {
        return 'New client'
      }
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
      console.log('Client watcher ', client)
      if (client && client.id) {
        this.form.email = client.email
        this.form.name = client.name
        this.form.phone = client.phone
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
