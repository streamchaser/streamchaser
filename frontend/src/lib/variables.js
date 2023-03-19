export const PYTHON_API = import.meta.env.VITE_API_PATH

export const STATIC_FILES = `${PYTHON_API}/static`
export const IMG_W185 = "https://image.tmdb.org/t/p/w185/"
export const IMG_W342 = `${PYTHON_API}/image/?size=w342&path=`
export const IMG_W500 = "https://image.tmdb.org/t/p/w500/"
export const IMG_W1280 = "https://image.tmdb.org/t/p/w1280/"
export const IMG_ORIGINAL = `${PYTHON_API}/image/?size=original&path=`

export const THEMES = [
  { icon: "🌚", value: "dark" },
  { icon: "🧛", value: "dracula" },
  { icon: "💎", value: "luxury" },
  { icon: "⚫", value: "black" },
  { icon: "☕", value: "coffee" },
  { icon: "🌜", value: "night" },
  { icon: "👔", value: "business" },
]
