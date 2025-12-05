import { defineStore } from 'pinia'

export const useTabStore = defineStore('tab', {
    state: () => ({
        currentTab: 'discover',
        isAuth: false
    }),
    actions: {
        setTab(tab) {
            this.currentTab = tab;
        },
        login() {
            this.isAuth = true;
        },
        logout() {
            this.isAuth = false;
        }
    }
});