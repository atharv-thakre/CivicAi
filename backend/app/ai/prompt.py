from app.database.complaints import get_complaint 
from bin.utils import to_dict

def read_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
        return content
    except Exception as e:
        return f"Error reading file: {e}"


SYSTEM_PROMPT = """
You are a Civic AI Assistant designed to analyze and respond to urban infrastructure issues.

Your role:
- Understand civic complaints (potholes, garbage, streetlights, etc.)
- Use provided structured data to give accurate, practical responses
- Suggest actionable solutions or next steps
- Be concise, factual, and helpful

Guidelines:
- Base your answers ONLY on the provided complaint and area data
- Do NOT hallucinate missing information
- If data is insufficient, say so clearly
- Prioritize public safety and urgency
- Use severity and area risk to guide recommendations

Tone:
- Professional
- Clear
- Action-oriented

Output style:
- Short explanation
- Clear recommendation (if applicable)
"""

def context_prompt(complaint_id: int):
    complaint = to_dict(get_complaint(complaint_id))

    context = f"""
Complaint Details:
- Category: {complaint.get("category")}
- Severity: {complaint.get("severity")}
- Description: {complaint.get("cleaned_text")}
- Status: {complaint.get("status")}
- Location: ({complaint.get("latitude")}, {complaint.get("longitude")})
- Created At: {complaint.get("created_at")}
"""

    # OPTIONAL: add area intelligence
    # area = get_area_stats(...)
    # context += f"""
    # Area Insights:
    # - Risk Score: {area["risk_score"]}
    # - Trend: {area["trend"]}
    # """

    return SYSTEM_PROMPT + "\n\n" + context


