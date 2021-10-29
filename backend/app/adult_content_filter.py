from app.db import database
from app.db.crud import get_all_media


def brute_filter():
    db = database.SessionLocal()
    media_list = get_all_media(db)
    db.close()

    blacklisted_words = ("sex", "semen", "fucked", "fuck", "BDSM")
    suspect_genres = ("Animation", "Unknown")

    animation_or_unknown = (
        media
        for media in media_list
        if any(genre in media.genres for genre in suspect_genres)
    )

    suspect_media = (
        media
        for media in animation_or_unknown
        if any(word in media.overview for word in blacklisted_words)
    )

    print(
        [
            (media.title)
            for media in suspect_media
        ]
    )
    # return [media.title for media in suspect_media]
