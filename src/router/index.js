import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import EmailDesign from "../views/EmailDesign";
import CertDesign from "../views/CertDesign";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/design",
    name: "Design",
    component: EmailDesign
  },
  {
    path: "/cert",
    name: "Cert Design",
    component: CertDesign
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
