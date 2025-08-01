import { defineStore } from "pinia";
import { api } from "./Auth";

export const useYTPlayerStore = defineStore('ytPlayer', {
    state: () => ({
        ytURL: 'https://www.youtube-nocookie.com/embed/YA2Lxfw4SSw?mute=1&loop=1&modestbranding=1&rel=0&enablejsapi=1&playlist=YA2Lxfw4SSw',
        isLoading: false,
        message: null,
        errors: [],
        ytData: null,
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
                
                if(error.response && error.response.status === 404) {
                    this.ytData = null;
                } else {
                    this.errors = error.response?.data || { message: "Failed to fetch url" };
                }
            } finally {
                this.isLoading = false;
            }
        },
        async updateURL(id, url) {
            try {
                this.isLoading = true;

                const videoID = this.extractVideoID(url);
                if (videoID) {
                    this.ytURL = this.constructEmbedURL(url, videoID)
                }

                let res;
                
                if (!this.ytData) {
                    try {
                        const checkRes = await api.get(`api/yt-urls/${id}`);

                        if (checkRes.data.yTPlayer) {
                            this.ytData = checkRes.data.yTPlayer;
                        }
                    } catch (error) {
                        if (error.response && error.response.status === 404) {
                            this.ytData = null;
                        }
                    }
                }

                if(!this.ytData) {
                    console.log(url)
                    res = await api.post('/api/yt-urls', {
                        yt_url: url
                    })
                    this.message = "URL Created successfully!";
                } else {
                    res = await api.put(`/api/yt-urls/${id}`, {
                         yt_url: url
                    });
                }
                    
                if (res.data.yt_url) {
                    const resVideoID = this.extractVideoID(res.data.yt_url);
                    this.ytURL = this.constructEmbedURL(res.data.yt_url, resVideoID)

                    this.ytData = res.data
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