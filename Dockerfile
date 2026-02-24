FROM python:3.12-slim

WORKDIR /app

# Install Poetry
RUN pip install poetry
ENV POETRY_VIRTUALENVS_CREATE=false
COPY pyproject.toml README.md ./
COPY server ./server
RUN poetry install --no-interaction --no-root

ENV MONGO_URI=mongodb://mongodb:27017

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
