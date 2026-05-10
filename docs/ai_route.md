# AI Route Documentation

Base domain used in the examples below:

```js
const baseDomain = "http://localhost:8000";
```

All routes in this file are protected by `get_current_user`, so the request must include a valid Bearer token:

```http
Authorization: Bearer <your_access_token>
Content-Type: application/json
```

## `POST /ai/chat`

Sends a user message to the AI chat flow. The route loads the current user's conversation history, prepends complaint context using `complaint_id`, sends the full message list to the LLM, stores the new user/assistant messages, and returns the assistant reply.

### Input schema

Schema: `AIRequest`

```json
{
	"message": "string",
	"complaint_id": 1
}
```

Fields:

- `message` required string. The user's message to the AI.
- `complaint_id` optional integer. Defaults to `1`.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/ai/chat`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	},
	body: JSON.stringify({
		message: "Summarize the complaint status and suggest the next step.",
		complaint_id: 1,
	}),
});

const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
	"response": "string"
}
```

Notes:

- The `response` field contains the assistant output returned by the model.
- The route also persists the new user message and assistant message in the conversation history for the authenticated user.

### Example response

```json
{
	"response": "The complaint is currently under review. Please provide any supporting evidence if available."
}
```

## `POST /ai/improve`

Sends a message to the AI improvement flow using the fixed system prompt `SYSTEM_PROMPT_02`. This route does not use complaint history.

### Input schema

Schema: `ImproveRequest`

```json
{
	"message": "string"
}
```

Fields:

- `message` required string. The text to improve or rewrite.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/ai/improve`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	},
	body: JSON.stringify({
		message: "Make this complaint clearer and more formal.",
	}),
});

const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
	"response": "string"
}
```

Notes:

- The `response` field contains the rewritten or improved text returned by the model.
- No chat history is stored by this route.

### Example response

```json
{
	"response": "Please review the complaint details and provide any relevant supporting documents so the case can be processed efficiently."
}
```
