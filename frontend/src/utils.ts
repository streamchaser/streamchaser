// Generic Javascript Functions

export const getKeyByValue = (object: {}, value: string): string => {
  return Object.keys(object).find(key => object[key] === value)
}

export const getFixedGenreValues = (genres: {}) => {
  return Object.keys(genres).map(function (key) {
    return genres[key]
  })
}

export const mediaIdToUrlConverter = (
  mediaId: number,
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

export const removeDuplicates = (arr: object[]) => {
  let unique_ids = []
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

// TODO: Replace any with Media type
export const sortListByPopularity = (list: object[]) => {
  list.sort((a, b) => b.popularity - a.popularity)
}

export const uniqueArray = (list: object[], filterBy: string) => {
  return [...new Map(list.map(item => [item[filterBy], item])).values()]
}

export const calculateAmountOfShownItems = (viewportWidth: number) => {
  if (viewportWidth < 640) {
    console.log("sm")
    return 12
  } else if (viewportWidth > 764 && viewportWidth < 768) {
    console.log("md")
    return 16
  } else if (viewportWidth > 1024 && viewportWidth < 1024) {
    console.log("lg")
    return 20
  } else if (viewportWidth > 1280 && viewportWidth < 1280) {
    console.log("xl")
    return 24
  } else if (viewportWidth > 1536) {
    console.log("2xl")
    return 24
  }
}
