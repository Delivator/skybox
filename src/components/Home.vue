<template>
  <v-container fluid class="main-container">
    <div class="main-grid">
      <div class="htmlEditor">
        <p>{{ codePresets[0].html.filename }}</p>
        <codemirror
          :value="HTMLCode"
          :options="cmOptions"
          @input="updateHTML"
          ref="HTMLEditor"
        />
      </div>
      <div class="jsEditor">
        <p>{{ codePresets[0].js.filename }}</p>
        <codemirror
          class="editorBorder"
          :value="JSCode"
          :options="{ ...cmOptions, mode: 'text/javascript' }"
          @input="updateJS"
          ref="JSEditor"
        />
      </div>
      <div class="cssEditor">
        <p>{{ codePresets[0].css.filename }}</p>
        <codemirror
          :value="CSSCode"
          :options="{ ...cmOptions, mode: 'text/css' }"
          @input="updateCSS"
          ref="CSSEditor"
        />
      </div>
      <div class="output">
        <v-btn
          class="open-output-btn"
          :href="`/${outputUrl}`"
          target="_blank"
          rel="noopener noreferrer"
          :loading="frameLoading"
          fab
          color="primary"
        >
          <v-icon>launch</v-icon>
        </v-btn>
        <iframe
          :class="frameClass"
          class="output-frame"
          :src="`/${outputUrl}`"
          frameborder="0"
          @loadstart="frameLoading = true"
          @loaded="frameLoading = false"
        ></iframe>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.main-grid {
  display: grid;
  grid-template-columns: repeat(3, calc(100vw / 3));
  grid-template-rows: auto calc(100% - 21px);
  grid-template-areas: "htmlEditor jsEditor cssEditor" "output output output";
}

@media only screen and (max-width: 1200px) {
  .main-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas: "htmlEditor" "jsEditor" "cssEditor" "output";
  }
}

.output {
  grid-area: output;
  position: relative;
}

.htmlEditor {
  grid-area: htmlEditor;
}

.jsEditor {
  grid-area: jsEditor;
}

.cssEditor {
  grid-area: cssEditor;
}
</style>

<style>
.CodeMirror {
  height: 40vh;
  max-width: 100vw;
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
</style>

<script>
import { getRelativeFilePath, SkynetClient } from "skynet-js";
import { utils } from "../mixins/utils";

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

const client = new SkynetClient();

export default {
  name: "Home",

  props: ["bus", "btnLoading"],
  components: { codemirror },
  mixins: [utils],

  data() {
    return {
      outputUrl: "AAA_T8m8K4Uj7e3LkfpUbGmnc2gAQbfnAxJpIFJlDs16KA",
      cmOptions: {
        tabSize: 4,
        mode: "text/html",
        theme: "base16-dark",
        lineNumbers: true,
        line: true,
        allowDropFileTypes: [],
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
      frameLoading: false,
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
      this.$emit("update:btnLoading", true);
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

      try {
        const { skylink } = await client.uploadDirectory(directory, "skybox");
        this.$emit("update:btnLoading", false);
        this.outputUrl = skylink;
        document.location.hash = skylink;
        if (callback) callback();
      } catch (error) {
        this.$emit("update:btnLoading", false);
        console.error(error);
      }
    },

    generateCodeSnipet: function (file, link) {
      if (/^image\//.test(file.type)) {
        return `<img src="/${link}" alt="${file.name}">`;
      } else if (/^video\//.test(file.type)) {
        return `<video src="/${link}" controls></video>`;
      } else if (/^audio\//.test(file.type)) {
        return `<audio src="/${link}" controls></audio>`;
      } else if (/\/javascrip/.test(file.type)) {
        // eslint-disable-next-line no-useless-escape
        return `<script src="/${link}"><\/script>`;
      } else if (/\/css/.test(file.type)) {
        return `<link rel="stylesheet" href="/${link}">`;
      } else {
        return `/${link}`;
      }
    },

    loadHashSkylink: function () {
      const hash = location.hash.replace("#", "");
      if (!hash || !this.skylinkRegex.test(hash)) return;
      this.getSkylinkFiles(hash).then(async (metadata) => {
        const subfiles = metadata.subfiles;
        if (!subfiles) return;
        if (subfiles["index.html"])
          this.HTMLCode = await this.getFileContent(`${hash}/index.html`);
        if (subfiles["main.js"])
          this.JSCode = await this.getFileContent(`${hash}/main.js`);
        if (subfiles["style.css"])
          this.CSSCode = await this.getFileContent(`${hash}/style.css`);
        this.outputUrl = hash;
      });
    },
  },

  beforeMount: function () {
    this.loadHashSkylink();
  },

  created() {
    this.bus.$on("publish", () => {
      this.publish();
    });
  },

  mounted: function () {
    // Publish when the you press CTRL+S
    document.addEventListener("keydown", (event) => {
      if (event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        this.publish();
      }
    });

    document.addEventListener("drop", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      let isHTMLEditor = false;

      event.path.forEach((element) => {
        if (isHTMLEditor || !element.classList) return;
        isHTMLEditor = element.classList.contains("htmlEditor");
      });

      if (!isHTMLEditor || !event.dataTransfer || !event.dataTransfer.files)
        return;

      const file = event.dataTransfer.files[0];
      let doc = this.htmlEditor.getDoc();
      let cursor;
      await this.sleep(100);
      cursor = doc.getCursor();
      doc.replaceRange(`Uploading ${file.name}...`, cursor);
      const { skylink } = await client.upload(file);
      let newCursor = doc.getCursor();
      this.HTMLCode = this.HTMLCode.replace(`Uploading ${file.name}...`, "");
      await this.sleep(100);
      doc.replaceRange(this.generateCodeSnipet(file, skylink), cursor);
      doc.setCursor(newCursor);
    });

    window.addEventListener("hashchange", () => {
      const hash = document.location.hash.replace("#", "");
      if (!hash || this.outputUrl === hash) return;
      this.loadHashSkylink();
    });
  },

  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    frameClass: function () {
      if (/xs|sm|md/.test(this.$vuetify.breakpoint.name))
        return "output-frame-mobile";
    },
    htmlEditor() {
      return this.$refs.HTMLEditor.codemirror;
    },
    jsEditor() {
      return this.$refs.JSEditor.codemirror;
    },
    cssEditor() {
      return this.$refs.CSSEditor.codemirror;
    },
  },
};
</script>
