#app/control/execute.py

from app.ai.nlp.translator import translate
from app.ai.llm.img import analyze_image
from app.ai.llm.action import create_action_plan
from app.database.complaints import update_complaint_status

def execute(complaint_id: int):
    translate(complaint_id)
    analyze_image(complaint_id)
    create_action_plan(complaint_id)
    update_complaint_status(complaint_id, "submitted")
    print(f"Complaint : {complaint_id} submitted")