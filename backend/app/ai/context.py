from app.database.complaints import get_complaint 
from bin.utils import to_dict
from app.ai.prompt import SYSTEM_PROMPT_01, SYSTEM_PROMPT_03

def context_prompt_01(complaint_id: int = 1):
    complaint = to_dict(get_complaint(complaint_id))
    if not complaint.get("translated_text"):
        text = complaint.get("description")
    else:
        text = complaint.get("translated_text")


    context = f"""
Complaint Details:
- Category: {complaint.get("category")}
- tags: {complaint.get("ai_tags")}
- Severity: {complaint.get("severity")}
- Description: {text}
"""

    # OPTIONAL: add area intelligence
    # area = get_area_stats(...)
    # context += f"""
    # Area Insights:
    # - Risk Score: {area["risk_score"]}
    # - Trend: {area["trend"]}
    # """

    return SYSTEM_PROMPT_01 + "\n\n" + context


def context_prompt_03(complaint_id: int = 1):
    complaint = to_dict(get_complaint(complaint_id))
    if not complaint.get("translated_text"):
        text = complaint.get("description")
    else:
        text = complaint.get("translated_text")


    context = f"""
Complaint Details:
- Title: {complaint.get("title")}
- Category: {complaint.get("category")}
- Description: {text}
"""
    return context + "\n\n" + SYSTEM_PROMPT_03



def context_prompt_04(complaint_id: int = 1):
    complaint = to_dict(get_complaint(complaint_id))
    if not complaint.get("translated_text"):
        text = complaint.get("description")
    else:
        text = complaint.get("translated_text")


    context = f"""
Complaint Details:
- Category: {complaint.get("category")}
- tags: {complaint.get("ai_tags")}
- Department: {complaint.get("ai_department")}
- Severity: {complaint.get("ai_severity")}
- Description: {text}
- Address: {complaint.get("address")}
"""
    return context