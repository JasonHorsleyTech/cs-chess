export default defineNuxtRouteMiddleware((to) => {
  if (!to.query.id) {
    return navigateTo({ path: "/index" });
  } else {
    return;
  }
});
