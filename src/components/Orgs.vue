<template>
  <v-app>
     <v-progress-linear v-if="state.loading" v-bind:indeterminate="true" secondary></v-progress-linear>
     <bread-crumbs :items="breadCrumbs"></bread-crumbs>
     <v-container grid-list-md>
       <v-layout row wrap> 
         <v-flex v-for="(value, key, index) in table.items" :key="value.space_guid" xs12 md4 lg4 dense>
          <card-view 
            :title="key"
            :guid="value[0].organization_guid"
            :size="value.space_count.length"
            :countTitle="'Space(s)'"
            guidTitle="Organization Guid"
          > </card-view>
         </v-flex>
       </v-layout>
     </v-container>
  </v-app>
</template>

<script>
const axios = require('axios')
import BreadCrumbs from '@/components/BreadCrumbs'
import CardView from '@/components/CardView'
const _ = require('underscore')
export default {
  components: {
    BreadCrumbs: BreadCrumbs,
    CardView: CardView
  },
  data () {
    return {
      state: {
        loading: false,
        pageNum: 1,
        titleKey: 'name'
      },
      breadCrumbs: [
        {text: 'Home', linkTo: '/'},
        {text: 'Orgs'}
      ],
      table: {
        items: []
      }
    }
  },
  beforeMount () {
    console.log('beforeMount')
    const get = axios.get(`/rest/aggregrate`)
    this.state.loading = true
    let totalSpaceCount = 0
    get.then((res) => {
      this.table.items = _.groupBy(res.data.all, 'org')
      Object.keys(this.table.items).forEach((key) => {
        let curr = this.table.items[key]
        curr.space_count = _.uniq(_.pluck(curr, 'space_guid'))
        totalSpaceCount += curr.space_count.length
      })
      console.info('Total Spaces Calculated=', totalSpaceCount)
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
