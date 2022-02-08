from typing import Optional

from beanie import Document
from beanie import Indexed


class Provider(Document):
    country_code: Indexed(str)
    providers: list[str]


async def get_providers(country_code: str) -> Optional[Provider]:
    return await Provider.find_one({"country_code": country_code})


async def add_provider():
    await Provider.insert_one(Provider(country_code="DK", providers=["Netflix", "HBO"]))


#     chocolate = Category(name="Chocolate",
#     description="A preparation of roasted and ground cacao seeds.")
#     # Beanie documents work just like pydantic models
#     tonybar = Product(name="Tony's", price=5.95, category=chocolate)
#     # And can be inserted into the database
#     await tonybar.insert()
#
#     # You can find documents with pythonic syntax
#     product = await Product.find_one(Product.price < 10)
#
#     # And update them
#     await product.set({Product.name:"Gold bar"})
