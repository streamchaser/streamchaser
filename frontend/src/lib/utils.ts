import type { Hit, Meilisearch, Provider } from "$lib/generated"
import type { FilmOrSeries, Media, Recommendation, ViewPort } from "$lib/types"
import { PYTHON_API } from "$lib/variables"

// Generic Javascript Functions
export const getKeyByValue = (object: {}, value: string): string => {
  return Object.keys(object).find(key => object[key] === value)
}

export const getFixedGenreValues = (genres: {}) => {
  return Object.keys(genres).map(function (key) {
    return genres[key]
  })
}

// TODO: This should be 2 functions to type correctly
export const mediaIdToUrlConverter = (mediaId: string) => {
  const startingChar = mediaId[0]
  const slicedId = mediaId.slice(1)

  switch (startingChar) {
    case "t":
      return `/tv/${slicedId}`
    case "m":
      return `/movie/${slicedId}`
    case "p":
      return `/person/${slicedId}`
    default:
      return "/"
  }
}

export const removeDuplicates = (arr: Media[]) => {
  const unique_ids = []
  for (let i = 0; i < arr.length; i++) {
    if (unique_ids.includes(arr[i].id)) {
      arr.splice(i, 1)
      i--
    }
    unique_ids.push(arr[i].id)
  }
}

// Sorting of shown content and handling of missing content -->

export const removeContentWithMissingImagePath = (list: object[], pathName: string) => {
  for (let i = 0; i < list.length; i++) {
    if (!list[i][pathName]) {
      list.splice(i, 1)
      i--
    }
  }
}

export const sortListByPopularity = (list: Media[]) => {
  list.sort((a, b) => b.popularity - a.popularity)
}

export const uniqueProviders = (list: Provider[]): Provider[] => {
  return [...new Map(list.map(item => [item["provider_id"], item])).values()]
}

export const calculateAmountOfShownItems = (viewPort: ViewPort) => {
  if (viewPort.width >= 1536) {
    return viewPort.xxl
  } else if (viewPort.width >= 1280) {
    return viewPort.xl
  } else if (viewPort.width >= 1024) {
    return viewPort.lg
  } else if (viewPort.width >= 764) {
    return viewPort.md
  } else if (viewPort.width >= 640) {
    return viewPort.sm
  } else {
    // Less than sm
    return viewPort.mobile
  }
}

export const addMediaToID = (mediaArray: Media[], mediaType: string) => {
  for (let i = 0; i < mediaArray.length; i++) {
    mediaArray[i].id = mediaType.charAt(0) + mediaArray[i].id
  }
}

export const getMostPopularBackdropPath = (mediaList: Media[]) => {
  sortListByPopularity(mediaList)
  return mediaList[0].backdrop_path
}

export const getMediaTitle = (media: FilmOrSeries) => {
  if (media.id.charAt(0) == "m") {
    return media.title
  } else {
    return media.name
  }
}

export const hitProviderAmounts = (searchHits: Hit[], country: string) => {
  const providerAmounts = []
  searchHits.forEach(hit => {
    let combinedAmount = 0
    if (hit.providers) {
      if ("flatrate" in hit.providers.results[country]) {
        combinedAmount += hit.providers.results[country]["flatrate"].length
      }
      if ("free" in hit.providers.results[country]) {
        combinedAmount += hit.providers.results[country]["free"].length
      }
    }
    providerAmounts.push(combinedAmount)
  })
  return providerAmounts
}

export const lookupSingleMedia = async (
  mediaId: string,
  country: string
): Promise<{ meilisearch: Meilisearch; providerAmounts: number[] }> => {
  const res = await fetch(`${PYTHON_API}/media?c=${country}&limit=1&ids=${mediaId}`)
  const json: Meilisearch = await res.json()

  const providerAmounts = hitProviderAmounts(json.hits, country)

  return { meilisearch: json, providerAmounts: providerAmounts }
}

export const lookupMedia = async (
  media: Media[] | Recommendation[],
  country: string
): Promise<{ meilisearch: Meilisearch; providerAmounts: number[] }> => {
  const ids = media.map((v: Media | Recommendation) => v.id)
  const res = await fetch(
    `${PYTHON_API}/media?c=${country}&limit=${ids.length}&ids=${ids.join("&ids=")}`
  )
  const json: Meilisearch = await res.json()

  const providerAmounts = hitProviderAmounts(json.hits, country)

  return { meilisearch: json, providerAmounts: providerAmounts }
}

export const parseJwt = (token: string) => {
  const base64Url = token.split(".")[1]
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join("")
  )
  return JSON.parse(jsonPayload)
}
