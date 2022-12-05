import Wad from "web-audio-daw"
export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      Wad,
    }
  }
})
