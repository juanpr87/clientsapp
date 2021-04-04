<template>
    <b-modal v-model="modalShow" id="DeleteConfirmationModal" :title="title"
    @ok="onConfirmDelete">
      Are you sure you want to delete {{ entity }} {{ name }}?
      <br>
      {{ extraInfo && extraInfo }}
    </b-modal>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.component('DeleteConfirmationModal', {
  data () {
    return {
      modalShow: false
    }
  },
  props: {
    // Entity name
    name: String,
    // 'client' or 'provider'
    entity: String,
    extraInfo: String,
    value: Boolean
  },
  created () {
    if (this.value === true) {
      this.modalShow = true
    }
  },
  methods: {
    onConfirmDelete () {
      this.$emit('submit')
    }
  },
  computed: {
    title (): string {
      if (this.name && this.entity) {
        return `Delete ${this.entity} ${this.name}`
      }
      return 'Delete'
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
    }
  }
})
</script>
