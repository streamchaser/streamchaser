// Generic Javascript Functions

export const getKeyByValue = (object: {}, value: string): string => {
    return Object.keys(object).find(key => object[key] === value);
}

export const getFixedGenreValues = (genres: {}) => {
    return Object.keys(genres).map(function (key) {
        return genres[key];
    });
}

// Routing

export const routeToPage = (mediaId: string, mediaType: string = undefined, ctrlDown: boolean = false) => {
    let url;
    switch (mediaType) {
        case "tv":
            url = `/tv/${mediaId}`;
            break;
        case "movie":
            url = `/movie/${mediaId}`;
            break;
        case "person":
            url = `/person/${mediaId}`;
            break;
        default:
            // This is what happens on the index page
            const startingChar = mediaId[0]
            const slicedId = mediaId.slice(1)

            switch (startingChar) {
                case "t":
                    url = `/tv/${slicedId}`;
                    break;
                case "m":
                    url = `/movie/${slicedId}`;
                    break;
                case "p":
                    url = `/person/${slicedId}`;
                    break;
                default:
                    url = "/";
            }
    }

    if (ctrlDown) {
        window.open(url);
    } else {
        window.location.href = url;
    }
}

export const removeDuplicates = (arr: any[]) => {
    let unique_ids = []
    for (let i = 0; i < arr.length; i++) {
        if (unique_ids.includes(arr[i].id)) {
            arr.splice(i, 1)
            i--
        }
        unique_ids.push(arr[i].id);
    }
}

// Sorting of shown content and handling of missing content -->

export const removeContentWithMissingImagePath = (list: [], pathName: string) => {
    for (let i = 0; i < list.length; i++) {
        if (!list[i][pathName]) {
            list.splice(i, 1);
            i--;
        }
    }
}

// TODO: Replace any with Media type
export const sortListByPopularity = (list: [any]) => {
    list.sort((a, b) =>
        b.popularity - a.popularity
    );
}
