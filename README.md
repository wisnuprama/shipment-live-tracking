# Shipment Live Tracking

A real-time shipment tracking system that lets you create shipments, define checkpoints, and stream live GPS coordinates to a map — all backed by a Cassandra cluster.

## Architecture

```
┌─────────────┐        REST / WebSocket        ┌──────────────────┐
│  React SPA  │  ──────────────────────────>  │  Flask + SocketIO │
│  (port 3000)│  <──────────────────────────  │  (port 5000)      │
└─────────────┘                                └────────┬─────────┘
                                                        │ CQL
                                               ┌────────▼─────────┐
                                               │  Cassandra 3.11  │
                                               │  (port 9042)     │
                                               └──────────────────┘
```

## Tech Stack

**Backend**
- Python / Flask 1.1
- Flask-SocketIO 4 + eventlet (real-time coordinate streaming)
- Flask-RESTful (REST API)
- cassandra-driver (CQLEngine ORM)
- Gunicorn (production WSGI)

**Frontend**
- React 16 (Create React App)
- socket.io-client 2
- google-map-react (live map rendering)
- qrcode.react / react-qr-scanner (QR shipment lookup)
- axios (REST calls)
- styled-components + Bootstrap

**Infrastructure**
- Docker Compose (dev: 1 Cassandra node; prod: 2-node cluster + Nginx + Certbot)

## Features

- **Start a shipment** — create a shipment record with origin, destination, and inventory code
- **Checkpoints** — add named waypoints (lat/lng) to a shipment
- **Live tracking** — driver sends GPS coordinates via WebSocket; all connected clients on that shipment room receive updates in real time on a Google Map
- **Shipment list** — browse all shipments with current status (`created` → `on the way` → `finished`)
- **Goods receipt** — scan a QR code to look up and confirm receipt of a shipment

## Data Models

| Model | Key Fields |
|---|---|
| `Shipment` | `shipping_code` (UUID PK), `inventory_code`, `status`, start/destination name + lat/lng |
| `Checkpoint` | `shipping_code` (FK), `location_name`, lat/lng |
| `LocationLog` | `shipping_code` (FK), `lat`, `lng`, `created_at` |

## REST API

Base path: `/api`

| Method | Endpoint | Description |
|---|---|---|
| GET / POST | `/shipments` | List all shipments / create a shipment |
| GET | `/shipments/<shipping_code>` | Shipment detail with checkpoints |
| GET / POST | `/shipments/<shipping_code>/checkpoints` | List / add checkpoints |
| GET / POST | `/shipments/<shipping_code>/locations` | List / append location logs |

## WebSocket Events

Namespace: `/` (default)

| Event (client → server) | Payload | Description |
|---|---|---|
| `join` | `{ shipping_code }` | Join the shipment tracking room; receives latest location immediately |
| `send coordinate` | `{ shipping_code, lat, lng }` | Driver pushes a new GPS coordinate |

| Event (server → client) | Payload | Description |
|---|---|---|
| `live tracking` | `{ shipping_code, lat, lng, created_at }` | Broadcast to all clients in the shipment room |

## Frontend Routes

| Path | Page |
|---|---|
| `/` | Home (link list) |
| `/start-shipment` | Create a new shipment |
| `/shipments` | Shipment list |
| `/shipments/:shippingCode` | Checkpoint list for a shipment |
| `/shipments/:shippingCode/current-location` | Live tracking map |
| `/goods-receipt` | QR scanner for goods receipt |

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Development

```bash
# Start all services (Cassandra, backend, frontend)
./scripts/up.sh
# or
docker-compose up -d --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Cassandra | localhost:9042 |

### Production

The production stack adds a second Cassandra node, Nginx with SSL termination, and Certbot for automatic certificate renewal.

```bash
# First-time SSL setup
./scripts/init-letsencrypt.sh

# Start production stack
./scripts/up.prod.sh
# or
docker-compose -f docker-compose.prod.yml up -d --build
```

Production also exposes Portainer at port `9000` for container management.

### Stopping Services

```bash
./scripts/stop.sh
```

## Project Structure

```
.
├── backend/
│   ├── livetracking/
│   │   ├── api/          # Flask-RESTful resources & parsers
│   │   ├── datasource/   # Cassandra models & DB connection
│   │   ├── socket/       # SocketIO namespaces & event handlers
│   │   ├── util/         # Error helpers, map utilities
│   │   └── web/          # Web (non-API) views
│   ├── requirements.txt
│   └── Dockerfile / Dockerfile.prod
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, Card, Steps, SelectPlace
│   │   ├── pages/        # One directory per route
│   │   ├── modules/      # REST, socket, maps, utils
│   │   └── contexts/     # React context
│   └── Dockerfile / Dockerfile.prod
├── demo/                 # Sample CQL scripts
├── docker-compose.yml       # Development
└── docker-compose.prod.yml  # Production
```

## License

See [LICENSE](LICENSE).
