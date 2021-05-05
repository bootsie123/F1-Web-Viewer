import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Main from "@/views/Main";

const routes = [
  {
    path: "/",
    component: Main
  },
  {
    path: "/*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
