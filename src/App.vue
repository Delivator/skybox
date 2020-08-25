<template>
  <v-app>
    <v-app-bar app color="teal" dark>
      <v-toolbar-title class="headline text-uppercase">
        <a href="./" class="white--text">Skybox</a>
      </v-toolbar-title>
      <v-btn
        class="run-btn"
        @click="bus.$emit('publish')"
        color="white"
        outlined
        tile
        :loading="btnLoading"
      >
        <v-icon left>send</v-icon> GO
      </v-btn>
      <v-spacer></v-spacer>
      <PortalSwitcher />
    </v-app-bar>

    <v-main>
      <Home :bus="bus" :btnLoading.sync="btnLoading" />
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow: auto;
}

.run-btn {
  margin-left: 1rem;
}

.headline a {
  text-decoration: none;
}
</style>

<script>
import PortalSwitcher from "./components/PortalSwitcher";
import Home from "./components/Home";
import Vue from "vue";

export default {
  name: "App",

  data: function () {
    return {
      bus: new Vue(),
      btnLoading: false,
    };
  },

  components: {
    Home,
    PortalSwitcher,
  },
};
</script>
