<template>
  <div class="main">
    <h1>Cert Design</h1>
    <input type="file" accept="image/*" @change="loadImg">
    <div class="editor my-8" v-if="imgPath != ''">
      <v-row no-gutters align="center">
        <v-col cols="3">
          <v-text-field
              color="#4E4B66"
              outlined
              single-line
              label="File Name (no need .pdf)"
              class="txt-field-grey"
              dense
              v-model="fileName"
              @change="createPdf"></v-text-field>
        </v-col>
        <v-col cols="9"></v-col>
        <v-col cols="2">
          <v-subheader>
            Orientation
          </v-subheader>
        </v-col>
        <v-col cols="3">
          <v-select
              :items="['landscape', 'portrait']"
              v-model="orientation"
          ></v-select>
        </v-col>
        <v-col cols="7"></v-col>
        <v-col cols="12" class="mb-8">
          <h2>Name</h2>
        </v-col>
        <v-col cols="3">
          <v-slider
              v-model="fontSize"
              label="Font-size"
              thumb-color="primary"
              thumb-label="always"
              min="0"
              @change="createPdf"
          >
            <template v-slot:append>
              <v-text-field
                  v-model="fontSize"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
        <v-col cols="1"></v-col>
        <v-col cols="2">
          <v-subheader>
            Font color <br>(Note: alpha will be ignored)
          </v-subheader>
        </v-col>
        <v-col cols="3">
          <v-row>
            <v-col class="col-10 mp-0">
              <div class=""
                   :style="{backgroundColor: 'rgb(' + joinedColor + ')'}"
                   style="height: 40px; border: 1px #D6D8E7 solid;">
              </div>
            </v-col>
            <v-col class="col-2 mp-0">
              <v-menu
                  content-class="design-menu"
                  right
                  offset-x
                  transition="slide-x-transition"
                  :close-on-content-click="false"
                  :rounded="false"
              >
                <template v-slot:activator="{on, attrs}" >
                  <v-btn
                      v-bind="attrs"
                      v-on="on"
                      depressed
                      icon
                      small
                      v-ripple="false"
                      style="margin-top: 5px;"
                      >
                    <v-icon>mdi-format-color-fill</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-text class="pa-0">
                    <v-color-picker
                        v-model="color"
                        flat
                        @change="createPdf"
                        show-swatches/>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6" class="pr-15">
          <v-slider
              v-model="names.x"
              label="X (distance from left)"
              thumb-color="primary"
              min="0"
              max="300"
              @change="createPdf"
          >
            <template v-slot:append>
              <v-text-field
                  v-model="names.x"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
        <v-col cols="6" class="pl-15">
          <v-slider
              v-model="names.y"
              label="Y (distance from top)"
              thumb-color="primary"
              min="0"
              max="300"
              @change="createPdf"
          >
            <template v-slot:append>
              <v-text-field
                  v-model="names.y"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
        <v-col cols="3">
          <div>
            <b>Test name</b><br> (Name column will be inserted here) <br>
            <span class="red--text">(make sure you choose the longest name)</span>
          </div>
        </v-col>
        <v-col cols="4">
          <v-text-field
              color="#4E4B66"
              outlined
              single-line
              label="Name"
              class="txt-field-grey"
              dense
              hide-details
              v-model="names.name"
              @input="createPdf"></v-text-field>
        </v-col>
        <v-col cols="3" class="pl-4">
          <v-switch
              v-model="alignCenter"
              :label="`Align Center: ${alignCenter.toString()}`"
              hide-details
          ></v-switch>
        </v-col>
      </v-row>
      <div class="text-center">
        <v-btn color="primary" @click="saveCert" class="mb-7">Save</v-btn>
        <h2>Preview</h2>
      </div>
      <embed type="application/pdf" width="100%" height="700px" id="cert">
    </div>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
export default {
  name: "CertDesign",
  methods: {
    createPdf() {
      this.pdf = new jsPDF({
        orientation: this.orientation
      })
      this.pdf.setFontSize(this.fontSize);
      this.pdf.setTextColor(this.color.r, this.color.g, this.color.b);
      if (this.orientation == 'portrait') {
        this.pdf.addImage(this.imgPath, this.imgType, 0, 0, 210, 297);
      } else {
        this.pdf.addImage(this.imgPath, this.imgType, 0, 0, 298, 210);
      }

      this.pdf.text(this.names.name, this.names.x, this.names.y, this.alignCenter ? "center" : "left");
      document.getElementById("cert").src = this.pdf.output('bloburl')
    },
    loadImg(e) {
      if (e.target.files[0]) {
        this.imgPath = e.target.files[0].path;
        this.createPdf();
      }
    },
    saveCert() {
      this.$emit('cert', this.obj);
      alert("Saved successfully")
    }
  },
  watch: {
  },
  computed: {
    joinedColor() {
      return this.color.r + ',' + this.color.g + ',' + this.color.b;
    },
    imgType() {
      return this.imgPath.split('.').pop().toUpperCase();
    },
    obj() {
      let width = 297;
      let height = 210;
      if (this.orientation == 'portrait') {
        height = 297;
        width = 210;
      }
      return {
        imgPath: this.imgPath,
        imgType: this.imgType,
        fileName: this.fileName,
        orientation: this.orientation,
        fontSize: this.fontSize,
        x: this.names.x,
        y: this.names.y,
        width: width,
        height: height,
        color: this.color,
        alignCenter: this.alignCenter
      };
    },
  },
  data() {
    return {
      imgPath: '',
      fileName: '',
      orientation: 'landscape',
      pdf: null,
      fontSize: 16,
      names: {
        x : 0,
        y : 0,
        name: 'Hoh Shen Yien'
      },
      color: {
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 1
      },
      alignCenter: false
    }
  },
  created() {

  }
}
</script>

<style scoped>
.main {
  padding: 20px 40px;
}
</style>