<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <codemirror
          ref="cmEditor"
          :value="codePresets[0].html"
          :options="cmOptionsHTML"
          @ready="onCmReady"
          @focus="onCmFocus"
          @input="onCmCodeChange"
        />
      </v-col>
      <v-col cols="4">
        <codemirror :value="codePresets[0].js" :options="cmOptionsJS" />
      </v-col>
      <v-col cols="4">
        <codemirror :value="codePresets[0].css" :options="cmOptionsCSS" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.CodeMirror {
  height: auto;
}
</style>

<script>
// import { ace } from "../assets/ace";
import { codemirror } from "vue-codemirror";

// import base style
import "codemirror/lib/codemirror.css";

// import language js
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/css/css.js";

// import theme style
import "codemirror/theme/base16-dark.css";

import defaultHTML from "raw-loader!../../templates/default/index.html";
import defaultJS from "raw-loader!../../templates/default/main.js";
import defaultCSS from "!raw-loader!../../templates/default/style.css";

export default {
  name: "Home",

  components: { codemirror },

  data() {
    return {
      cmOptionsHTML: {
        tabSize: 4,
        mode: "text/html",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
      },
      cmOptionsJS: {
        tabSize: 4,
        mode: "text/javascript",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
      },
      cmOptionsCSS: {
        tabSize: 4,
        mode: "text/css",
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
    },
    onCmFocus(cm) {
      console.log("the editor is focused!", cm);
    },
    onCmCodeChange(newCode) {
      console.log("this is new code", newCode);
      this.code = newCode;
    }
  }
};
</script>
