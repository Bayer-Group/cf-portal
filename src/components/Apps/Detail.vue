<template>
  <!-- <v-app> -->
    <v-container v-if="Boolean(detail)" class="pa-0">
      <v-progress-circular v-if="state.loading" v-bind:indeterminate="true" secondary></v-progress-circular>
      <div v-if="!state.loading">
          <v-layout v-for="(value, key, index) in detail.entity" :key="key" row wrap>
            <v-flex  xs6 md6 lg6>
              {{key}}
            </v-flex>
            <v-flex  xs6 md6 lg6>
              {{value}}
            </v-flex>
          </v-layout>
      </div>
    </v-container>    
</template>

<script>
const axios = require('axios')
export default {
  props: {
    appGuid: 'null'
  },
  data () {
    return {
      guid: this.$route.params.guid || this.$props.appGuid,
      state: {
        loading: false
      },
      detail: null,
      keyList: [
        'name',
        'space_guid',
        'detected_buildpack',
        'memory',
        'instances',
        'disk_quota',
        'state',
        'docker_image'
      ]
    }
  },
  beforeMount () {
    console.log('beforeMount app-details')
    console.log(this.guid)
    console.log(this.$route.params.guid)
    const get = axios.get(`/rest/apps/${this.guid}`)
    this.state.loading = true
    get.then((res) => {
      this.detail = res.data
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
