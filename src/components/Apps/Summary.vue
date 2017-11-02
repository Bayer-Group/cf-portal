<template>
    <v-container class="pa-0" >
    <v-progress-circular v-if="state.loading" v-bind:indeterminate="true" secondary></v-progress-circular>
      <div v-if="!state.loading">
        <v-layout v-for="key in keyList" :key="key" row wrap>
        <!-- <v-layout v-for="(value, key, index) in summary" :key="key" row wrap> -->
        <!-- <v-list> -->
          <v-flex  xs12 md6 lg6>
            {{key}}
          </v-flex>
          <v-flex  xs12 md6 lg6>
            {{summary[key]}}
          </v-flex>
        <!-- </v-list> -->
        </v-layout>
      </div>
    </v-container>
</template>

<script>
const axios = require('axios')
export default {
  data () {
    return {
      guid: this.$route.params.guid,
      state: {
        loading: false
      },
      summary: null,
      keyList: [ // List of keys to include in the summary
        'guid',
        'running_instances',
        'space_guid',
        'memory',
        'instances',
        'disk_quota',
        'state',
        'package_state',
        'docker_image',
        'package_updated_at',
        'detected_start_command',
        'enable_ssh'
      ]
    }
  },
  beforeMount () {
    console.log('beforeMount')
    const get = axios.get(`/rest/apps/${this.guid}/summary`)
    this.state.loading = true
    get.then((res) => {
      this.summary = res.data
      this.state.loading = false
    }).catch((err) => {
      console.error(err)
      this.state.loading = false
    })
  }
}
</script>

<style>

</style>
