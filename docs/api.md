# API Documentation - NeoCDT

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "username": "string",
  "email": "user@example.com",
  "full_name": "string",
  "password": "string"
}
```

Response:
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "full_name": "string",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00"
}
```

### Login
**POST** `/auth/login`

Request body (form-data):
```
username: string
password: string
```

Response:
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

## Users

### Get Current User
**GET** `/users/me`

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "full_name": "string",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00"
}
```

## CDT Applications

### Create CDT Application
**POST** `/cdt/`

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "amount": 1000000,
  "term_days": 360,
  "interest_rate": 8.5,
  "notes": "Optional notes"
}
```

Response:
```json
{
  "id": 1,
  "owner_id": 1,
  "amount": 1000000,
  "term_days": 360,
  "interest_rate": 8.5,
  "status": "pending",
  "application_date": "2024-01-01T00:00:00",
  "notes": "Optional notes",
  "created_at": "2024-01-01T00:00:00"
}
```

### Get CDT Applications
**GET** `/cdt/`

Headers:
```
Authorization: Bearer <token>
```

Query parameters:
- `skip`: int (default: 0) - Pagination offset
- `limit`: int (default: 100) - Number of items to return
- `status`: string (optional) - Filter by status

Response:
```json
[
  {
    "id": 1,
    "owner_id": 1,
    "amount": 1000000,
    "term_days": 360,
    "interest_rate": 8.5,
    "status": "pending",
    "application_date": "2024-01-01T00:00:00",
    "approval_date": null,
    "maturity_date": null,
    "notes": "Optional notes",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": null
  }
]
```

### Get CDT Application by ID
**GET** `/cdt/{cdt_id}`

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "id": 1,
  "owner_id": 1,
  "amount": 1000000,
  "term_days": 360,
  "interest_rate": 8.5,
  "status": "pending",
  "application_date": "2024-01-01T00:00:00",
  "approval_date": null,
  "maturity_date": null,
  "notes": "Optional notes",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": null
}
```

### Update CDT Application
**PUT** `/cdt/{cdt_id}`

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "amount": 1500000,
  "term_days": 180,
  "interest_rate": 9.0,
  "status": "approved",
  "notes": "Updated notes"
}
```

Response: Same as create response with updated values.

### Delete CDT Application
**DELETE** `/cdt/{cdt_id}`

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "msg": "CDT application deleted successfully"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Error Response Format

```json
{
  "detail": "Error description"
}
```

## CDT Status Values

- `pending` - Solicitud pendiente de revisión
- `approved` - Solicitud aprobada
- `rejected` - Solicitud rechazada
- `completed` - CDT completado/vencido