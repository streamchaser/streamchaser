from app.config import get_settings

tmdb_key = get_settings().tmdb_key


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
