<template>
  <div id="app">
    <v-app>
      <v-toolbar class="light-grey lighten-1" light fixed dense xs12 s12 m12 l12> 
        <v-toolbar-title><router-link to='/' class="appTitle">Cloud Foundry Portal</router-link> <sup>{{version}}</sup></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <router-link to='/orgs'><v-btn flat>Orgs</v-btn></router-link>
          <router-link to='/spaces'><v-btn flat>Spaces</v-btn></router-link>
      </v-toolbar-items>
      </v-toolbar>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
const {version} = require('../package.json')
export default {
  name: 'app',
  data () {
    return {
      version: version
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
a.appTitle {
  text-decoration: none;
  color: black;
}

a :visited {
  color: black
}
</style>
