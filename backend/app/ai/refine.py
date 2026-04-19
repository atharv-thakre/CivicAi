import re , json 

def extract_json_regex(text):
    try:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return match.group(0)
        return None
    except Exception as e:
        return f"Error: {e}"


def extract_json(text):
    try:
        # Find first { and last }
        start = text.find("{")
        end = text.rfind("}") + 1

        if start == -1 or end == -1:
            return None  # No JSON found

        json_str = text[start:end]
        return json_str

    except Exception as e:
        return f"Error: {e}"


def get_valid_json(text):
    json_str = extract_json(text)
    try:
        return json.loads(json_str)
    except:
        return None
