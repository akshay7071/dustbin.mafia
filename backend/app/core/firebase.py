import firebase_admin
from firebase_admin import credentials, firestore

_initialized = False

def get_db():
    global _initialized
    if not _initialized:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        _initialized = True
    return firestore.client()