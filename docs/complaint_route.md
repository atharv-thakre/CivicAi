# Chain Route Documentation

Base domain used in the examples below:

```js
const baseDomain = "http://localhost:8000";
```

All routes in this group are public and do not require authentication.

## `GET /chain/verify`

Verifies the integrity of the blockchain chain.

### Input schema

No request body or query parameters.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/chain/verify`);
const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
  "status": true
}
```

Notes:

- `status` is a boolean indicating whether the chain verification passed.

## `GET /chain/records/{commit_sha}`

Returns records associated with a specific commit SHA from the blockchain.

### Input schema

Path parameter:

- `commit_sha` required string. The commit SHA to retrieve records for.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const commitSha = "abc123def456";

const response = await fetch(`${baseDomain}/chain/records/${commitSha}`);
const data = await response.json();
console.log(data);
```

### Response output

Success response: records associated with the commit.

The exact shape depends on the stored records. On success, returns the record objects.

Possible error responses:

```json
[
    {
        "ref": 1001,
        "user_id": 45,
        "title": "Pothole issue near MP Nagar",
        "category": "Road Maintenance",
        "ai_department": "Municipal Corporation",
        "ai_confidence": 0.94,
        "ai_severity": "High",
        "ai_tags": [
            "road",
            "pothole",
            "public safety"
        ],
        "is_urgent": true,
        "status": "open",
        "assigned_to": "Officer_101",
        "lat": 23.2599,
        "lng": 77.4126,
        "address": "MP Nagar Zone 1, Bhopal",
        "pincode": "462011",
        "internal_priority": 8.7,
        "upvotes": 34,
        "created_at": "2026-05-09 14:30:33.759993",
        "previous_hash": "GENESIS_BLOCK",
        "current_hash": "737482c6397eca93909bae97319b0f99f5d6627efb97ba0723d49540a0297107"
    },
    {
        "ref": 1002,
        "user_id": 76,
        "title": "Pothole issue near MP Nagar",
        "category": "Road Maintenance",
        "ai_department": "Municipal Corporation",
        "ai_confidence": 0.94,
        "ai_severity": "High",
        "ai_tags": [
            "road",
            "pothole",
            "public safety"
        ],
        "is_urgent": true,
        "status": "open",
        "assigned_to": "Officer_101",
        "lat": 23.2599,
        "lng": 77.4126,
        "address": "MP Nagar Zone 1, Bhopal",
        "pincode": "462011",
        "internal_priority": 8.7,
        "upvotes": 34,
        "created_at": "2026-05-09 14:32:00.180422",
        "previous_hash": "737482c6397eca93909bae97319b0f99f5d6627efb97ba0723d49540a0297107",
        "current_hash": "35b2f261bf7aa168673143ae4d8320e295746db7f746ad4994ff2ccb1efae63c"
    },
    {
        "ref": 2,
        "user_id": 1,
        "title": "broken wires posing a threat to locals",
        "category": "electricity",
        "ai_department": null,
        "ai_confidence": null,
        "ai_severity": null,
        "ai_tags": [],
        "is_urgent": false,
        "status": "draft",
        "assigned_to": null,
        "lat": 22.757,
        "lng": 75.8653,
        "address": "J-180 Harshwardhan Nagar",
        "pincode": "462003",
        "internal_priority": 0.0,
        "upvotes": 0,
        "created_at": "2026-05-11 16:51:42.274961",
        "previous_hash": "c78db55f6e22a15d34cb2f70ab0e399a14068bd93d8cfd756dd38db8aab2d39b",
        "current_hash": "72e4a03b779c26925c00deb15ce37464d8524865a83eaaf14801c52dc28f5c1b"
    }
]
```

## `GET /chain/diff/{commit_sha}`

Returns the diff of changes made in a specific commit.

### Input schema

Path parameter:

- `commit_sha` required string. The commit SHA to retrieve the diff for.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const commitSha = "abc123def456";

const response = await fetch(`${baseDomain}/chain/diff/${commitSha}`);
const data = await response.json();
console.log(data);
```

### Response output

Success response:

```json
{
  "diff": "string"
}
```

Possible error responses:

- `{"error": "Invaild commit_sha"}` when the commit SHA is invalid or not found.

## `GET /chain/audits/{user_id}`

Returns audit records for a specific user.

### Input schema

Path parameter:

- `user_id` required integer. The user id to retrieve audits for.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const userId = 1;

const response = await fetch(`${baseDomain}/chain/audits/${userId}`);
const data = await response.json();
console.log(data);
```

### Response output

Success response: an array of audit objects for the user.

Example shape:

```json
[
  {
    "id": 1,
    "user_id": 1,
    "action": "created_complaint",
    "timestamp": "2026-05-11T10:00:00Z"
  }
]
```

## `GET /chain/audits`

Returns all audit records across all users.

### Input schema

No request body or query parameters.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/chain/audits`);
const data = await response.json();
console.log(data);
```

### Response output

Success response: an array of all audit objects.

Example shape:

```json
[
  {
    "id": 1,
    "user_id": 1,
    "action": "created_complaint",
    "timestamp": "2026-05-11T10:00:00Z"
  },
  {
    "id": 2,
    "user_id": 2,
    "action": "voted_complaint",
    "timestamp": "2026-05-11T10:05:00Z"
  }
]
```

## `POST /chain/mainnet/create`

Creates a new mainchain record, linking blockchain data to a complaint.

### Input schema

Schema: `CreateMainchainRecord`

```json
{
  "record_id": 1,
  "hash_token": "abc123def456...",
  "commit_id": "commit_sha_123",
  "wallet": "0x742d35Cc6634C0532925a3b844Bc11e7c2D22e2d"
}
```

Fields:

- `record_id` required integer. The complaint or record id to link.
- `hash_token` required string. The blockchain hash token.
- `commit_id` required string. The blockchain commit id.
- `wallet` required string. The wallet address associated with this record.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/chain/mainnet/create`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    record_id: 1,
    hash_token: "abc123def456...",
    commit_id: "commit_sha_123",
    wallet: "0x742d35Cc6634C0532925a3b844Bc11e7c2D22e2d",
  }),
});

const data = await response.json();
console.log(data);
```

### Response output

Success response: the created mainchain record object.

Example shape:

```json
{
  "id": 1,
  "record_id": 1,
  "hash_token": "abc123def456...",
  "commit_id": "commit_sha_123",
  "wallet": "0x742d35Cc6634C0532925a3b844Bc11e7c2D22e2d",
  "created_at": "2026-05-11T10:00:00Z"
}
```

## `GET /chain/mainnet/{user_id}`

Returns all mainchain records for a specific user.

### Input schema

Path parameter:

- `user_id` required integer. The user id to retrieve mainchain records for.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const userId = 1;

const response = await fetch(`${baseDomain}/chain/mainnet/${userId}`);
const data = await response.json();
console.log(data);
```

### Response output

Success response: an array of mainchain records for the user.

Example shape:

```json
[
  {
    "id": 1,
    "record_id": 1,
    "hash_token": "abc123def456...",
    "commit_id": "commit_sha_123",
    "wallet": "0x742d35Cc6634C0532925a3b844Bc11e7c2D22e2d",
    "created_at": "2026-05-11T10:00:00Z"
  }
]
```

## `GET /chain/mainnet`

Returns all mainchain records across all users.

### Input schema

No request body or query parameters.

### Fetch example

```js
const baseDomain = "http://localhost:8000";

const response = await fetch(`${baseDomain}/chain/mainnet`);
const data = await response.json();
console.log(data);
```

### Response output

Success response: an array of all mainchain records.

Example shape:

```json
[
  {
    "id": 1,
    "record_id": 1,
    "hash_token": "abc123def456...",
    "commit_id": "commit_sha_123",
    "wallet": "0x742d35Cc6634C0532925a3b844Bc11e7c2D22e2d",
    "created_at": "2026-05-11T10:00:00Z"
  },
  {
    "id": 2,
    "record_id": 2,
    "hash_token": "xyz789uvw012...",
    "commit_id": "commit_sha_456",
    "wallet": "0x123456789abcdef...",
    "created_at": "2026-05-11T10:05:00Z"
  }
]
```
