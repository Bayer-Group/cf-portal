<template>
    <v-card  height="180px" class="elevation-3">
      <v-card-title class="pb-1" tile>
      <em>{{title}}</em>
      <v-spacer></v-spacer>
      <span class="pb-1" slot="orgName">{{secondaryTitle}}</span>
      </v-card-title>
      <v-divider class="elevation-2"></v-divider>
      <v-card-text class="px-1">
        {{guidTitle}}</br>{{guid}}
        </v-card-text>
      <v-card-actions >
          <v-container>
          <v-chip label class="secondary white--text">
            <v-icon left>label</v-icon>
            {{size}}
            {{countTitle}}
          </v-chip>
        </v-container>               
      </v-card-actions>
    </v-card>
</template>

<script>
export default {
  props: ['title', 'guid', 'size', 'countTitle', 'secondaryTitle', 'guidTitle']
}
</script>

<style>

</style>
