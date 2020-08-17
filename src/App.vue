<template>
  <v-app>
    <v-app-bar app color="teal" dark>
      <v-toolbar-title class="headline text-uppercase" to="/">
        Skybox
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="bus.$emit('publish')" color="success">Save</v-btn>
    </v-app-bar>

    <v-main>
      <Home :bus="bus" />
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow: auto;
}
::-webkit-scrollbar-track {
  background-color: #202020;
}
::-webkit-scrollbar {
  width: 13px;
  background-color: #202020;
}
::-webkit-scrollbar-thumb {
  background-color: #555;
}
</style>

<script>
import Home from "./components/Home";
import Vue from "vue";

export default {
  name: "App",

  data: function() {
    return {
      bus: new Vue()
    };
  },

  components: {
    Home
  }
};
</script>
