import { defineStore } from "pinia";

export const useYTPlayerStore = defineStore('ytPlayer', {
    state: () => ({
        ytURL: 'https://www.youtube-nocookie.com/embed/YA2Lxfw4SSw?mute=1&loop=1&modestbranding=1&rel=0&enablejsapi=1&playlist=YA2Lxfw4SSw'
    }),

    actions: {
        updateURL(url) {
            if (this.ytURL) {
                this.ytURL = url
            }
        }
    },
})