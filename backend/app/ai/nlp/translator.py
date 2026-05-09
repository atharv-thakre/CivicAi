import requests
from app.ai.nlp.language import resolve_lang
from deep_translator import GoogleTranslator
from app.database.complaints import upsert_translation, get_complaint
from bin.utils import to_dict

def translate(complaint_id: int):
    text = to_dict(get_complaint(complaint_id))
    text = text['description']
    auto = resolve_lang(text)
    src = auto['gtrans_src']
    tgt = 'en'
    if src == tgt :
        return text

    result = GoogleTranslator(source=src, target=tgt).translate(text)
    upsert_translation(complaint_id, result)

    return result


def deep_translate(text, tgt="en"):
    url = "http://localhost:8001/translate"
    
    auto = resolve_lang(text)
    print(auto)
    if auto['detected'] == tgt:
        return text
    
    response = requests.post(url, json={
        "text": text,
        "src_lang": auto['deep_src'],
        "tgt_lang": 'eng_Latn'
    })
    
    return response.json()["translated"]

