import {goto} from '$app/navigation';

// Generic Javascript Functions

export const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

export const getDictValues = (dict) => {
    return Object.keys(dict).map(function (key) {
        return dict[key];
    });
}

// Routing

export const routeToPage = (mediaId, mediaType = undefined) => {
    // If no mediatype is given we're on index page. Check if media is tv or movie
    // by checking if mediaid starts with m or t, and route to details page
    if (!mediaType) {
        let goToUrl = mediaId.startsWith('m') ?
            `/movie/${mediaId.slice(1)}` : `/tv/${mediaId.slice(1)}`;
        goto(goToUrl);
    // On details page prefix t or m is already removed from mediaid, so we check for
    // extra input parameter to see which media to route to
    } else if (mediaType === "tv" || mediaType === "movie") {
        let goToUrl = mediaType === "movie" ? `/movie/${mediaId}` : `/tv/${mediaId}`;
        goto(goToUrl);
        location.reload();
    } else if (mediaType === "person") {
        goto(`/person/${mediaId}`);
        location.reload();
    }
}

// Sorting of shown content and handling of missing content -->

export const removeContentWithMissingImagePath = (list, pathName) => {
    for (let i = 0; i < list.length; i++) {
        if (!list[i][pathName]) {
            list.splice(i, 1);
            i--;
        }
    }
    return list
}

export const sortListByPopularity = (list) => {
    return list.sort((a, b) =>
        b.popularity - a.popularity
    );
}