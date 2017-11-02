<template>
  <v-app>
     <v-progress-linear v-if="state.loading" v-bind:indeterminate="true" secondary></v-progress-linear>
     <v-container fluid>
       <!-- {{items || 'No items found'}} -->
      <v-card>
        <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="table.search"
          :rules="[table.max25chars]"
        ></v-text-field>
        </v-card-title>
        <v-data-table
          v-bind:headers="table.headers"
          :items="table.items"
          class="elevation-1"
          light
          :rows-per-page-items="[25,50,100]"
          v-bind:search="table.search"
          selected-key="app_guid"
        >
          <template slot="items" scope="props" >
            <tr @click="rowClickHandler(props.item.app_guid, $event)" :id="props.item.app_guid">
              <td class="text-xs-left">{{ props.item.app_name }}</td>
              <td class="text-xs-right">{{ props.item.state }}</td>
              <td class="text-xs-right">{{ props.item.space_name }}</td>
              <td class="text-xs-right">{{ props.item.organization_name }}</td>
            </tr>
          </template>
          <template slot="footer">
            <td colspan="100%">
              <strong>This is an extra footer</strong>
            </td>
          </template>
        </v-data-table>
      </v-card>
     </v-container>
  </v-app>
</template>

<script>
const axios = require('axios')
// var async = require('asyncawait/async')
// var awaits = require('asyncawait/await')
export default {
  data () {
    return {
      state: {
        loading: false,
        pageNum: 1
      },
      table: {
        max25chars: (v) => v.length <= 25 || 'Input too long!',
        items: [],
        headers: [
          { text: 'Application Name', value: 'app_name', 'align': 'left' },
          { text: 'State', value: 'state' },
          { text: 'Space Name', value: 'space_name' },
          { text: 'Organization Name', value: 'organization_name' }
        ],
        search: ''
      }
    }
  },
  beforeMount () {
    console.log('beforeMount')
    const get = axios.get(`/rest/aggregrate`)
    this.state.loading = true
    get.then((res) => {
      this.table.items = res.data
      this.state.loading = false
    }).catch((err) => {
      console.error(err)
      this.state.loading = false
    })
  },
  methods: {
    rowClickHandler (guid, event) {
      console.log(guid)
      console.log(event)
      alert('Hello ' + guid)
    }
  }
}
</script>

<style>

</style>
