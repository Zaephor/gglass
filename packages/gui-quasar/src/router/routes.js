const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        components: { default: () => import("pages/main/Index.vue") },
      },
      {
        path: ":id",
        components: { default: () => import("pages/main/Iframe.vue") },
      },
      {
        path: ":id/:childId",
        components: { default: () => import("pages/main/Iframe.vue") },
      },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", components: { default: () => import("pages/Error404.vue") } },
    ],
  });
}

export default routes;
