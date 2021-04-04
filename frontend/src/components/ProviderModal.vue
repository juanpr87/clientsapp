<template>
    <b-modal v-model="modalShow" id="ProviderModal" :title="title"
    @ok="onSubmit">
      <b-form @submit.prevent="onSubmit">
        <b-form-group
          id="input-group-name"
          label="Name:"
          label-for="input-name"
          description="Please enter the provider name.">
          <b-form-input
            id="input-name"
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            required>
          </b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
</template>
<script lang="ts">
import Vue from 'vue'
import { Provider } from '../api/models'
export default Vue.component('ProviderModal', {
  data () {
    return {
      modalShow: false,
      form: {
        name: ''
      }
    }
  },
  props: {
    value: Boolean,
    // Provider to edit
    provider: Object
  },
  created () {
    if (this.value === true) {
      this.modalShow = true
    }
  },
  methods: {
    onSubmit () {
      const editedProvider: Provider = {
        id: this.provider.id,
        name: this.form.name
      }
      this.$emit('submit', editedProvider)
    }
  },
  computed: {
    title (): string {
      if (this.provider) {
        return `Edit provider ${this.provider.name}`
      }
      return 'Edit provider'
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
    provider: function (newValue) {
      if (newValue) {
        this.form.name = newValue.name
      }
    }
  }
})
</script>
