<template>
  
</template>

<script>
export default {
  data () {
    return {
      state: {
        loading: false
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
