# Debate Route Documentation

Base domain used in the examples below:

```js
const baseDomain = "http://localhost:8000";
```

## `GET /debates/{complaint_id}`

Returns the debate room HTML page for a complaint. This page hosts the real-time WebSocket debate interface.

### Input schema

Path parameter:

- `complaint_id` required integer. The complaint id to open the debate room for.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const complaintId = 1;

const response = await fetch(`${baseDomain}/debates/${complaintId}`);
const html = await response.text();
console.log(html);
```

### Response output

Success response: HTML document (`debate_room.html`).

The HTML page is a debate interface that connects to the WebSocket endpoint below.

## `WebSocket /ws/debate/{complaint_id}`

Establishes a real-time WebSocket connection for debate/discussion on a complaint.

### Authentication

Required. The WebSocket connection requires a valid JWT token passed as a query parameter.

### Connection URL

```
ws://localhost:8000/ws/debate/{complaint_id}?token=<your_access_token>
```

or for HTTPS:

```
wss://localhost:8000/ws/debate/{complaint_id}?token=<your_access_token>
```

### Message schema

Messages are sent and received as JSON.

**Typing indicator message:**

```json
{
  "type": "typing"
}
```

**Chat message:**

```json
{
  "type": "message",
  "text": "Your message here"
}
```

Message constraints:

- `text` must not be empty after trimming.
- `text` must not exceed 200 characters.

### Fetch example

```js
const baseDomain = "localhost:8000";
const complaintId = 1;
const token = localStorage.getItem("token");

const ws = new WebSocket(`ws://${baseDomain}/ws/debate/${complaintId}?token=${token}`);

ws.addEventListener("open", (event) => {
  console.log("Connected to debate room");
  
  // Send a typing indicator
  ws.send(JSON.stringify({ type: "typing" }));
  
  // Send a message
  ws.send(JSON.stringify({
    type: "message",
    text: "What's the best approach to fix this issue?"
  }));
  
  // Trigger AI response by mentioning @ai
  ws.send(JSON.stringify({
    type: "message",
    text: "@ai summarize the current discussion"
  }));
});

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
});

ws.addEventListener("close", (event) => {
  console.log("Disconnected from debate room");
});

ws.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
});
```

### Response output

Messages received from the WebSocket include:

**User message broadcast:**

```json
{
  "type": "message",
  "username": "John Doe",
  "user_id": 1,
  "text": "What's the best approach?"
}
```

**System message (e.g., user joined/left):**

```json
{
  "type": "message",
  "username": "system",
  "text": "🟢 Jane Smith joined the chat"
}
```

**Typing indicator:**

```json
{
  "type": "typing",
  "username": "John Doe"
}
```

**User list update:**

```json
{
  "type": "users",
  "users": [
    { "username": "John Doe", "user_id": 1 },
    { "username": "Jane Smith", "user_id": 2 }
  ]
}
```

**AI response:**

```json
{
  "type": "message",
  "username": "ai",
  "text": "Based on the discussion, the recommended steps are..."
}
```

### Special features

- **Mentioning @ai**: If a message contains "@ai" (case-insensitive), an AI response handler is triggered asynchronously. The AI will analyze the context and broadcast a response to all connected users.
- **Typing indicators**: Clients can broadcast typing status to show that a user is composing a message.
- **User list**: Connected users list is broadcast whenever someone joins or leaves.
- **Rate limiting**: Messages with text exceeding 200 characters are silently dropped.

### Connection closing

The WebSocket will close with code `1008` if:

- No token is provided in query parameters.
- The token is invalid or expired.
- The authenticated user is not found in the database.

When a user disconnects, a system message is broadcast to notify others.
