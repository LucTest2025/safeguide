import json
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# 📌 Charger le fichier JSON contenant les refuges
def load_refuges_from_json(json_file):
    with open(json_file, "r", encoding="utf-8") as file:
        refuges_data = json.load(file)

    db = SessionLocal()  # Ouvrir une session de base de données
    try:
        for refuge in refuges_data:
            new_refuge = models.Refuge(
                nomRefuge=refuge["nom"],
                typeRefuge=refuge["type"],
                communeRefuge=refuge["commune"],
                altitudeMoyenne=refuge["altitude"],
                typeAcces="Accessible PMR" if refuge["accessible_pmr"] else "Non accessible PMR"
            )
            db.add(new_refuge)

        db.commit()
        print(f"✅ {len(refuges_data)} refuges ajoutés avec succès !")
    except Exception as e:
        db.rollback()
        print(f"❌ Erreur lors de l'ajout des refuges : {e}")
    finally:
        db.close()

# 📌 Exécution du script
if __name__ == "__main__":
    json_file_path = "DataBase/refuges.json"  # Assure-toi que ce fichier contient les données JSON
    load_refuges_from_json(json_file_path)
