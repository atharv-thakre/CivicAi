# Vote & Comment Route Documentation

Base domain used in the examples below:

```js
const baseDomain = "http://localhost:8000";
```

All routes in this group are protected and require authentication. Send a Bearer token in the `Authorization` header:

```http
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

## `POST /vote`

Creates a vote (upvote) on a complaint from the authenticated user.

### Authentication

Required. Send a Bearer token in the `Authorization` header.

### Input schema

Schema: `Vote`

```json
{
  "complaint_id": 1
}
```

Fields:

- `complaint_id` required integer. The complaint to upvote.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const token = localStorage.getItem("token");

const response = await fetch(`${baseDomain}/vote`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    complaint_id: 1,
  }),
});

const data = await response.json();
console.log(data);
```

### Response output

Success response: a vote object created by the backend.

Example shape:

```json
{
  "id": 1,
  "complaint_id": 1,
  "user_id": 1,
  "created_at": "2026-05-11T10:00:00Z"
}
```

Possible error responses:

- `401` when the bearer token is missing or invalid.

## `DELETE /vote`

Removes a vote (upvote) from a complaint by the authenticated user.

### Authentication

Required. Send a Bearer token in the `Authorization` header.

### Input schema

Schema: `Vote`

```json
{
  "complaint_id": 1
}
```

Fields:

- `complaint_id` required integer. The complaint to remove the upvote from.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const token = localStorage.getItem("token");

const response = await fetch(`${baseDomain}/vote`, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    complaint_id: 1,
  }),
});

const data = await response.json();
console.log(data);
```

### Response output

Success response: a confirmation message or the deleted vote object.

Example shape:

```json
{
  "message": "Vote removed successfully"
}
```

Possible error responses:

- `401` when the bearer token is missing or invalid.

## `GET /comment`

Returns all comments for a specific complaint.

### Authentication

Required. Send a Bearer token in the `Authorization` header.

### Input schema

Query parameter:

- `complaint_id` required integer. The complaint to retrieve comments for.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const token = localStorage.getItem("token");
const complaintId = 1;

const response = await fetch(`${baseDomain}/comment?complaint_id=${complaintId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
console.log(data);
```

### Response output

Success response: an array of comment objects for the complaint.

Example shape:

```json
[
  {
    "id": 1,
    "complaint_id": 1,
    "user_id": 1,
    "content": "This pothole needs immediate repair. It's causing accidents.",
    "created_at": "2026-05-11T09:00:00Z"
  },
  {
    "id": 2,
    "complaint_id": 1,
    "user_id": 2,
    "content": "I agree. We've reported this three times already.",
    "created_at": "2026-05-11T09:15:00Z"
  }
]
```

Possible error responses:

- `401` when the bearer token is missing or invalid.

## `POST /comment`

Creates a new comment on a complaint from the authenticated user.

### Authentication

Required. Send a Bearer token in the `Authorization` header.

### Input schema

Schema: `CommentRequest`

```json
{
  "complaint_id": 1,
  "content": "This pothole needs immediate repair. It's causing accidents."
}
```

Fields:

- `complaint_id` required integer. The complaint to comment on.
- `content` required string. The comment text, minimum length 10 and maximum length 1000.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const token = localStorage.getItem("token");

const response = await fetch(`${baseDomain}/comment`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    complaint_id: 1,
    content: "This pothole needs immediate repair. It's causing accidents.",
  }),
});

const data = await response.json();
console.log(data);
```

### Response output

Success response: the created comment object.

Example shape:

```json
{
  "id": 3,
  "complaint_id": 1,
  "user_id": 1,
  "content": "This pothole needs immediate repair. It's causing accidents.",
  "created_at": "2026-05-11T10:00:00Z"
}
```

Possible error responses:

- `401` when the bearer token is missing or invalid.
- Validation error when content length is less than 10 or greater than 1000.
