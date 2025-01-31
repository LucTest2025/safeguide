from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from DataBase.database import get_db
import DataBase.models as models

app = FastAPI()

# Route GET pour récupérer tous les utilisateurs
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


# 📌 Définition du modèle Pydantic pour le body JSON
class UserCreate(BaseModel):
    userName: str
    password: str
    email: str | None = None  # Email est optionnel

# 📌 Route POST pour créer un utilisateur (attend un body JSON)
@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(userName=user.userName, password=user.password, email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


class ItineraireCreate(BaseModel):
    dureeEstimee: float
    altitude: float
    difficulte: str
    distance: float
    userID: int  # ID de l'utilisateur associé à l'itinéraire

# 📌 Route GET pour récupérer tous les refuges
@app.get("/refuges")
def get_refuges(db: Session = Depends(get_db)):
    refuges = db.query(models.Refuge).all()
    return refuges

# 📌 Route GET pour récupérer tous les itinéraires
@app.get("/itineraires")
def get_itineraires(db: Session = Depends(get_db)):
    itineraires = db.query(models.Itineraire).all()
    return itineraires

# 📌 Route POST pour créer un itinéraire
@app.post("/itineraires")
def create_itineraire(itineraire: ItineraireCreate, db: Session = Depends(get_db)):
    new_itineraire = models.Itineraire(
        dureeEstimee=itineraire.dureeEstimee,
        altitude=itineraire.altitude,
        difficulte=itineraire.difficulte,
        distance=itineraire.distance,
        userID=itineraire.userID
    )
    db.add(new_itineraire)
    db.commit()
    db.refresh(new_itineraire)
    return new_itineraire