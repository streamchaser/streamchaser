def valid_title(movie: dict) -> str:
    if movie.get('media_type') == 'movie':
        return movie.get('title')

    return movie.get('name')

def valid_release_date(movie: dict) -> str:
    if movie.get('media_type') == 'movie':
        return movie.get('release_date')

    return movie.get('first_air_date')