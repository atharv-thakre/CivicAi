# Report Route Documentation

Base domain used in the examples below:

```js
const baseDomain = "http://localhost:8000";
```

All routes in this group are public and do not require authentication.

## `GET /report/{complaint_id}`

Generates and returns a styled HTML report page for a complaint. The report includes all complaint details, AI analysis, action plan, images, and metrics in a print-friendly format.

### Input schema

Path parameter:

- `complaint_id` required integer. The complaint id to generate the report for.

### Fetch example

```js
const baseDomain = "http://localhost:8000";
const complaintId = 1;

const response = await fetch(`${baseDomain}/report/${complaintId}`);
const html = await response.text();

// Option 1: Display in an iframe
const iframe = document.createElement("iframe");
iframe.srcdoc = html;
document.body.appendChild(iframe);

// Option 2: Open in new window
const newWindow = window.open();
newWindow.document.write(html);
newWindow.document.close();
```

### Response output

Success response: HTML document styled for both screen display and PDF export.

The report includes:

- **Header section**: Complaint reference, title, status badge, severity level, and urgency indicator.
- **Meta information**: Complaint id, creation date, assigned officer, priority level, and upvotes.
- **Description**: Full complaint text and any translated content.
- **AI Analysis**: Department classification, confidence score, severity rating, and AI-generated tags.
- **Images**: Main complaint image and any supporting images (front, left, right, back).
- **Action Plan**: Root cause, impact assessment, step-by-step action items, ETA, and required resources.
- **Metrics**: Priority, upvotes, location coordinates, and pincode.
- **Footer**: Generation timestamp and complaint reference.

### Report features

**Screen display:**

- Sticky top action bar with "Download PDF" button.
- Card layout with shadow and border.
- Responsive grid layout for different screen sizes.
- Print button trigger using `window.print()`.

**PDF export:**

- A4 page size with 12mm/14mm margins.
- All colors and backgrounds preserved during print (using `print-color-adjust: exact`).
- Page breaks managed to avoid awkward cuts mid-section.
- No borders, shadows, or rounded corners in PDF mode.
- All text, badges, and metrics fully visible in print.

### Color scheme

The report uses dynamic colors based on the complaint's severity and status:

- **Severity colors**: High (red #dc2626), Medium (amber #d97706), Low (green #16a34a)
- **Status colors**: Draft (gray), Open (blue), In Progress (amber), Resolved (green), Closed (dark gray)
- **Brand color**: Primary blue (#1d4ed8)

### Example report structure

The HTML report contains:

1. **Action bar** (screen only) with download button
2. **Header band** with complaint title, reference, status, severity badges
3. **Meta grid** with key complaint metadata (created date, assigned to, priority, upvotes)
4. **Description box** with full complaint text
5. **AI Analysis section** with department, confidence score, tags, and severity
6. **Images section** with complaint photos (main and supporting angles)
7. **Action Plan section** with root cause, impact, steps, ETA, and resources
8. **Metrics row** showing priority, upvotes, location, and pincode
9. **Footer** with timestamp and complaint reference

### Notes

- Complaint images are loaded from `https://app.totalchaos.online/data/complaints/{complaint_id}/` path. If images are not available, placeholder text is shown.
- The report is fully responsive and works on desktop, tablet, and mobile browsers.
- Print styling automatically removes the action bar and optimizes layout for paper.
- Custom fonts used: IBM Plex Sans, IBM Plex Mono (loaded from Google Fonts).
