"""Test main application endpoints."""
import pytest
from fastapi.testclient import TestClient


def test_health_check(client: TestClient):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_read_main(client: TestClient):
    """Test main endpoint."""
    response = client.get("/")
    assert response.status_code == 200