export default defineNuxtRouteMiddleware((to) => {
  if (!to.query.host_id) {
    return navigateTo({ path: "/index" });
  } else {
    return;
  }
});
