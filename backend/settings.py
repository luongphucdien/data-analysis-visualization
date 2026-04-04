from os import environ

class Config:
    PRODUCTION = environ.get("PRODUCTION", "False") == "True"

    DEBUG = not PRODUCTION
    CACHE_TYPE = "SimpleCache"
    CACHE_DEFAULT_TIMEOUT = int(environ.get("CACHE_TIMEOUT", 3600))

    _base_origins = [environ.get("FRONTEND_URL")]

    if not PRODUCTION:
        _base_origins.extend([
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ])

    ALLOWED_ORIGINS = [o for o in _base_origins if o]