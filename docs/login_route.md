# Login Route Documentation

Base domain used in the examples below:

```js
const baseDomain = "http://localhost:8000";
```

This route group includes public auth endpoints and a few token-protected profile endpoints. For protected endpoints, send:

```http
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

## `POST /signup`

Registers a new user account.

### Input schema

Schema: `SignupRequest`

```json
{
	"email": "user@example.com",
	"password": "string",
	"handle": "username",
	"name": "Full Name",
	"role": "user"
}
```

Fields:

- `email` required email string.
- `password` required string, minimum length 6.
- `handle` required string, minimum length 2 and maximum length 16.
- `name` required string, minimum length 2 and maximum length 60.
- `role` required string, minimum length 2 and maximum length 60.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/signup`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		email: "user@example.com",
		password: "secret123",
		handle: "userone",
		name: "User One",
		role: "user",
	}),
});

const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
	"message": "User registered successfully"
}
```

Possible error responses:

- `500` with `{"detail":"Failed to register user"}` when user creation fails.
- Validation or integrity errors when the email or handle already exists or is invalid.

## `POST /auth/login`

Authenticates the user using either email or handle through the `identifier` field and returns a bearer access token.

### Input schema

Schema: `LoginRequest`

```json
{
	"identifier": "user@example.com",
	"password": "secret123"
}
```

Fields:

- `identifier` required string. Can be an email address or a handle.
- `password` required string, minimum length 6 and maximum length 60.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/auth/login`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		identifier: "user@example.com",
		password: "secret123",
	}),
});

const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
	"access_token": "string",
	"id": 1,
	"role": "user",
	"uid": "uuid",
	"token_type": "bearer"
}
```

Notes:

- `access_token` is the JWT bearer token.
- `id` is the numeric user id included in the token payload.
- `role` is the authenticated user role.
- `uid` is the user UUID string.

Possible error responses:

- `404` with `{"detail":"User not found"}` when credentials do not match a user.

## `POST /auth/otp`

Generates and sends a login OTP to the provided email or the email linked to the provided handle.

### Input schema

Schema: `OTPRequest`

```json
{
	"identifier": "user@example.com"
}
```

Fields:

- `identifier` required string. Can be an email address or a handle.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/auth/otp`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		identifier: "user@example.com",
	}),
});

const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
	"message": "OTP sent successfully"
}
```

Possible error responses:

- `404` with `{"detail":"User not found"}` when a handle does not exist.
- `429` with `{"detail":"Please wait before requesting another OTP"}` when the rate limit blocks another request.
- `500` with `{"detail":"Failed to send OTP"}` when email delivery fails.

## `GET /me/otp`

Sends a login OTP to the authenticated user’s email.

### Input schema

No request body.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/me/otp`, {
	method: "GET",
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
	"message": "OTP sent successfully"
}
```

Possible error responses:

- `401` when the token is missing or invalid.
- `429` with `{"detail":"Please wait before requesting another OTP"}` when the rate limit blocks another request.
- `500` with `{"detail":"Failed to send OTP"}` when email delivery fails.

## `GET /me`

Returns the authenticated user record.

### Input schema

No request body.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/me`, {
	method: "GET",
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

const data = await response.json();
console.log(data);
```

### Response output

Success response: a JSON object containing the current user fields returned by the backend user lookup.

Example shape:

```json
{
	"id": 1,
	"uid": "uuid",
	"email": "user@example.com",
	"role": "user"
}
```

Actual fields may include additional profile properties such as `name`, `handle`, `phone`, and `is_active`, depending on the stored user record.

