<template>
  <v-container fluid class="main-container">
    <v-row no-gutters>
      <v-col lg="4" md="12">
        <p>{{ codePresets[0].html.filename }}</p>
        <codemirror
          :value="codePresets[0].html.content"
          :options="cmOptions"
          @input="updateHTML"
        />
      </v-col>
      <v-col lg="4" md="12">
        <p>{{ codePresets[0].js.filename }}</p>
        <codemirror
          class="editorBorder"
          :value="codePresets[0].js.content"
          :options="{ ...cmOptions, mode: 'text/javascript' }"
          @input="updateJS"
        />
      </v-col>
      <v-col lg="4" md="12">
        <p>{{ codePresets[0].css.filename }}</p>
        <codemirror
          :value="codePresets[0].css.content"
          :options="{ ...cmOptions, mode: 'text/css' }"
          @input="updateCSS"
        />
      </v-col>
      <v-col cols="12" class="output-parent">
        <v-btn class="open-output-btn" outlined @click="openOutput">
          <v-icon>launch</v-icon>
        </v-btn>
        <iframe
          :class="frameClass"
          class="output-frame"
          :src="outputUrl"
          frameborder="0"
        ></iframe>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.CodeMirror {
  height: 40vh;
}

.editorBorder {
  border-right: solid grey 1px;
  border-left: solid grey 1px;
}

.main-container {
  padding: 0;
}

.v-application p {
  margin: 3px;
}

.output-container {
  display: grid;
  justify-items: center;
  align-items: stretch;
}

.output-frame {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #121212;
}
.output-frame-mobile {
  height: 100vh;
  position: absolute;
}

.open-output-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 1;
}

.output-parent {
  position: relative;
}
</style>

<script>
import { getRelativeFilePath, SkynetClient } from "skynet-js";

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

  props: ["bus"],
  components: { codemirror },

  data() {
    return {
      outputUrl: "/AABlUOjo0E08j1ZJz7x8gUfIBuIe34LnTwEbwLEbtK6qUA/",
      cmOptions: {
        tabSize: 4,
        mode: "text/html",
        theme: "base16-dark",
        lineNumbers: true,
        line: true,
      },
      codePresets: [
        {
          name: "Default",
          html: {
            filename: "index.html",
            content: defaultHTML,
          },
          js: {
            filename: "main.js",
            content: defaultJS,
          },
          css: {
            filename: "style.css",
            content: defaultCSS,
          },
        },
      ],
      HTMLCode: defaultHTML,
      JSCode: defaultJS,
      CSSCode: defaultCSS,
    };
  },

  methods: {
    updateHTML: function (newCode) {
      this.HTMLCode = newCode;
    },
    updateJS: function (newCode) {
      this.JSCode = newCode;
    },
    updateCSS: function (newCode) {
      this.CSSCode = newCode;
    },
    publish: async function (callback) {
      const client = new SkynetClient();
      const files = [
        new File([this.HTMLCode], "index.html", {
          type: "text/html",
        }),
        new File([this.JSCode], "main.js", {
          type: "text/javascript",
        }),
        new File([this.CSSCode], "style.css", {
          type: "text/css",
        }),
      ];

      const directory = files.reduce((accumulator, file) => {
        const path = getRelativeFilePath(file);

        return { ...accumulator, [path]: file };
      }, {});

      const { skylink } = await client.uploadDirectory(directory, "skybox");
      this.outputUrl = `/${skylink}`;
      if (callback) callback();
    },

    openOutput: function () {
      window.open(this.outputUrl, "_blank");
    },
  },

  created() {
    this.bus.$on("publish", () => {
      this.publish();
    });
  },

  mounted: function () {
    document.addEventListener("keydown", (event) => {
      if (event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        // event.stopPropagation();
        this.publish();
      }
    });
  },

  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    frameClass: function () {
      if (/xs|sm|md/.test(this.$vuetify.breakpoint.name))
        return "output-frame-mobile";
    },
  },
};
</script>
