import httpx
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from starlette_context import context

from app.config import Environment, get_settings
from app.util import log

router = APIRouter(
    prefix="/country",
    tags=["country"],
    responses={404: {"description": "Country not found"}},
)


@router.get("")
async def lookup_country():
    """Uses the client's ip-address to return their country code"""
    key = get_settings().ipregistry_key
    ip = context.data["X-Forwarded-For"]

    async with httpx.AsyncClient(http2=True, timeout=10) as client:
        match get_settings().app_environment:
            case Environment.DEVELOPMENT:
                res = await client.get(f"https://api.ipregistry.co/?key={key}")
            case Environment.PRODUCTION:
                res = await client.get(f"https://api.ipregistry.co/{ip}?key={key}")
            case Environment.TESTING:
                raise NotImplementedError(
                    "Testing environment havn't been implemented."
                )
            case _:
                raise Exception("app_environment is misconfigured.")

    payload = res.json()
    if payload.get("code") == "RESERVED_IP_ADDRESS":
        log.info("Reserved(probably a local address):", ip)
        return JSONResponse(status_code=400, content={"message": "Reserved address."})

    if payload.get("location"):
        country_code = payload["location"]["country"]["code"]
        # TODO: Needs to be updated. Should use the dynamic countries
        if country_code in get_settings().supported_country_codes:
            return country_code

        log.info("Unsupported:", country_code)
        return JSONResponse(
            status_code=400,
            content={
                "message": f"Results for {country_code} is currently not supported. "
                "Contact us on GitHub if you wish for us "
                "to add it to our list of countries."
            },
        )

    if message := payload.get("message"):
        return JSONResponse(
            status_code=400,
            content={"message": message},
        )

    return JSONResponse(
        status_code=400,
        content={"message": "Unknown error"},
    )
