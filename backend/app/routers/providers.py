from fastapi import APIRouter


router = APIRouter(
    prefix="/providers",
    tags=["providers"],
    responses={404: {"description": "Provider(s) not found"}},
)


@router.get("/{country_code}")
async def read_all_providers(country_code):
    """Reads all the providers from providers.txt"""
    # TODO: Should live in a database instead of a .txt-file

    flatrate_provders = [
        line.rstrip()
        for line in open(f"providers_txt/flatrate/providers_{country_code.upper()}.txt")
    ]
    free_providers = [
        line.rstrip()
        for line in open(f"providers_txt/free/providers_{country_code.upper()}.txt")
    ]

    return [*flatrate_provders, *free_providers]
