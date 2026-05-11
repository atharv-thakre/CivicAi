# Complaint Route Documentation

Base domain used in the examples below:

```js
const baseDomain = "http://localhost:8000";
```

Some routes are public, while create/update/upload routes require authentication. For protected routes, send:

```http
Authorization: Bearer <your_access_token>
```

When sending JSON or form bodies, also include:

```http
Content-Type: application/json
```

or, for file uploads:

```http
Content-Type: multipart/form-data
```

## `GET /complaint/nearby`

Returns complaints near the provided coordinates.

### Input schema

Query parameters:

- `lat` required number.
- `lng` required number.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const lat = 28.6139;
const lng = 77.209;

const response = await fetch(`${baseDomain}/complaint/nearby?lat=${lat}&lng=${lng}`);
const data = await response.json();
console.log(data);
```

### Response output

Success response: an array of `NearbyComplaintResponse` objects.

Schema shape:

```json
[
	{
		"ref": 1,
		"title": "Pothole on main road",
		"description": "Large pothole near the junction",
		"status": "open",
		"category": "roads",
		"address": "Main Street",
		"pincode": "110001",
		"ai_tags": ["road", "pothole"],
		"upvotes": 3,
		"created_at": "2026-05-11T10:00:00Z"
	}
]
```

## `GET /complaint/`

Returns the full complaint detail for a complaint id.

### Input schema

Query parameters:

- `complaint_id` required integer.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const complaintId = 1;

const response = await fetch(`${baseDomain}/complaint?complaint_id=${complaintId}`);
const data = await response.json();
console.log(data);
```

### Response output

Success response: a `ComplaintResponse` object.

Schema shape:

```json
{
	"ref": 1,
	"title": "Pothole on main road",
	"description": "Large pothole near the junction",
	"translated_text": null,
	"category": "roads",
	"ai_department": "Public Works",
	"ai_confidence": 0.91,
	"ai_severity": "high",
	"ai_tags": ["road", "pothole"],
	"is_urgent": true,
	"status": "open",
	"assigned_to": null,
	"lat": 28.6139,
	"lng": 77.209,
	"address": "Main Street",
	"pincode": "110001",
	"image_url": "/data/complaints/1/img_main.jpg",
	"report_url": "/report/1",
	"action_plan": {
		"root_cause": "Tree collapse likely caused by storm or weak structural integrity due to recent rainfall",
		"impact": "Road blockage causing traffic disruption, potential accidents, and safety risks to pedestrians and drivers",
		"action_plan": [
			"Barricade the area to prevent accidents and ensure pedestrian safety",
			"Deploy tree cutting team to inspect the area and remove the fallen tree safely",
			"Clear debris and restore road access to normal traffic flow"
		],
		"eta": "4-6 hours",
		"resources": [
			"tree cutting crew",
			"barricades",
			"signage equipment",
			"chainsaws",
			"transport vehicle"
		]
	},
	"internal_priority": 0.75,
	"upvotes": 3,
	"created_at": "2026-05-11T10:00:00Z"
}
```

Action plan schema:

- `root_cause` string describing the likely cause of the complaint.
- `impact` string describing the operational or public impact.
- `action_plan` array of strings describing the recommended response steps.
- `eta` string describing the estimated time to resolve.
- `resources` array of strings describing the required resources.

Possible error responses:

- `404` with `{"detail":"Complaint not found"}` when the complaint id does not exist.

## `POST /complaint/create`

Creates a new complaint and uploads the main image for it.

### Authentication

Required. Send a Bearer token in the `Authorization` header.

### Input schema

Multipart form-data fields from `ComplaintCreate.as_form` plus one file field:

- `title` required string.
- `description` required string.
- `lat` required number.
- `lng` required number.
- `address` required string.
- `pincode` required string.
- `category` required string.
- `image` required file. Must be JPG or PNG.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const formData = new FormData();
formData.append("title", "Pothole on main road");
formData.append("description", "Large pothole near the junction");
formData.append("lat", "28.6139");
formData.append("lng", "77.209");
formData.append("address", "Main Street");
formData.append("pincode", "110001");
formData.append("category", "roads");
formData.append("image", fileInput.files[0]);

const response = await fetch(`${baseDomain}/complaint/create`, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${token}`,
	},
	body: formData,
});

const data = await response.json();
console.log(data);
```

### Response output

Success response: the created complaint object returned by the backend.

The response is the database complaint record, so the exact shape depends on the stored model. It will include complaint identifiers and the saved complaint fields.

Possible error responses:

- `400` with `"Only JPG/PNG allowed"` when the uploaded file type is invalid.
- `401` when the bearer token is missing or invalid.

## `POST /complaint/image`

Uploads an additional image for an existing complaint.

### Authentication

Required. Send a Bearer token in the `Authorization` header.

### Input schema

Multipart form-data fields:

- `complaint_id` required integer.
- `label` required string. Allowed values: `front`, `left`, `right`, `back`.
- `image` required file. Must be JPG or PNG.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const formData = new FormData();
formData.append("complaint_id", "1");
formData.append("label", "front");
formData.append("image", fileInput.files[0]);

const response = await fetch(`${baseDomain}/complaint/image`, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${token}`,
	},
	body: formData,
});

const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
	"message": "Image uploaded",
	"complaint_id": 1,
	"label": "front",
	"path": "d:/Code PlayGround/PROJECTS/Civic AI/data/complaints/1/img_front.jpg"
}
```

Possible error responses:

- `400` with `"Invalid label"` when the label is not one of the allowed values.
- `400` with `"Only JPG/PNG allowed"` when the uploaded file type is invalid.
- `401` when the bearer token is missing or invalid.

## `PUT /complaint/status`

Updates the status of a complaint.

### Authentication

Required. Send a Bearer token in the `Authorization` header.

### Input schema

Multipart form-data fields:

- `complaint_id` required integer.
- `status` required string.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const formData = new FormData();
formData.append("complaint_id", "1");
formData.append("status", "resolved");

const response = await fetch(`${baseDomain}/complaint/status`, {
	method: "PUT",
	headers: {
		Authorization: `Bearer ${token}`,
	},
	body: formData,
});

const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
	"message": "Complaint : 1 status updated to resolved"
}
```

Possible error responses:

- `404` with `{"detail":"Complaint not found"}` when the complaint id does not exist or status update fails.
- `401` when the bearer token is missing or invalid.

## `GET /complaint/officer`

Returns complaints assigned to the authenticated officer.

### Authentication

Required. Send a Bearer token in the `Authorization` header.

### Input schema

No request body or query parameters.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const token = localStorage.getItem("token");

const response = await fetch(`${baseDomain}/complaint/officer`, {
	method: "GET",
	headers: { Authorization: `Bearer ${token}` },
});

const data = await response.json();
console.log(data);
```

### Response output

Success response: an array of complaint objects assigned to the authenticated officer.

Example shape matches the `ComplaintResponse` fields (list form).

Possible error responses:

- `401` when the bearer token is missing or invalid.

## `GET /complaint/all`

Returns all complaints in the system (public listing).

### Input schema

No request body or query parameters.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/complaint/all`);
const data = await response.json();
console.log(data);
```

### Response output

Success response: an array of all complaint objects in the system.

Example shape: an array of objects with the same fields as the `ComplaintResponse` (summary or full objects depending on backend implementation).

Possible error responses:

- `500` on server error.

