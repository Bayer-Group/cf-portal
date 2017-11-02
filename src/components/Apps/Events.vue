<template>
  <div>
    <v-progress-circular v-if="state.loading" v-bind:indeterminate="true" secondary></v-progress-circular>
    <v-container v-else>
      <v-layout justify-space-around>
        <v-flex xs6 md6 lg6 offset-md4>
          <v-list v-if="events.length > 0" class="transparent">
            <div v-for="item in events" :key="item.actor" row wrap>
              <v-layout v-for="(value, key, index) in item" :key="key">
                <v-flex  xs6 md6 lg6>
                  {{key}}
                </v-flex>
                <v-flex  xs6 md6 lg6>
                  {{value}}
                </v-flex>
              </v-layout>
              <v-divider class="elevation-2 ma-2"></v-divider>
            </div>
          </v-list>
          <v-list v-else class="transparent">
            <h5>No recent events found</h5>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
const axios = require('axios')
const _ = require('underscore')
export default {
  props: ['guid'],
  data () {
    return {
      state: {
        loading: false
      },
      events: null,
      keyList: [ // Keys we want to keep
        'type',
        'actor_type',
        'actor_name',
        'actor_username',
        'actee_name',
        'timestamp'
      ]
    }
  },
  beforeMount () {
    console.info(this.guid)
    console.info('beforeMount')
    const get = axios.get(`/rest/apps/${this.guid}/events`)
    this.state.loading = true
    get.then((res) => {
      this.events = res.data.resources
      this.events = this.events
      .map((item) => { return _.pick(item, 'entity') })
      .map((entity) => { return entity.entity })
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
