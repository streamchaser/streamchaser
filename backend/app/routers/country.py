import httpx
from app.config import Environment
from app.config import get_settings
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import JSONResponse


router = APIRouter(
    prefix="/country",
    tags=["country"],
    responses={404: {"description": "Country not found"}},
)


@router.get("/")
async def lookup_country(request: Request):
    """Uses the client's ip-address to return their country code"""
    ip = request.client.host
    key = get_settings().ipregistry_key

    async with httpx.AsyncClient(timeout=10) as client:
        match get_settings().app_environment:
            case Environment.DEVELOPMENT:
                print("dev")  # TODO: Remove
                res = await client.get(f"https://api.ipregistry.co/?key={key}")
            case Environment.PRODUCTION:
                print("prod")  # TODO: Remove
                res = await client.get(f"https://api.ipregistry.co/{ip}?key={key}")
            case Environment.TESTING:
                raise NotImplementedError("Testing environment havn't been implemented")
            case _:
                raise Exception("app_environment is misconfigured")

    payload = res.json()
    if payload.get("code") == "RESERVED_IP_ADDRESS":
        print("Reserved(probably a local address):", ip)
        return JSONResponse(status_code=400, content={"message": "Reserved address"})

    country_code = payload["location"]["country"]["code"]
    if country_code in get_settings().supported_country_codes:
        return country_code

    print("Unsupported:", country_code)
    return JSONResponse(
        status_code=400,
        content={
            "message": "Unsupported country, please contact us on "
            "GitHub to get your country added"
        },
    )
