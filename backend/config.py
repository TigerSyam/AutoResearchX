import os

APP_MODE = os.getenv("APP_MODE", "research")

IS_PRODUCTION = APP_MODE == "production"
IS_RESEARCH = APP_MODE == "research"
