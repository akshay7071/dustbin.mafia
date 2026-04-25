"""
seed_collectors.py
Run once to create 3 collectors in Firestore for the demo.
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.firebase import get_db

collectors = [
    {
        "name":          "Ravi Shinde",
        "phone":         "9876543210",
        "assigned_zone": ["Gulmandi Market", "Mondha Market", "Kranti Chowk",
                          "Juna Bazaar", "Osmanpura", "Nirala Bazaar"],
        "status":        "active",
    },
    {
        "name":          "Suresh Patil",
        "phone":         "9876543211",
        "assigned_zone": ["Cidco N-1", "Cidco N-2", "Cidco N-3",
                          "Cidco N-4", "Cidco N-5", "Cidco N-6"],
        "status":        "active",
    },
    {
        "name":          "Anil Jadhav",
        "phone":         "9876543212",
        "assigned_zone": ["Chikalthana MIDC", "Shendra MIDC",
                          "Waluj MIDC", "Daultabad Industrial"],
        "status":        "idle",
    },
]

def seed():
    db = get_db()
    col = db.collection("collectors")

    for c in collectors:
        doc_ref = col.add(c)
        print(f"✅ Created collector: {c['name']} → ID: {doc_ref[1].id}")

    print("\nDone! Check Firestore for 'collectors' collection.")

if __name__ == "__main__":
    seed()