# User Route Documentation

Base domain used in the examples below:

```js
const baseDomain = "http://localhost:8000";
```

All routes in this group are protected and require authentication. Send a Bearer token in the `Authorization` header:

```http
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

## `GET /user/complaints`

Returns all complaints created by the authenticated user.

### Authentication

Required. Send a Bearer token in the `Authorization` header.

### Input schema

No request body or query parameters.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const token = localStorage.getItem("token");

const response = await fetch(`${baseDomain}/user/complaints`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
console.log(data);
```

### Response output

Success response: an array of complaint objects created by the user.

Example shape:

```json
[
  {
    "id": 1,
    "ref": 101,
    "title": "Pothole on main road",
    "description": "Large pothole near the junction causing traffic disruption",
    "category": "roads",
    "status": "open",
    "lat": 28.6139,
    "lng": 77.209,
    "address": "Main Street",
    "pincode": "110001",
    "ai_department": "Public Works",
    "ai_severity": "high",
    "ai_confidence": 0.91,
    "ai_tags": ["road", "pothole"],
    "is_urgent": true,
    "internal_priority": 0.75,
    "upvotes": 3,
    "assigned_to": null,
    "created_at": "2026-05-11T10:00:00Z"
  },
  {
    "id": 2,
    "ref": 102,
    "title": "Street light not working",
    "description": "Street light on Oak Avenue is not functioning",
    "category": "lighting",
    "status": "in_progress",
    "lat": 28.6150,
    "lng": 77.210,
    "address": "Oak Avenue",
    "pincode": "110002",
    "ai_department": "Municipal Corporation",
    "ai_severity": "medium",
    "ai_confidence": 0.87,
    "ai_tags": ["lighting", "maintenance"],
    "is_urgent": false,
    "internal_priority": 0.45,
    "upvotes": 1,
    "assigned_to": "officer_name",
    "created_at": "2026-05-10T15:30:00Z"
  }
]
```

Fields in each complaint object:

- `id` integer. Internal database id.
- `ref` integer. Public complaint reference number.
- `title` string. Complaint title.
- `description` string. Full complaint description.
- `category` string. Complaint category (e.g., roads, lighting, water).
- `status` string. Current status (draft, open, in_progress, resolved, closed).
- `lat` float. Latitude coordinate.
- `lng` float. Longitude coordinate.
- `address` string. Location address.
- `pincode` string. Postal code.
- `ai_department` string. AI-predicted department responsible.
- `ai_severity` string. AI-predicted severity (high, medium, low).
- `ai_confidence` float. Confidence score (0-1) of AI classification.
- `ai_tags` array of strings. Auto-generated tags from AI analysis.
- `is_urgent` boolean. Whether marked as urgent.
- `internal_priority` float. Internal priority score.
- `upvotes` integer. Number of community upvotes.
- `assigned_to` string or null. Officer name if assigned.
- `created_at` string (ISO 8601). Complaint creation timestamp.

### Possible error responses

- `401` when the bearer token is missing or invalid.
- Empty array `[]` if the user has not created any complaints.
