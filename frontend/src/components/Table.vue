<template>
  <div class="main">
    <b-table striped hover :items="clients" :fields="fields"
    :busy="loading" :primary-key="'id'">
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <!-- A custom formatted column -->
      <template #cell(edit)="data">
        <b-button class="mr-2" size="sm" variant="link" @click="onEditClient(data.item)">Edit</b-button>
      </template>

      <!-- A custom formatted column -->
      <template #cell(delete)="data">
        <b-button class="mr-2" size="sm" variant="link" @click="onRemoveClient(data.item)">Delete</b-button>
      </template>

      <!-- Optional default data cell scoped slot -->
      <template #cell()="data">
        <span class="table-cell">{{ data.value }}</span>
      </template>

      <template #table-caption>{{ captionMsg }}.</template>
    </b-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Client } from '../api/models'

export default Vue.component('Table', {
  data () {
    return {
      fields: ['name', 'email', 'phone', 'edit', 'delete']
    }
  },
  props: [
    'clients', 'loading'
  ],
  methods: {
    onEditClient (client: Client) {
      this.$emit('edit', client)
    },
    onRemoveClient (client: Client) {
      this.$emit('remove', client)
    }
  },
  computed: {
    captionMsg (): string {
      const clientsNumber = this.clients.length
      switch (clientsNumber) {
        case -1:
          return ''
        case 1:
          return 'Found 1 client'
        case 0:
          return 'No clients found'
        default:
          return `Found ${clientsNumber} clients`
      }
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  color: #42b983;
}
.table-cell {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
