<template>
  <v-container class="pa-0">
    <v-progress-circular v-if="state.loading" v-bind:indeterminate="true" secondary></v-progress-circular>
    <div v-if="!state.loading">
      <v-container class="pa-3">
        <v-layout row wrap>
          <v-flex xs12 md6 lg6>
            State
          </v-flex>
          <v-flex xs12 md6 lg6>
            <span class="st">{{stats.state}}</span>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12 md6 lg6 >Disk Usage</v-flex>
          <v-flex xs12 md6 lg6>
              {{diskGauge}}
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12 md6 lg6 >Memory Usage</v-flex>
          <v-flex xs12 md6 lg6>
              {{memGauge}}
          </v-flex>
        </v-layout>
        <v-layout v-for="(value, key, index) in stats.stats" :key="key" row wrap>
          <v-flex xs12 md6 lg6>
            {{key}}
          </v-flex>
          <v-flex xs12 md6 lg6>
            {{value}}
          </v-flex>
        </v-layout>
      </v-container>
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
      stats: null,
      memUsage: 0,
      diskUsage: 0,
      aMB: parseInt(1024 * 1024),
      memGauge: null,
      diskGauge: null
    }
  },
  beforeMount () {
    console.log('beforeMount')
    const get = axios.get(`/rest/apps/${this.guid}/stats`)
    this.state.loading = true
    get.then((res) => {
      this.stats = res.data
      this.memGauge = `${this.convertToMB(this.stats.stats.usage.mem)} MB / ${this.convertToMB(this.stats.stats.mem_quota)} MB`
      this.diskGauge = `${this.convertToMB(this.stats.stats.usage.disk)} MB / ${this.convertToMB(this.stats.stats.disk_quota)} MB`
      this.state.loading = false
    }).catch((err) => {
      console.error(err)
      this.state.loading = false
    })
  },
  methods: {
    convertToMB (bytes) {
      const mb = 1024 * 1024
      if (bytes < mb) return parseInt(bytes / 1024)
      else return parseInt(bytes / (1024 * 1024))
    }
  }
}
</script>

<style>
.st {
  font-size: 12px;
}
</style>
