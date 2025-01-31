from database import engine
from models import Base

print("🔄 Création des tables dans la base de données...")
Base.metadata.create_all(bind=engine)
print("✅ Tables créées avec succès !")
