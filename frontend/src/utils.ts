import {goto} from '$app/navigation';

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

export const routeToPage = (mediaId: string, mediaType: string = undefined) => {
    switch (mediaType) {
        case "tv":
            window.location.href = `/tv/${mediaId}`;
            break;
        case "movie":
            window.location.href = `/movie/${mediaId}`;
            break;
        case "person":
            window.location.href = `/person/${mediaId}`;
            break;
        default:
            // This is what happens on the index page
            const startingChar = mediaId[0]
            const slicedId = mediaId.slice(1)

            switch (startingChar) {
                case "t":
                    window.location.href = `/tv/${slicedId}`;
                    break;
                case "m":
                    window.location.href = `/movie/${slicedId}`;
                    break;
                case "p":
                    window.location.href = `/person/${slicedId}`;
                    break;
                default:
                    window.location.href = "/";
            }
    }
}

// Sorting of shown content and handling of missing content -->

export const removeContentWithMissingImagePath = (list: [], pathName: string): [] => {
    for (let i = 0; i < list.length; i++) {
        if (!list[i][pathName]) {
            list.splice(i, 1);
            i--;
        }
    }
    return list
}

// TODO: Replace any with Media type
export const sortListByPopularity = (list: [any]): [any] => {
    return list.sort((a, b) =>
        b.popularity - a.popularity
    );
}
