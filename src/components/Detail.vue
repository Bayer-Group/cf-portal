<template>
  <v-container fluid>
    <v-layout row>
          <v-flex xs12 sm12 md2 lg2>
            <v-list class="pa-0 ma-0" dense>
              <v-list-tile v-for="item in menuItems" :key="item.title" @click="setView(item.componentName)" :class="item.active ? 'elevation-2' : null">
                <v-list-tile-action>
                  <v-icon white small class="">{{item.icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{item.title}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        <v-container class="pa-0 ma-0">
          <v-flex xs12 sm12 md12 lg12>
          </v-flex>
          <v-flex xs12 sm12 md8 lg8>
            <h5>{{appName}}</h5>
            <component :is="current" :guid="guid"></component>
          </v-flex>
        </v-container>
    </v-layout>
  </v-container>
</template>




<script>
import AppSummary from '@/components/Apps/Summary'
import AppStats from '@/components/Apps/Stats'
import AppDetail from '@/components/Apps/Detail'
import Events from '@/components/Apps/Events'
import Logs from '@/components/Apps/Logs'
const axios = require('axios')
export default {
  data () {
    return {
      guid: this.$route.params.guid,
      current: 'app-detail',
      appName: null,
      menuItems: [
        {
          title: 'Details',
          icon: 'zoom_in',
          componentName: 'app-detail',
          active: true
        },
        {
          title: 'Summary',
          icon: 'info',
          componentName: 'app-summary',
          active: false
        },
        {
          title: 'Stats',
          icon: 'poll',
          componentName: 'app-stats',
          active: false
        },
        {
          title: 'Events',
          icon: 'event',
          componentName: 'events',
          active: false
        },
        {
          title: 'Logs',
          icon: 'event',
          componentName: 'logs',
          active: false
        }
      ],
      mini: false,
      windowSize: {x: 0, y: 0}
    }
  },
  components: {
    AppSummary: AppSummary,
    AppDetail: AppDetail,
    AppStats: AppStats,
    Logs: Logs,
    Events: Events
  },
  beforeMount () {
    axios.get(`/rest/apps/${this.guid}/name`).then((res) => {
      this.appName = res.data[0].name
    }).catch((err) => {
      console.error(err)
    })
  },
  mounted () {
    this.onResize()
  },
  methods: {
    onResize () {
      // This probably needs to be a watched or computed property
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
      console.log(this.windowSize.x)
      if (this.windowSize.x < 400) this.mini = true
    },
    setView (name) {
      console.log('Changing view', name)
      this.menuItems.forEach((item) => {
        if (item.componentName === name) {
          console.info('resetting active')
          item.active = true
        } else item.active = false
      })
      this.current = name
      console.log('------------------------------------')
      console.log('menuItems', JSON.stringify(this.menuItems, null, 2))
      console.log('------------------------------------')
    }
  }
}
</script>

<style>
.roundedTop {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.roundedBottom {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.rounded-right {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>
