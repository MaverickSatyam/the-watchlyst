<template>
  <div class="loader-bar" v-if="loading"></div>
  <div class="hl" id="top">
    <h2 class="greet">Welcome, {{ userName.split(' ')[0] }}!</h2>
  </div>
  <div style="flex-grow: 1;">
    <!-- Search Section -->
    <transition name="fade">
      <section v-show="tabStore.currentTab === 'discover'" class="search-bar">
        <div class="messageBox">
          <input required="" v-model="uquery" placeholder="Search movies..." type="text" id="messageInput" />
          <!-- Clear Button: Display only if there's text in the input -->
          <button v-show="uquery" @click="clearSearch" id="sendButton"><img src="../assets/close.svg"></button>
          <!-- Search Button -->
          <button @click="searchMovies" id="sendButton"><img src="../assets/search.svg"></button>
        </div>
      </section>
    </transition>
    <!-- Trending Section -->
    <transition name="fade">
      <section v-show="tabStore.currentTab === 'discover' && results.length <= 0">
        <div class="stats-section">
          <div class="stats-container">
            <dl class="stats-grid">
              <div class="stat-item">
                <dt class="stat-label">Movies/series watched</dt>
                <dd class="stat-value">{{ watchedMovies.length | 0 }} movies</dd>
              </div>
              <div class="stat-item">
                <dt class="stat-label">Movies/series to watch</dt>
                <dd class="stat-value">{{ unwatchedMovies.length | 0 }} movies</dd>
              </div>
            </dl>
          </div>
        </div>
        <div class="hl">
          <h2 class="gradient_title">Trending Now</h2>
        </div>
        <div class="movie-row">
          <div v-for="movie in trending" :key="movie.id" class="movie-card">
            <div class="bookmark-icon" @click="addToWatchlist(movie)" :class="{ 'disabled': loading }"
              :disabled="loading">
              <img src="../assets/bookmark.svg" alt="bookmark" title="Add to watchlist">
            </div>
            <img :src="getPoster(movie.poster_path)" />
            <div>
              <h4>{{ movie.title }}</h4>
            </div>
          </div>
        </div>
      </section>
    </transition>


    <!-- Search Results -->
    <transition name="fade">
      <section v-show="tabStore.currentTab === 'discover' && results.length > 0">
        <div class="hl">
          <h2 class="gradient_title">Search Results</h2>
        </div>
        <div class="movie-row">
          <div v-for="movie in filteredResults" :key="movie.id" class="movie-card">
            <div class="bookmark-icon" @click="addToWatchlist(movie)">
              <img src="../assets/bookmark.svg" alt="bookmark" title="Add to watchlist">
            </div>
            <img :src="getPoster(movie.poster_path)" />
            <div>
              <h4>{{ movie.title || movie.name }}</h4>
            </div>
          </div>
        </div>
      </section>
    </transition>


    <!-- Watchlist Section -->
    <transition name="fade">
      <section v-show="tabStore.currentTab === 'watchlist'">
        <div class="hl">
          <h2 class="gradient_title">Your Watchlist</h2>
        </div>
        <div class="tab-container" v-if="watchlist.length > 0">
          <input type="radio" name="tab" id="tab1" class="tab tab--1" v-model="watchlistTab" value="to-watch" />
          <label class="tab_label" for="tab1">To Watch</label>

          <input type="radio" name="tab" id="tab2" class="tab tab--2" v-model="watchlistTab" value="watched" />
          <label class="tab_label" for="tab2">Watched</label>

          <div class="indicator"></div>
        </div>
        <LoadingSpinner v-if="loading && watchlist.length === 0" />

        <!-- Unwatched Container -->
        <div v-show="watchlistTab === 'to-watch'" class="movie-row" key="unwatched">
          <div v-if="watchlist.length > 0 && unwatchedMovies.length == 0" class="empty-watchlist" style="width: 100%;">
            <p>Your watchlist is empty. Start adding movies to your list!</p>
            <button @click="tabStore.setTab('discover')">Browse Movies</button>
          </div>
          <div v-for="item in paginatedMovies" :key="item.id" class="movie-card">
            <div class="bookmark-icon" @click="removeFromWatchlist(item)">
              <img src="../assets/bookmark_remove.svg" alt="bookmark" title="Remove">
            </div>
            <div class="bookmark-icon" @click="toggleWatched(item)">
              <img v-if="item.status == 'unwatched'" src="../assets/markWatched.svg" alt="bookmark"
                title="Mark as watched">
            </div>
            <img :src="getPoster(item.poster)" />
            <div>
              <h4>{{ item.title }}</h4>
              <small>
                <p style="color: darkgray;"><strong>Added on: </strong><cite> {{ formatDate(item.addedAt) }}</cite></p>
              </small>
            </div>
          </div>
          <ul v-if="paginatedMovies.length > 0" class="ant-pagination ant-pagination-simple">
            <!-- Previous Page -->
            <li title="Previous Page" tabindex="0" class="ant-pagination-prev" aria-disabled="false">
              <button class="ant-pagination-item-link" type="button" tabindex="-1"
                @click.prevent="changePage(currentPage - 1)" :class="{ disabled: currentPage === 1 }">
                <span role="img" aria-label="left" class="anticon anticon-left">
                  <!-- Left Arrow Icon (SVG) -->
                  <svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em"
                    fill="currentColor" aria-hidden="true">
                    <path
                      d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z">
                    </path>
                  </svg>
                </span>
              </button>
            </li>

            <!-- Current Page -->
            <li title="Current Page" class="ant-pagination-simple-pager">
              {{ currentPage }}<span class="ant-pagination-slash">/</span>{{ totalPages }}
            </li>

            <!-- Next Page -->
            <li title="Next Page" tabindex="0" class="ant-pagination-next" aria-disabled="false">
              <button class="ant-pagination-item-link" type="button" tabindex="-1"
                @click.prevent="changePage(currentPage + 1)" :class="{ disabled: currentPage === totalPages }">
                <span role="img" aria-label="right" class="anticon anticon-right">
                  <!-- Right Arrow Icon (SVG) -->
                  <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em"
                    fill="currentColor" aria-hidden="true">
                    <path
                      d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z">
                    </path>
                  </svg>
                </span>
              </button>
            </li>
          </ul>

        </div>
        <!-- Watched Container -->
        <div v-show="watchlistTab == 'watched'" class="movie-row" key="watched">
          <div v-if="watchlist.length > 0 && watchedMovies.length == 0" class="empty-watchlist" style="width: 100%;">
            <p>
              Nothing here just yet. Start watching movies from your <strong>To Watch</strong> list — they’ll show up
              here once you’re done!
            </p>
            <button @click="watchlistTab = 'to-watch'">
              View To Watch List
            </button>
          </div>

          <div v-for="item in paginatedWaMovies" :key="item.id" class="movie-card">
            <div class="bookmark-icon" @click="removeFromWatchlist(item)">
              <img src="../assets/bookmark_remove.svg" alt="bookmark" title="Remove">
            </div>
            <div class="bookmark-icon" @click="toggleWatched(item)">
              <img v-if="item.status == 'unwatched'" src="../assets/markWatched.svg" alt="bookmark"
                title="Mark as watched">
              <img v-if="item.status == 'watched'" src="../assets/label_off.svg" alt="bookmark"
                title="Mark as unwatched">
            </div>
            <img :src="getPoster(item.poster)" />
            <div>
              <h4>{{ item.title }}</h4>
              <small>
                <p style="color: darkgray;"><strong>Watched on: </strong><cite> {{ formatDate(item.addedAt) }}</cite>
                </p>
              </small> <!-- Date Watched -->
            </div>
          </div>
          <ul v-if="paginatedWaMovies.length > 0" class="ant-pagination">
            <!-- Previous Page -->
            <li title="Previous Page" tabindex="0" class="ant-pagination-prev" aria-disabled="false">
              <button class="ant-pagination-item-link" type="button" tabindex="-1"
                @click.prevent="changePageWa(currentPageWa - 1)" :class="{ disabled: currentPageWa === 1 }">
                <span role="img" aria-label="left" class="anticon anticon-left">
                  <!-- Left Arrow Icon (SVG) -->
                  <svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em"
                    fill="currentColor" aria-hidden="true">
                    <path
                      d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z">
                    </path>
                  </svg>
                </span>
              </button>
            </li>

            <!-- Current Page -->
            <li title="Current Page" class="ant-pagination-simple-pager">
              {{ currentPageWa }}<span class="ant-pagination-slash">/</span>{{ totalPagesWa }}
            </li>

            <!-- Next Page -->
            <li title="Next Page" tabindex="0" class="ant-pagination-next" aria-disabled="false">
              <button class="ant-pagination-item-link" type="button" tabindex="-1"
                @click.prevent="changePageWa(currentPageWa + 1)" :class="{ disabled: currentPageWa === totalPagesWa }">
                <span role="img" aria-label="right" class="anticon anticon-right">
                  <!-- Right Arrow Icon (SVG) -->
                  <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em"
                    fill="currentColor" aria-hidden="true">
                    <path
                      d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z">
                    </path>
                  </svg>
                </span>
              </button>
            </li>
          </ul>
        </div>
        <!-- Empty Watchlist State -->
        <div v-if="!loading && watchlist.length === 0" class="empty-watchlist">
          <p>Your watchlist is empty. Start adding movies to your list!</p>
          <button @click="tabStore.setTab('discover')">Browse Movies</button>
        </div>
      </section>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { auth, db } from '../firebase'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { useTabStore } from '../stores/tabStore.js'
import LoadingSpinner from './LoadingSpinner.vue'
import { toast } from 'vue3-toastify'
import { format } from 'date-fns'

const router = useRouter()
const userName = ref('Guest')
const uquery = ref('')
const results = ref([])
const trending = ref([])
const watchlist = ref([])
const tabStore = useTabStore()
const watchlistTab = ref('to-watch') // This controls the tab between 'To Watch' and 'Watched'

const { getUser } = useAuth()
const loading = ref(false)

const currentPage = ref(1)
const currentPageWa = ref(1)
const itemsPerPage = ref(20)

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const getPoster = (path) =>
  path
    ? `https://image.tmdb.org/t/p/w200${path}`
    : 'https://placehold.co/100x150?text=No+Image'

const fetchTrendingMovies = async () => {
  loading.value = true
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
    )
    const data = await res.json()
    trending.value = data.results
  } finally {
    loading.value = false
  }
}

const searchMovies = async () => {
  loading.value = true
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${uquery.value}`
    )
    const data = await res.json()
    if (data.results) {
      results.value = data.results
    }
    else {
      toast.info('No results found!', {
        theme: 'colored'
      })
    }
  } finally {
    loading.value = false
  }
}


// const addToWatchlist = async (movie) => {
//   // Check if the movie is already in the watchlist (compare by title or movie id)
//   const movieExists = watchlist.value.filter(item => item.movieId == movie.id);
//   if (movieExists.length > 0) {
//     // Movie already in watchlist
//     toast.info('This movie is already in your watchlist!', {
//       theme: 'colored'
//     });
//   } else {
//     // Add to watchlist
//     const user = await getUser()
//     await addDoc(collection(db, 'users', user.uid, 'watchlist'), {
//       title: movie.title || movie.name,
//       poster: movie.poster_path,
//       status: 'unwatched',
//       addedAt: new Date(),
//       movieId: movie.id,  // Store movie ID for future checks
//     });
//     toast.success('Added to watchlist!', {
//       theme: 'colored'
//     })
//     fetchWatchlist()
//   }
// }
let debounceTimer = null;

const addToWatchlist = async (movie) => {
  loading.value = true
  // Clear any existing debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set a new debounce timer for 500ms
  debounceTimer = setTimeout(async () => {
    // Check if the movie is already in the watchlist
    const movieExists = watchlist.value.filter(item => item.movieId == movie.id);

    if (movieExists.length > 0) {
      toast.info('This movie is already in your watchlist!', { theme: 'colored' });
    } else {
      // Add to watchlist
      const user = await getUser()
      await addDoc(collection(db, 'users', user.uid, 'watchlist'), {
        title: movie.title || movie.name,
        poster: movie.poster_path,
        status: 'unwatched',
        addedAt: new Date(),
        movieId: movie.id,  // Store movie ID for future checks
      });
      toast.success('Added to watchlist!', {
        theme: 'colored'
      })
    }
    loading.value = false
    fetchWatchlist();
  }, 1000); // 500ms debounce delay (can adjust based on UI preference)
}

const toggleWatched = async (item) => {
  const user = await getUser()
  const ref = doc(db, 'users', user.uid, 'watchlist', item.id)
  await updateDoc(ref, {
    status: item.status === 'watched' ? 'unwatched' : 'watched',
    addedAt: new Date()
  })
  fetchWatchlist()
  // Check if there are items left in the paginatedMovies list
  // If no items are left on the current page, change to the previous page
  if (paginatedWaMovies.value.length <= 1 && currentPageWa.value > 1) {
    changePageWa(currentPageWa.value - 1);
  }
}

const removeFromWatchlist = async (item) => {
  const user = await getUser()
  const ref = doc(db, 'users', user.uid, 'watchlist', item.id)
  await deleteDoc(ref)
  fetchWatchlist()
  // Check if there are items left in the paginatedMovies list
  // If no items are left on the current page, change to the previous page
  if (paginatedMovies.value.length <= 1 && currentPage.value > 1) {
    changePage(currentPage.value - 1);
  }
  if (paginatedWaMovies.value.length <= 1 && currentPageWa.value > 1) {
    changePageWa(currentPageWa.value - 1);
  }
}

const fetchWatchlist = async () => {
  loading.value = true
  try {
    const user = await getUser()
    const q = query(collection(db, 'users', user.uid, 'watchlist'))
    const snapshot = await getDocs(q)
    watchlist.value = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const user = await getUser()
  if (user) {
    userName.value = user.displayName || user.email || 'Guest'
    await fetchTrendingMovies()
    await fetchWatchlist()
  }
})

function clearSearch() {
  uquery.value = '';
  results.value = []
}

const filteredResults = computed(() => {
  return results.value.filter(item => item.media_type == 'movie' || item.media_type == 'tv')
})
// Computed property to filter unwatched movies
const unwatchedMovies = computed(() => {
  return watchlist.value.filter(item => item.status == 'unwatched')
})
// Computed property to filter watched movies
const watchedMovies = computed(() => {
  return watchlist.value.filter(item => item.status == 'watched')
})

const formatDate = (timestamp) => {
  const date = timestamp.toDate(); // Convert Timestamp to Date object
  return format(date, 'MMMM dd, yyyy'); // Format it to a readable format, e.g., "April 30, 2025"
};

const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return unwatchedMovies.value.slice(start, end);
})
const paginatedWaMovies = computed(() => {
  const start = (currentPageWa.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return watchedMovies.value.slice(start, end);
})
const totalPages = computed(() => {
  if (unwatchedMovies.value.length >= 1) {
    return Math.ceil(unwatchedMovies.value.length / itemsPerPage.value);
  }
})
const totalPagesWa = computed(() => {
  if (watchedMovies.value.length >= 1) {
    return Math.ceil(watchedMovies.value.length / itemsPerPage.value);
  }
})
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scrolls to top
  }
};
const changePageWa = (page) => {
  if (page >= 1 && page <= totalPagesWa.value) {
    currentPageWa.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // scrolls to top
  }
};

</script>

<style scoped>
.hl {
  display: flex;
  justify-content: flex-start;
  padding: 0 1rem;

}

.greet {
  color: transparent;
  background: linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%);
  background: radial-gradient(circle at 50% 50%, #e3ffe7 58.52%, #d9e7ff 88.07%);
  background-clip: text;
}

/* Gradient Effect for h3 - Aligned Left */


h2 {
  margin-bottom: 1rem;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem auto;
  max-width: 600px;
  padding: 0 1rem;
}

.movie-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.3rem;
  position: relative;
}

.movie-card {
  position: relative;
  width: 155px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.5rem;
  text-align: left;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
  background: rgb(40, 40, 55);
  background: linear-gradient(344deg, rgba(40, 40, 55, 1) 0%, rgba(16, 16, 18, 1) 50%);
  box-shadow: 4px 6px 14px #00000036;
  color: #F9F9F9;
}

.movie-card img {
  width: 100%;
  border-radius: 4px;
  object-fit: cover;
}

.movie-card h4,
.movie-card p {
  margin: 2px 2px;
}

.bookmark-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.bookmark-icon:hover {
  transform: scale(1.1);
  filter: brightness(1.5) hue-rotate(90deg);
}

.bookmark-icon+.bookmark-icon {
  top: 40px;
}

.empty-watchlist {
  text-align: center;
  padding: 3rem 1rem;
  margin-top: 2rem;
}

.empty-watchlist p {
  font-size: 1.2rem;
  color: #f4f4f4;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.empty-watchlist button {
  background-color: #6f42c1;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.empty-watchlist button:hover {
  background-color: #6b3ebe;
  /* Darker Red */
}

.tab-container {
  position: relative;

  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;

  padding: 3px;
  margin-bottom: 1.6rem;

  background-color: #dadadb;
  border-radius: 9px;
}

.indicator {
  content: "";
  width: 130px;
  height: 28px;
  background: #ffffff;
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 9;
  border: 0.5px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.12), 0px 3px 1px rgba(0, 0, 0, 0.04);
  border-radius: 7px;
  transition: all 0.2s ease-out;
}

.tab {
  width: 130px;
  height: 28px;
  position: absolute;
  z-index: 99;
  outline: none;
  opacity: 0;
}

.tab_label {
  width: 130px;
  height: 28px;
  color: #000;

  position: relative;
  z-index: 999;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;

  font-size: 0.75rem;
  opacity: 0.6;

  cursor: pointer;
}

.tab--1:checked~.indicator {
  left: 2px;
}

.tab--2:checked~.indicator {
  left: calc(130px + 2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.tooltip {
  position: absolute;
  top: -40px;
  display: none;
  opacity: 0;
  color: white;
  font-size: 10px;
  text-wrap: nowrap;
  background-color: #000;
  padding: 6px 10px;
  border: 1px solid #3c3c3c;
  border-radius: 5px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.596);
  transition: all 0.3s;
}

.messageBox {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Distribute items (input and buttons) along the horizontal axis */
  background-color: #111827;
  padding: 0 6px;
  border-radius: 10px;
  border: 1px solid rgb(63, 63, 63);
  width: 350px;
  /* Fixed width for the message box */
}

.messageBox:focus-within {
  border: 1px solid rgb(110, 110, 110);
}

#messageInput {
  width: 100%;
  height: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  padding-left: 10px;
  color: white;
  font-size: 1rem;
}

#messageInput:focus~#sendButton,
#messageInput:valid~#sendButton {
  fill: #3c3c3c;
  filter: brightness(3.5) hue-rotate(90deg);
}

#sendButton {
  width: 20px;
  /* Set fixed size for the buttons */
  height: 20px;
  background-color: transparent;
  outline: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

#sendButton:hover {
  fill: #3c3c3c;
  filter: brightness(3.5) hue-rotate(90deg);
}

@media (max-width: 768px) {
  .movie-row {
    place-content: left center;
    padding-left: 10px;
  }

  #top {
    margin-top: 65px;
  }

  .search-bar {
    margin: auto;
  }
}

.bookmark-icon.disabled {
  opacity: 0.5;
  /* Make the button semi-transparent when disabled */
  pointer-events: none;
  /* Disable click events */
}


/* Styling for Ant Design pagination */
.ant-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  list-style: none;
  font-family: Arial, sans-serif;
  font-size: 14px;
  position: static;
  /* Position it fixed at the bottom of the screen */
  width: 100%;
  padding-inline-end: 18px;
}

.ant-pagination li {
  margin: 0 4px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.ant-pagination-item-link {
  background: none;
  border: none;
  cursor: pointer;
  color: whitesmoke;
}

.ant-pagination-item-link.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.ant-pagination-simple-pager {
  display: flex;
  align-items: center;
}

.ant-pagination-slash {
  margin: 0 2px;
}

/* Base section styles */
.stats-section {
  padding-top: 6rem;
  padding-bottom: 6rem;
}

@media (min-width: 640px) {
  .stats-section {
    padding-top: 8rem;
    padding-bottom: 8rem;
  }
}

/* Dark mode support */
/* @media (prefers-color-scheme: dark) {
  .stats-section {
    background-color: #111827;
  }

  .stat-label {
    color: #9ca3af;
  }

  .stats-container, .stat-value {
    color: #ffffff;
  }
} */

/* Container */
.stats-container {
  max-width: 80rem;
  /* Tailwind's max-w-7xl */
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

@media (min-width: 1024px) {
  .stats-container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* Grid layout */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem 2rem;
  text-align: center;
}

@media (min-width: 375px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-section {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .stats-container {
    width: 82%;
    background-color: #111827;
    padding: 1rem;
    border-radius: 8px;
  }
}

/* Stat item */
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 20rem;
  gap: 1rem;
  margin: 0 auto;
}

/* Text styles */
.stat-label {
  font-size: 1rem;
  line-height: 1.75rem;
  color: #9ca3af;
  /* Tailwind's gray-600 */
}

.stat-value {
  order: -1;
  font-size: 1.875rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #F9F9F9;
}

@media (min-width: 640px) {
  .stat-value {
    font-size: 3rem;
  }
}

dd {
  margin-inline-start: 0;
}

.loader-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: 100%;
  background: linear-gradient(90deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
  background: linear-gradient(130deg, #DFF2E8, #DFF2F1, #A8C0FF, #DFE9F2, #F2DFE9, #F2E8DF);
  background-size: 200% 100%;
  animation: moveGradient 2s linear infinite;
  z-index: 9999;
}

@keyframes moveGradient {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: -100% 50%;
  }
}
</style>
