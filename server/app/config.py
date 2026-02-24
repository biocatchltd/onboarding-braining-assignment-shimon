from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"  # no-auth MongoDB from docker-compose
    mongo_db_name: str = "onboarding"

    model_config = {"env_prefix": ""}


settings = Settings()
