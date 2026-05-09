#app/ai/llm/action.py

import asyncio , json
from app.ai.llm.core import groq_call
from app.ai.prompt import SYSTEM_PROMPT_04
from app.ai.context import context_prompt_04
from app.database.complaints import upsert_action_plan


def create_action_plan(complaint_id: int):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT_04},
        {"role": "user", "content": context_prompt_04(complaint_id)}
    ]

    response = asyncio.run(groq_call(messages))

    raw_text = response.strip()
    raw_text = raw_text.replace("```json", "").replace("```", "").strip()
    parsed = json.loads(raw_text)

    upsert_action_plan(complaint_id=complaint_id, analysis=parsed)
    return parsed



y = {
    'root_cause': 'Tree collapse likely caused by storm or weak structural integrity due to recent rainfall', 
    'impact': 'Road blockage causing traffic disruption, potential accidents, and safety risks to pedestrians and drivers', 
    'action_plan': [
        'Barricade the area to prevent accidents and ensure pedestrian safety', 
        'Deploy tree cutting team to inspect the area and remove the fallen tree safely', 
        'Clear debris and restore road access to normal traffic flow'], 
    'eta': '4-6 hours', 
    'resources': [
        'tree cutting crew', 
        'barricades', 
        'signage equipment', 
        'chainsaws', 
        'transport vehicle']
}
