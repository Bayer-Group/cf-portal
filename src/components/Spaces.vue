<template>
  <v-app>
     <v-progress-linear v-if="state.loading" v-bind:indeterminate="true" secondary></v-progress-linear>
      <bread-crumbs :items="breadCrumbs"></bread-crumbs>
     <v-container grid-list-md>
       <v-layout row wrap>
        <v-flex v-for="(value, key, index) in table.items" :key="value.space_guid" xs12 md4 lg4 dense>
          <card-view 
            :title="key"
            :guid="value[0].space_guid"
            :size="value.length"
            :countTitle="'Apps'"
            :secondaryTitle="value[0].org"
            guidTitle="Space Guid"
          >
           <slot name="orgName"></slot>
          </card-view>
        </v-flex>
       </v-layout>
     </v-container>
  </v-app>
</template>

<script>
const _ = require('underscore')
const axios = require('axios')
import CardView from '@/components/CardView'
import BreadCrumbs from '@/components/BreadCrumbs'
export default {
  components: {
    CardView: CardView,
    BreadCrumbs: BreadCrumbs
  },
  data () {
    return {
      state: {
        loading: false,
        pageNum: 1
      },
      table: {
        items: []
      },
      breadCrumbs: [
        {text: 'Home', linkTo: '/'},
        {text: 'Spaces'}
      ]
    }
  },
  beforeMount () {
    console.log('beforeMount')
    const get = axios.get(`/rest/aggregrate`)
    this.state.loading = true
    get.then((res) => {
      this.table.items = _.groupBy(res.data.all, 'space')
      console.log(res.data.length)
      console.log()
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
    },
    grabUniqueKeys () {
      _.keys(_.extend.apply({}, this.table.items))
    }
  }
}
</script>

<style>

</style>
