<template>
  <div id="app">
    <v-app>
      <router-view />
      <NotificationsManager></NotificationsManager>
    </v-app>
  </div>
</template>

<script lang="ts">
import NotificationsManager from '@/components/NotificationsManager.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    NotificationsManager,
  },
})
export default class App extends Vue {}
</script>
