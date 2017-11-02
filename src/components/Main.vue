<template>
  <v-app>
     <v-progress-linear v-if="state.loading" v-bind:indeterminate="true" secondary></v-progress-linear>
         <v-snackbar 
          v-model="state.error"
          :timeout="6000"
          :top="true"
          :bottom="false"
          :right="false"
          :left="false"
          :multi-line="true"
          :vertical="true"
          >
          {{state.errorMessage}}
          </v-snackbar>
     <v-container fluid>
      <v-card>
        <v-card-title>
         <strong class="pt-3"><em>Last Updated: {{this.state.updatedTime}}</em></strong>
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
            <tr>
              <td :id="props.item.app_guid" class="pa-0">
                <router-link :to="buildAppsUrl(props.item.guid, 'overview')">
                  <v-btn small icon v-tooltip:right="{ html: `View ${props.item.app_name} detail`}" class="ma-0">
                  <v-icon white small class="">zoom_in</v-icon>
                  </v-btn>
                </router-link>
              </td>
              <td class="text-xs-center pa-1">{{ props.item.name }}</td>
              <td class="text-xs-center">{{ props.item.guid }}</td>
              <td class="text-xs-center pa-1">{{ props.item.state }}</td>
              <td class="text-xs-center pa-1">{{ props.item.space }}</td>
              <td class="text-xs-center pa-1">{{ props.item.org }}</td>
            </tr>
          </template>
          <template slot="footer">
            <td colspan="100%">
              <strong><em class="pt-3">Last Updated: {{this.state.updatedTime}}</em></strong>
            </td>
          </template>
        </v-data-table>
      </v-card>
     </v-container>
  </v-app>
</template>

<script>
const axios = require('axios')
export default {
  data () {
    return {
      state: {
        loading: false,
        pageNum: 1,
        updatedTime: null,
        error: false,
        errorMessage: null
      },
      table: {
        max25chars: (v) => v.length <= 25 || 'Input too long!',
        items: [],
        headers: [
          { text: 'Detail', value: 'name', 'align': 'left', sortable: false },
          { text: 'Name', value: 'name', 'align': 'left' },
          { text: 'Guid', value: 'guid', 'align': 'left' },
          { text: 'State', value: 'state' },
          { text: 'Space Name', value: 'space' },
          { text: 'Organization Name', value: 'org' }
        ],
        search: ''
      }
    }
  },
  beforeMount () {
    window.addEventListener('unhandledrejection', event => {
      // Can prevent error output on the console:
      event.preventDefault()
      // Send error to log server
      console.log('Reason: ' + event.reason)
    })
    console.log('beforeMount')
    const get = axios.get(`/rest/aggregrate`)
    this.state.loading = true
    get.then((res) => {
      this.table.items = res.data.all
      this.state.updatedTime = res.data.updated
      console.log(this.state.updatedTime)
      this.state.loading = false
    }).catch((err) => {
      console.error('In catch error handler Main')
      console.error(err.config)
      this.state.error = true
      this.state.errorMessage = {status: err.config.status, error: err.config.statusText}
      this.state.loading = false
    })
  },
  methods: {
    rowClickHandler (guid, event) {
      console.log(guid)
      console.log(event)
      alert('Hello ' + guid)
    },
    buildAppsUrl (guid, endpoint) {
      return endpoint ? `/apps/${guid}/${endpoint}` : `/apps/${guid}`
    }
  }
}
</script>

<style>

</style>
