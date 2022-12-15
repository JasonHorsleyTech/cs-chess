export default defineNuxtRouteMiddleware((to) => {
  if (!to.query.id || !to.query.secret) {
    return navigateTo({ path: "/index" });
  } else {
    return;
  }
});
