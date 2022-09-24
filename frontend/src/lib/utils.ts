import type { ViewPort, Media, FilmOrSeries } from "./types"

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
export const mediaIdToUrlConverter = (
  mediaId: string | number,
  mediaType: string = undefined
) => {
  if (["movie", "tv", "person"].indexOf(mediaType) !== -1) {
    return `/${mediaType}/${mediaId}`
  } else {
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

export const uniqueArray = (list: object[], filterBy: string) => {
  return [...new Map(list.map(item => [item[filterBy], item])).values()]
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
