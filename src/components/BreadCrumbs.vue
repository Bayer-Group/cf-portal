<template>
  <v-breadcrumbs divider="/">
    <v-breadcrumbs-item :href="item.linkTo" v-for="item in items" :key="item.text">{{item.text}}</v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: ['items']
}
</script>

<style>

</style>
