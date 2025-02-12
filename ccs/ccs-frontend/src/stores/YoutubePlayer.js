import { defineStore } from "pinia";
import { api } from "./Auth";

export const useYTPlayerStore = defineStore('ytPlayer', {
    state: () => ({
        ytURL: 'https://www.youtube-nocookie.com/embed/YA2Lxfw4SSw?mute=1&loop=1&modestbranding=1&rel=0&enablejsapi=1&playlist=YA2Lxfw4SSw',
        isLoading: false,
        message: null,
        errors: [],
    }),

    actions: {
        async getYTURL(id) {
            try {
                this.isLoading = true;
                const res = await api.get(`/api/yt-urls/${id}`);

                if (res.data.yTPlayer.yt_url) {
                    const videoId = this.extractVideoID(res.data.yTPlayer.yt_url);
                    this.ytURL = this.constructEmbedURL(res.data.yTPlayer.yt_url, videoId)
                }
            } catch (error) {
                this.errors = error.response?.data || { message: "Failed to fetch url" };
            } finally {
                this.isLoading = false;
            }
        },
        async updateURL(id, url) {
            try {
                this.isLoading = true;
                const res = await api.put(`/api/yt-urls/${id}`, {
                     yt_url: url
                });

                if (res.data.yt_url) {
                    const videoID = this.extractVideoID(res.data.yt_url);
                    this.ytURL = this.constructEmbedURL(res.data.yt_url, videoID)
                }

                this.message = "URL updated successfully";
            } catch (error) {
                this.errors = error.response?.data || { message: "Failed to update URL" };
            } finally {
                this.isLoading = false;
            }
           
        },

        extractVideoID(url) {
            const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(regex);
            return match ? match[1] : null;
        },

        constructEmbedURL(originalUrl, videoID) {
            const baseURL = 'https://www.youtube-nocookie.com/embed/';
            const settings = 'mute=1&loop=1&modestbranding=1&rel=0&enablejsapi=1';

            const playlistMatch = originalUrl.match(/[?&]list=([^&]+)/);
            let embedURL = `${baseURL}${videoID}?${settings}`;

             if (playlistMatch) {
                embedURL += '&loop=1&list=' + playlistMatch[1];
            }
           
            return embedURL;
        }
    },
})