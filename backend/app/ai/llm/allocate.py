from app.database.complaints import get_complaint, upsert_complaint_allocation
from bin.utils import to_dict

department_map = {
    "road_maintenance": 1,
    "waste_management": 2,
    "electrical": 3,
    "water_supply": 4,
    "drainage": 5,
    "public_safety": 6,
    "general": 7
}


def allocate_complaint(complaint_id: int):
    complaint = to_dict(get_complaint(complaint_id))

    if complaint["assigned_to"] is not None:
        return complaint

    if complaint["department"] not in department_map:
        upsert_complaint_allocation(complaint_id, 0)
        return 0
    
    department = complaint["department"]
    assigned_officer = department_map.get(department, 0)
    upsert_complaint_allocation(complaint_id, assigned_officer)

    return assigned_officer