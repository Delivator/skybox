<template>
  <div style="display: flex;">
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" style="margin-right: 1rem;">help</v-icon>
      </template>
      <span>Got a slow portal?<br />Try a different one!</span>
    </v-tooltip>
    <v-select
      :items="portals"
      item-text="name"
      item-value="url"
      item-disabled="disabled"
      label="Change Skynet Portal"
      @change="changePortal"
      return-object
      style="max-width: 12rem; top: 5px;"
      single-line
    ></v-select>
  </div>
</template>

<script>
// https://stackoverflow.com/a/2450976/6287225
function shuffleArray(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default {
  data: function () {
    return {
      portals: [
        {
          name: "SiaSky.net",
          link: "https://siasky.net",
        },
      ],
    };
  },

  methods: {
    changePortal: function (portal) {
      let newUrl = new URL(portal.link);
      document.location.href = document.location.href.replace(
        document.location.origin,
        newUrl.origin
      );
    },
  },

  beforeMount: function () {
    const trustedPortals = "https://siastats.info/dbs/skynet_current.json";
    fetch(trustedPortals)
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((data) => {
        if (!data || data.length < 1 || !data[0].name || !data[0].link)
          return false;
        data = shuffleArray(data);
        data.forEach((portal, index) => {
          if (portal.link.includes(document.location.hostname)) {
            data[index].disabled = portal.link.includes(
              document.location.hostname
            );
            data.unshift(data[index]);
            data.splice(index + 1, 1);
          }
        });
        this.portals = data;
      })
      .catch((error) => console.error(error));
  },
};
</script>

<style></style>
