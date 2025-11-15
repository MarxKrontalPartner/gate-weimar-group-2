# Local Development Environment Setup

This guide explains how to set up the local environment for grafana.

## Prerequisites

- Docker and Docker Compose
- WSL2 (for Windows users)

## Docker Compose

The easiest way to get started is using the given Docker Compose file:

```bash
sudo docker compose up -d
```

This will start:

- Grafana server

The application will be available at `http://localhost:3000`

Login with default credentials:
Write Access:

- Username: `admin`
- Password: `admin`

## Import Example Dashboard
1. Open Grafana in your web browser: `http://localhost:3000`
2. Log in with your credentials (default: admin/admin).
3. Click on the "+" icon on the left sidebar and select "Dashboard".
4. Click on "Import dashboard" to import the dashboard of this project.
5. Upload the JSON file located in the `dashboards` folder of this project.

### Important URLs

- **Grafana**: `http://localhost:3000`

### Stopping Services

```bash
# Stop all services
sudo docker compose down
```

# Backend for test data

Checkout the OpenAPI Swagger UI: https://pegel-online.api.bund.dev/

Example request url to find closest Pegel to Weimar:

```
https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json?includeTimeseries=false&includeCurrentMeasurement=false&includeCharacteristicValues=false&latitude=50.98314563623132&longitude=11.322992457260446&radius=100
```

Closest Pegel to Weimar is:

```json
{
  "uuid": "003200ab-d138-49d9-aa52-217817941f85",
  "number": "166640",
  "shortname": "ILMENAU",
  "longname": "ILMENAU",
  "km": 12,
  "agency": "REGIONALSTELLE SUHL",
  "longitude": 10.928842587394035,
  "latitude": 50.680942368697885,
  "water": {
    "shortname": "ILM",
    "longname": "ILM"
  }
}
```

## How to get test data from ILMENAU Pegel
Example request url to get water level data for ILMENAU Pegel:

```
https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/003200ab-d138-49d9-aa52-217817941f85/W/measurements.json?start=2022-02-06T09%3A00%3A00%2B01%3A00
```

Data will be returned in json format.
```json
[
  {
    "timestamp": "2025-09-27T01:15:00+02:00",
    "value": 15
  },
  ...,
  {
    "timestamp": "2025-10-28T01:30:00+02:00",
    "value": 15
  },
]
```

## Update - Pradhyumnaa

Docker and Nginx Configured (I think?). Login, Sign Up Page and Dashboard Created.

```bash
cd gate2
sudo docker compose up --build
```

then

go to http://localhost/.