<template>
    <nav class="login">
        <!-- Brand -->
        <h1 class="gradient_title" onclick="location.reload()">TheWATCHLYST</h1>

        <!-- Hamburger (Mobile) -->
        <button class="hamburger" @click="isMenuOpen = !isMenuOpen" :aria-expanded="isMenuOpen">
            <span :class="{ open: isMenuOpen }" class="bar"></span>
            <span :class="{ open: isMenuOpen }" class="bar"></span>
            <span :class="{ open: isMenuOpen }" class="bar"></span>
        </button>

        <!-- Overlay (optional, for polish) -->
        <div v-if="isMenuOpen" class="nav-overlay" @click="isMenuOpen = false"></div>

        <!-- Nav Links -->
        <div :class="['nav-tabs', { open: isMenuOpen }]">
            <button class="tab" :class="{ active: tabStore.currentTab === 'discover' }"
                @click="handleTab('discover')">Discover</button>
            <button class="tab" :class="{ active: tabStore.currentTab === 'watchlist' }"
                @click="handleWatchlistClick">Watchlist</button>
            <button v-if="!isLoggedIn" @click="signInWithGoogle" class="signin">Sign in with Google</button>
            <button v-if="isLoggedIn" @click="signout" class="signout">Logout</button>
        </div>
    </nav>
</template>



<script setup>
import { auth, provider } from '../firebase.js'
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useTabStore } from '../stores/tabStore.js'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const isLoggedIn = ref(false)
const tabStore = useTabStore()
const { getUser, logout } = useAuth()

function changeTab(tab) {
    tabStore.setTab(tab)
}

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        isLoggedIn.value = !!user
    })
})

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider)
        if (result.user) {
            isLoggedIn.value = true
            tabStore.login()
            isMenuOpen.value = false // Close menu after clicking a tab
            router.push('/home') // Redirect after successful login if needed

        }
    } catch (error) {
        console.error('Login failed:', error)
    }
}

const signout = async () => {
    await logout()
    tabStore.currentTab = 'discover'
    isMenuOpen.value = false // Close menu after clicking a tab
    router.push('/') // Redirect after logout

}

const handleWatchlistClick = () => {
    if (!isLoggedIn.value) {
        toast.info('Login required!', {
            theme: 'colored'
        })
    } else {
        changeTab('watchlist')
        handleTab('watchlist')
    }
}



const isMenuOpen = ref(false)

const handleTab = (tab) => {
    changeTab(tab)
    isMenuOpen.value = false // Close menu after clicking a tab
}

</script>

<style scoped>
.login {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border-bottom: 1px solid #ddd;
    position: relative;
    z-index: 1000;
}

/* Gradient Title */
.gradient_title {
    font-size: 1.6rem;
    font-weight: bold;
    background: radial-gradient(circle at 50% 50%, #fff 58.52%, hsla(0, 0%, 100%, 0.5) 88.07%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    letter-spacing: -0.64px;
    margin: 0;
    transition: none;
    user-select: none;
    /* Prevent text selection */
    cursor: pointer;
    /* Optional: changes the cursor to indicate it's clickable */
    -webkit-tap-highlight-color: transparent;
}

.gradient_title:focus,
.gradient_title:active {
    background-color: transparent !important;
    outline: none;
}

/* Hamburger Styling */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 24px;
    height: 18px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-right: 2.6rem;
    z-index: 1100;
}


.bar {
    height: 3px;
    width: 24px;
    background-color: white;
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform-origin: center;
    display: block;
}


.bar.open:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.bar.open:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
}

.bar.open:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
}

/* Navigation Container */
.nav-tabs {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

/* Nav Buttons */
.tab,
.signin,
.signout {
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: color 0.3s ease;
}

.tab:hover,
.signin:hover,
.signout:hover {
    color: #4285F4;
}

/* Active Tab Indicator */
.tab.active {
    font-weight: bold;
    color: #4285F4;
    position: relative;
}

.tab.active::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    height: 2px;
    width: 100%;
    background-color: #4285F4;
}

/* Sign-in and Sign-out Buttons */
.signin {
    background-color: #4285F4;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

.signout {
    background-color: crimson;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

.signin:hover {
    background-color: #357ae8;
}

.signout:hover {
    background-color: #d9534f;
}

/* Overlay (optional) */
.nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
}

/* Responsive Mobile Styles */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }

    .login {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: rgba(18, 18, 18, 0.1);
        backdrop-filter: blur(10px);
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        /* z-index: 100; */
    }

    .nav-tabs {
        flex-direction: column;
        position: absolute;
        top: 100%;
        right: 11%;
        /* width: 60%; */
        background-color: #1e1e1e;
        padding: 1rem;
        gap: 1rem;
        display: none;
        border-top: 1px solid #333;
        z-index: 1050;
        transition: all 0.3s ease;
    }

    .nav-tabs.open {
        display: flex;
    }

    .tab,
    .signin,
    .signout {
        width: 100%;
        text-align: left;
    }
}
</style>