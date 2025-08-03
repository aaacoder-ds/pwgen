FROM python:3.12.3-alpine3.20

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001 -G appuser

WORKDIR /app

# Install dependencies
COPY requirements.txt requirements.txt
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache gcc musl-dev libffi-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    apk del gcc musl-dev libffi-dev && \
    rm -rf /var/cache/apk/*

# Copy application code
COPY . .

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5069/')" || exit 1

EXPOSE 5069

CMD ["gunicorn", "-w", "2", "-t", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:5069", "--access-logfile", "-", "--error-logfile", "-", "app:app_asgi"]