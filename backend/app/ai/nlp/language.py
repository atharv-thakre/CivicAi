from langdetect import detect, DetectorFactory
DetectorFactory.seed = 0  # consistency

LANG_CONFIG = {
    "en": {
        "name": "English",
        "deep": "eng_Latn",
        "gtrans": "en"
    },
    "hi": {
        "name": "Hindi",
        "deep": "hin_Deva",
        "gtrans": "hi"
    },
    "bn": {
        "name": "Bengali",
        "deep": "ben_Beng",
        "gtrans": "bn"
    },
    "gu": {
        "name": "Gujarati",
        "deep": "guj_Gujr",
        "gtrans": "gu"
    },
    "mr": {
        "name": "Marathi",
        "deep": "mar_Deva",
        "gtrans": "mr"
    },
    "pa": {
        "name": "Punjabi",
        "deep": "pan_Guru",
        "gtrans": "pa"
    },
    "ta": {
        "name": "Tamil",
        "deep": "tam_Taml",
        "gtrans": "ta"
    },
    "te": {
        "name": "Telugu",
        "deep": "tel_Telu",
        "gtrans": "te"
    },
    "kn": {
        "name": "Kannada",
        "deep": "kan_Knda",
        "gtrans": "kn"
    },
    "ml": {
        "name": "Malayalam",
        "deep": "mal_Mlym",
        "gtrans": "ml"
    },
    "ur": {
        "name": "Urdu",
        "deep": "urd_Arab",
        "gtrans": "ur"
    },
    "ne": {
        "name": "Nepali",
        "deep": "npi_Deva",
        "gtrans": "ne"
    }
}

def normalize_lang(code: str) -> str:
    if code in LANG_CONFIG:
        return code
    return "en"  # fallback


def detect_lang(text: str):
    text = text.strip()

    # Short text fallback
    if len(text) < 20:
        return "en"

    try:
        return detect(text)
    except:
        return "en"
    
def resolve_lang(text: str):
    detected = detect_lang(text)
    detected = normalize_lang(detected)

    config = LANG_CONFIG[detected]

    return {
        "language": config["name"],
        "detected": detected,
        "deep_src": config["deep"],
        "gtrans_src": config["gtrans"]
    }
