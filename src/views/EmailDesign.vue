<template>
  <div id="email">
    <div class="container">
      <div id="bar">
        <h1>Email Editor</h1>
        <v-btn v-on:click="selectDesign">Import Design</v-btn>
        <v-btn v-on:click="exportDesign">Export Design</v-btn>
        <v-btn v-on:click="exportHtml">Save Design</v-btn>
      </div>
      <EmailEditor
          ref="emailEditor"
          v-on:load="editorLoaded"
          v-on:ready="editorReady"
      />
      <input type="file" accept=".json" style="visibility: hidden" @change="importDesign" id="design">
    </div>
  </div>
</template>

<script>
const fs = require('fs');
import { EmailEditor } from 'vue-email-editor';

export default {
  name: "EmailDesign",
  components: {
    EmailEditor,
  },
  methods: {
    // called when the editor is created
    editorLoaded() {
      console.log('editorLoaded');
    },
    editorReady() {
      console.log('editorReady');
    },
    selectDesign() {
      document.getElementById("design").click();
    },
    importDesign(e) {
      let f = e.target.files[0];
      if (f) {
        var reader = new FileReader();
        reader.readAsText(f, "UTF-8");
        reader.onload = (evt) => {
          this.storeDesign(evt.target.result);
        }
        reader.onerror = function () {
          alert("Something went wrong, please try again");
        }
      }
    },
    storeDesign(design) {
      console.log(design);
      let json = JSON.parse(design);
      this.$refs.emailEditor.editor.loadDesign(json);
    },
    exportDesign() {
      this.$refs.emailEditor.editor.saveDesign((design) => {
        try {
          fs.writeFileSync('design.json', JSON.stringify(design), 'utf-8');
              alert("exported successfully");
        }
        catch(e) { alert(e); }
      });
    },
    exportHtml() {
      this.$refs.emailEditor.editor.exportHtml((data) => {
        this.$emit('html', data.html);
        alert("Saved successfully");
      });
    },
  },
};
</script>
<style>
#email {
  height: 100%;
}

.container {
  height: 100%;
  flex-direction: column;
  position: relative;
}

.unlayer-editor > iframe {
  height: 720px !important;
}

#bar {
  flex: 1;
  background-color: #40B883;
  color: #FFF;
  padding: 10px;
  display: flex;
}

#bar h1 {
  flex: 1;
  font-size: 16px;
  text-align: left;
}
#bar button {
  flex: 1;
  padding: 10px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  background-color: #000;
  color: #FFF;
  border: 0;
  max-width: 150px;
  cursor: pointer;
}
</style>