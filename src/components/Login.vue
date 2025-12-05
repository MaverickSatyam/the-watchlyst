<template>
  <div class="content" style="background-color: aliceblue; color: #000;">
    Sign-in to access all the features.
  </div>
  <!-- Trending Section -->
  <section>
    <!-- index.html -->
    <div class="hl">
      <h2 class="gradient_title">Trending Now</h2>
    </div>
    <!-- <LoadingSpinner v-if="loading" /> -->
    <div class="movie-row">
      <div v-for="movie in trending" :key="movie.id" class="movie-card">
        <div class="bookmark-icon" @click="addToWatchlist">
          <img src="../assets/bookmark.svg" alt="bookmark" title="Add to watchlist" width="24" height="24">
        </div>
        <img :src="loaded[movie.id] ? getPoster(movie.poster_path) : placeholder" @load="onLoad(movie.id)"
          loading="lazy" width="155" height="232.5" alt="Movie Poster" />
        <div>
          <h4>{{ movie.title }}</h4>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'

// Reactive state
const trending = ref([])
const loaded = ref({}) // Tracks loaded images
const placeholder = new URL('../assets/placeholder.png', import.meta.url).href

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// Get full poster URL or fallback image
const getPoster = (path) =>
  path ? `https://image.tmdb.org/t/p/w200${path}` : 'https://placehold.co/100x150?text=No+Image'

// Called when image finishes loading
const onLoad = (id) => {
  loaded.value[id] = true
}

const fetchTrendingMovies = async () => {
  // loading.value = true
  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
    const data = await res.json()
    trending.value = data.results
  } catch (err) {
    toast.error('Failed to fetch trending movies')
    console.error(err)
  }
}

const addToWatchlist = () => {
  toast.info('Login required!', {
    theme: 'colored'
  })
}

onMounted(() => {
  fetchTrendingMovies()
})
</script>

<style scoped>
.movie-row {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  gap: 1rem;
  padding: 0 1rem;
}

.movie-card {
  position: relative;
  width: 155px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.5rem;
  text-align: left;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  overflow: hidden;
  transition: transform 0.3s ease;
  background: rgb(40, 40, 55);
  background: linear-gradient(344deg, rgba(40, 40, 55, 1) 0%, rgba(16, 16, 18, 1) 50%);
  box-shadow: 4px 6px 14px #00000036;
  color: #F9F9F9;
}

.movie-card:hover {
  transform: scale(1.03);
}

.movie-card img {
  width: 100%;
  border-radius: 4px;
  object-fit: cover;
}

.movie-card h4 {
  margin: 6px 0 0 0;
  font-size: 0.95rem;
  color: #fff;
}

/* Bookmark icon */
.bookmark-icon {
  position: absolute;
  top: 10px;
  right: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, filter 0.3s ease;
}

/* .bookmark-icon img {
  width: 100%;
  height: 100%;
} */

.bookmark-icon:hover {
  transform: scale(1.2);
  filter: brightness(1.5) hue-rotate(90deg);
}

.hl {
  display: flex;
  justify-content: flex-start;
  padding: 0 1rem;
}

/* Gradient Title */
.gradient_title {
  font-size: 1.25rem;
  font-weight: 700;
  color: transparent;
  background: radial-gradient(circle at 50% 50%, #fff 58.52%, hsla(0, 0%, 100%, 0.5) 88.07%);
  background-clip: text;
  -webkit-background-clip: text;
  padding-bottom: 4px;
  letter-spacing: -0.5px;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

h2 {
  margin-bottom: 1rem;
}

/* ✅ Responsive Styles */
@media (max-width: 768px) {
  .movie-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0.3rem
  }

  .movie-card h4 {
    font-size: 0.85rem;
  }

  /* .bookmark-icon {
    width: 28px;
    height: 28px;
  } */

  .gradient_title {
    font-size: 1.1rem;
  }

  h2 {
    margin-bottom: 0.75rem;
  }

  .content {
    margin-top: 65px;
    padding: 5px;
    background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
  }
}
</style>
