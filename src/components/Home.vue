<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <codemirror
          ref="cmEditor"
          :value="code"
          :options="cmOptions"
          @ready="onCmReady"
          @focus="onCmFocus"
          @input="onCmCodeChange"
        />
      </v-col>
      <v-col cols="6">
        <codemirror :value="code2" :options="cmOptions2" />
      </v-col>
    </v-row>
  </v-container>
</template>

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

export default {
  name: "Home",

  components: { codemirror },

  data() {
    return {
      cmOptions: {
        tabSize: 4,
        mode: "text/html",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
        // more CodeMirror options...
      },
      cmOptions2: {
        tabSize: 4,
        mode: "text/css",
        theme: "base16-dark",
        lineNumbers: true,
        line: true
        // more CodeMirror options...
      },
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`,
      code2: `html, body {
  margin: 0;
}`
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
