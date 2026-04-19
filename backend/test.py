from app.database.complaints import is_complete , get_complaint
from bin.utils import to_dict

complaint = to_dict(get_complaint(1))
print(complaint["cleaned_text"])
print(is_complete(1))