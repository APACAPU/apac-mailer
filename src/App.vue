<template>
  <v-app>
    <v-overlay
      :value="sending">
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column;
       justify-content: center; align-items: center;">
        <v-progress-circular
            :value="cur * 100"
            >
        </v-progress-circular>
        {{progress}}
      </div>
    </v-overlay>
      <v-app-bar app color="primary" dark>
        <v-app-bar-title>
          APAC Mailer
        </v-app-bar-title>
        <v-spacer></v-spacer>
          <v-btn
              :class="{'active':currentRoute == 'home'}"
              text
              @click="goHome">
              Email Settings
          </v-btn>
          <v-btn
              :class="{'active':currentRoute == 'design'}"
              text
              @click="emailDesign">
              Email Design
          </v-btn>
          <v-btn
              :class="{'active':currentRoute == 'cert'}"
              text
              @click="certDesign"
          >
              Cert Design
          </v-btn>
      </v-app-bar>

      <v-main id="main">
        <Home :html="html"
              :cert="cert"
              @progress="changeProgress"
              @completed="completed"
              :class="{'selected': currentRoute == 'home'}" class="hide"/>
        <EmailDesign @html="setDesign"
                     :class="{'selected': currentRoute == 'design'}"
                      class="hide"></EmailDesign>
        <CertDesign
                    :class="{'selected': currentRoute == 'cert'}"
                    class="hide"
                    @cert="saveCert"></CertDesign>
      </v-main>
  </v-app>
</template>

<script>
import Home from "./views/Home";
import CertDesign from "./views/CertDesign";
import EmailDesign from "./views/EmailDesign";

export default {
  name: "App",
  components: {Home, CertDesign, EmailDesign},
  data: () => ({
    currentRoute: "home",
    html: '',
    sending: false,
    progress: 0,
    cert: null,
    cur: 0
  }),
  methods: {
    goHome() {
      if (this.currentRoute == "home") {
        return;
      }
      this.currentRoute = "home";
    },
    emailDesign() {
      if (this.currentRoute == "design") {
        return;
      }
      this.currentRoute = "design";
    },
    certDesign() {
      if (this.currentRoute == "cert") {
        return;
      }
      this.currentRoute = "cert";
    },
    saveCert(cert) {
      this.cert = cert;
    },
    setDesign(design) {
      console.log(design);
      this.html = design;
    },
    changeProgress({cur, total}) {
      this.sending = true;
      this.progress = cur + " / " + total;
      this.cur = cur / total;
    },
    completed(e) {
      console.log("Completed2");
      this.sending = false;
      this.progress = 0;
      this.cur = 0;
      if (!e) {
        alert("Failed to send some emails, please check the new data on table for details");
      }
    }
  },
  created() {

  }
};
</script>

<style scoped>
.active {
  font-weight: bold;
  color: gold !important;
}

.hide {
  display: none;
}

.selected {
  display: block;
}
</style>
