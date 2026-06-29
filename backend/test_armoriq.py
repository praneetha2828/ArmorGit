import os
from dotenv import load_dotenv
from armoriq_sdk import ArmorIQClient

load_dotenv()

client = ArmorIQClient(
    api_key=os.getenv("ARMORIQ_API_KEY")
)

print("✅ ArmorIQ Client Initialized Successfully!")