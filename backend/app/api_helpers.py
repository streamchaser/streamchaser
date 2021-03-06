from app.config import get_settings


tmdb_key = get_settings().tmdb_key


def valid_title(media: dict) -> str:
    if media.get("media_type") == "movie":
        return media.get("title")

    return media.get("name")


def valid_original_title(media: dict) -> str:
    if media.get("id").startswith("m"):
        return media.get("original_title")

    return media.get("original_name")


def valid_release_date(media: dict) -> str:
    if media.get("media_type") == "movie":
        return str(media.get("release_date"))

    return str(media.get("first_air_date"))


def get_providers(
    provider_type: str, providers: dict, country_code: str = "all"
) -> list[dict]:
    """Gets list of provider data for a movie from a specified country code"""

    try:
        if country_code == "all":
            return [
                {country: provider}
                for country in providers.get("results")
                if providers.get("results").get(country).get(provider_type)
                for provider in providers.get("results").get(country).get(provider_type)
            ]

        return [
            provider
            for provider in providers.get("results")
            .get(country_code)
            .get(provider_type)
            if providers.get("results").get(country_code).get(provider_type)
        ]
    except (AttributeError, TypeError):
        # If no providers for given country code
        return []
