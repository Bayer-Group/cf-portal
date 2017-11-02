<template>
  <main>
    <v-progress-circular v-if="state.loading" v-bind:indeterminate="true" secondary></v-progress-circular>
    <div v-if="!state.loading">
      <v-container v-if="logs.length >0">
        <!-- {{logs}} -->
        <v-list v-for="item in logs" :key="item">
            {{item}}
        </v-list>
      </v-container>
      <v-container v-else><h5> No recent logs found </h5>
      <v-icon x-large color="blue darken-2">sentiment_very_dissatisfied</v-icon></v-container>
    </div>

  </main>
</template>

<script>
const axios = require('axios')
const stripAnsi = require('strip-ansi')
export default {
  data () {
    return {
      state: {
        loading: false
      },
      logs: null
    }
  },
  props: ['guid'],
  beforeMount () {
    const get = axios.get(`/rest/apps/${this.guid}/logs`)
    this.state.loading = true
    get.then((res) => {
      this.state.loading = false
      console.info(res)
      this.logs = res.data.map((item) => {
        const filteredMessage = stripAnsi(item.message).split('\n')
        console.info(filteredMessage[0])
        return filteredMessage[0]
      })
      console.log(this.logs.length)
    }).catch((err) => {
      console.error(err)
    })
  }
}
</script>

<style>

</style>
