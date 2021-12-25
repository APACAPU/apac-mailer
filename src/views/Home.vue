<template>
  <div class="body">
    <div>
      <h2>Email Structure</h2>
      <div style="color: red">Make sure you have at least saved your design before writing here!</div>
      <div class="d-flex flex-row align-center my-5">
        <h3 class="mr-5">Adding cert as attachment?</h3>
        <v-switch
            v-model="useCert"
            :label="useCert ? 'yes' : 'no'"
            hide-details
        ></v-switch>
      </div>

      <v-form
        ref="form">
        <div>
          <h2>Your email</h2>
          <p>Note: head to <a @click="goTo('https://www.google.com/settings/security/lesssecureapps')">here</a>
            to enable less secure apps and <a
              @click="goTo('https://accounts.google.com/b/0/displayunlockcaptcha')">here</a> to disable captcha</p>
          <v-row no-gutters class="justify-center" style="width: 300px;">
            <v-col cols="12">
              <v-text-field
                  color="#4E4B66"
                  outlined
                  single-line
                  label="Email Address"
                  prepend-inner-icon="mdi-email-outline"
                  v-model.trim="email"
                  :rules="[rules.required, rules.email]"
                  class="rounded-xl txt-field-grey"
                  dense
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  color="#4E4B66"
                  outlined
                  single-line
                  label="Password"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  v-model.trim="password"
                  :rules="[rules.required]"
                  :type="showPass ? 'text' : 'password'"
                  class="rounded-xl txt-field-grey"
                  dense
                  @click:append="showPass = !showPass"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <div>
          <h2>Mail to</h2>
          <div class="my-2">Note: Please send in csv format, with the first row as column names (You can export with excel) <br>
          <b>Separator</b>: What splits the column apart? Comma(,) is the default.</div>
          <v-row no-gutters>
            <v-col cols="4">
              <input type="file" @change="loadFile" accept=".csv">
            </v-col>
            <v-col cols="2">
              <v-text-field
                  color="#4E4B66"
                  outlined
                  single-line
                  label="Separator"
                  class="rounded-xl txt-field-grey"
                  dense
                  v-model="separator"></v-text-field>
            </v-col>
          </v-row>

          <v-card v-if="headers.length != 0">
            <v-card-title>
              <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
                v-model="selected"
                :headers="headers"
                :items="recipients"
                :item-key="tableKey"
                show-select
                class="elevation-1"
                :search="search"
            >
            </v-data-table>
          </v-card>
          <div class="mt-10 mb-4" v-if="headers.length != 0">
            <h3>Misc</h3>
            <v-row no-gutters align="center" style="margin-bottom: 15px;">
              <v-col cols="3">
                <v-subheader>
                  Email Column
                </v-subheader></v-col>
              <v-col cols="3">
                <v-select
                    :items="headers"
                    v-model="emailCol"
                  ></v-select>
              </v-col>
              <v-col cols="6"></v-col>
              <v-col cols="3" v-if="useCert">
                <v-subheader>
                  Name Column
                </v-subheader></v-col>
              <v-col cols="3" v-if="useCert">
                <v-select
                    :items="headers"
                    v-model="nameCol"
                ></v-select>
              </v-col>
            </v-row>
            <v-row no-gutters style="margin-bottom: 15px">
              <v-col cols="3">
                <v-subheader>
                  Subject
                </v-subheader></v-col>
              <v-col cols="9">
                <v-text-field v-model="subject" outlined dense></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters align="center" style="margin-top: 25px; margin-bottom: 25px">
              <v-col cols="3">
                <v-subheader>
                  Variables
                </v-subheader></v-col>
              <v-col cols="6">
                <p>You can wrap any of the headers with ^*___*^ to use them in the email</p>
                <h4>Examples:</h4>
                <div
                    v-for="(header, idx) in headers"
                    :key = idx
                >^*{{header.value}}*^</div>
              </v-col>
            </v-row>
            <v-row no-gutters align="center" style="margin-top: 25px; margin-bottom: 25px">
              <v-col cols="3">
                <v-subheader>
                  Attachments
                </v-subheader></v-col>
              <v-col cols="6">
                <input type="file" multiple @change="setAttachments">
              </v-col>
            </v-row>
          </div>
        </div>
        <div v-if="headers.length != 0" class="text-center">
          <v-btn @click="send" color="primary">Send</v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
const {ipcRenderer} = window.require('electron');
const { shell } = require('electron');
import { jsPDF } from "jspdf";

export default {
  name: "Home",
  props: ["html", "cert"],
  components: {
  },
  data() {
    return {
      email: "",
      password: "",
      showPass: false,
      rules: {
        required: value => !!value || 'Required.',
        email: value => /^.+@.+\..+$/.test(value) || 'Invalid Email Format'
      },
      selected: [],
      headers: [],
      recipients: [],
      separator: ",",
      search: "",
      emailCol: '',
      currentId: 0,
      subject: '',
      failed: [],
      useCert: false,
      attachments: [],
      nameCol: '',
    }
  },
  methods: {
    async sendEmail() {
      let obj = this.emailObj();
      ipcRenderer.send('send-email', obj);
    },
    send() {
      if(!this.$refs.form.validate()) {
        return;
      }
      if (this.selected.length == 0) {
        alert("Please select at least one row!");
        return;
      }
      if (this.html == '') {
        alert("Please create a design in EMAIL DESIGN tab");
        return;
      }
      if (this.useCert) {
        if (this.cert == null) {
          alert("Please create a cert design!");
          return;
        }
        if (this.nameCol == '') {
          alert("Please select a name column");
          return;
        }
      }
      this.$emit('progress', this.currentId);
      this.sendEmail();
    },
    emailListener(evt, message) {
      if (message == 'fails') {
        console.log(this.selected[this.currentId]);
        this.failed.push(this.selected[this.currentId]);
      }
      if (++this.currentId < this.selected.length) {
        this.$emit('progress', this.currentId, this.selected.length);
        setTimeout(() => this.sendEmail(), 500);
      } else {
        this.currentId = 0;
        console.log(this.failed);
        this.$emit("completed", this.failed.length === 0);
        this.selected = [];
        this.recipients = this.failed;
      }
    },
    goTo(link) {
      shell.openExternal(link);
    },
    loadFile(e) {
      let f = e.target.files[0];
      if (f) {
        var reader = new FileReader();
        reader.readAsText(f, "UTF-8");
        reader.onload = (evt) => {
          this.formatCSV(evt.target.result);
        }
        reader.onerror = function () {
          alert("Something went wrong, please try again");
        }
      }
    },
    formatCSV(csv) {
      let tmp = csv.split("\n");
      this.headers = [];
      this.recipients = [];
      for (let i = 0; i < tmp.length; i++) {
        let line = tmp[i].trim().split(this.separator == "" ? "," : this.separator);
        if (i == 0) {
          for (let val of line) {
            this.headers.push({
              text: val,
              value: val
            })
          }
          this.emailCol = this.headers[0].value;
        } else {
          let newLine = {};
          for (let val in line) {
            newLine[this.headers[val].value] = line[val];
          }
          this.recipients.push(newLine);
        }
      }
    },
    setAttachments(e) {
      this.attachments = [];
      if (e.target.files.length > 0) {
        for (let f of e.target.files) {
          this.attachments.push({
            filename: f.name,
            path: f.path,
          })
        }
      }
    },
    emailObj() {
      let formatHtml = this.html;
      for (let header of this.headers) {
        formatHtml = formatHtml.replace('^*' + header.value + '*^', this.selected[this.currentId][header.value]);
      }
      let obj = {
        email: this.email,
        password: this.password,
        to: this.selected[this.currentId][this.emailCol],
        html: formatHtml,
        subject: this.subject,
        attachments: []
      }
      for (let attachment of this.attachments) {
        obj.attachments.push(attachment);
      }
      if (this.useCert) {
        let pdf = new jsPDF({
          orientation: this.cert.orientation
        })
        pdf.setFontSize(this.cert.fontSize);
        pdf.addImage(this.cert.imgPath, this.cert.imgType, 0, 0, this.cert.width,  this.cert.height);
        pdf.setTextColor(this.cert.color.r, this.cert.color.g, this.cert.color.b);
        pdf.text(this.selected[this.currentId][this.nameCol], this.cert.x, this.cert.y);
        let data = pdf.output('dataurl');
        obj.attachments.push({
          filename: (this.cert.fileName == '' ? 'attachment' : this.cert.fileName) + '.pdf',
          content: data.split("base64,")[1],
          encoding: 'base64',
        })
      }
      return obj;
    }
  },
  created() {
    ipcRenderer.on('email-reply', this.emailListener);
  },
  computed: {
    tableKey() {
      if (this.headers.length == 0) {
        return '';
      }
      return this.headers[0].value;
    },
  }
};
</script>
<style scoped>
  .body {
    padding: 20px 40px;
  }
</style>

<style>
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
</style>