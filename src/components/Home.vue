<template>
  <v-container fluid class="main-container">
    <v-row no-gutters>
      <v-col lg="4" md="12">
        <codemirror :value="codePresets[0].html" :options="cmOptions" />
      </v-col>
      <v-col lg="4" md="12">
        <codemirror
          class="editorBorder"
          :value="codePresets[0].js"
          :options="{ ...cmOptions, mode: 'text/javascript' }"
        />
      </v-col>
      <v-col lg="4" md="12">
        <codemirror
          :value="codePresets[0].css"
          :options="{ ...cmOptions, mode: 'text/css' }"
        />
      </v-col>
      <v-col cols="12">
        <iframe :src="outputUrl" frameborder="0"></iframe>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.CodeMirror {
  height: 50vh;
}

.editorBorder {
  border-right: solid grey 1px;
  border-left: solid grey 1px;
}

.main-container {
  padding: 0;
}
</style>

<script>
// codemirror imports
import { codemirror } from "vue-codemirror";
// import base style
import "codemirror/lib/codemirror.css";
// import language js
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/css/css.js";
// import theme style
import "codemirror/theme/base16-dark.css";

// import editor templates
import defaultHTML from "!raw-loader!../../templates/default/index.html";
import defaultCSS from "!raw-loader!../../templates/default/style.css";
import defaultJS from "!raw-loader!../../templates/default/main.js";

export default {
  name: "Home",

  components: { codemirror },

  data() {
    return {
      outputUrl: "",
      cmOptions: {
        tabSize: 4,
        mode: "text/html",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
      },
      codePresets: [
        {
          name: "Default",
          html: defaultHTML,
          js: defaultJS,
          css: defaultCSS
        }
      ]
    };
  },
  methods: {
    onCmReady(cm) {
      console.log("the editor is readied!", cm);
    }
  }
};
</script>
