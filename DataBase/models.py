from sqlalchemy import Column, Date, Integer, String, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from DataBase.database import Base

# 📌 Table d'association pour Itinéraire <-> Point (Relation N:N)
itineraire_point_table = Table(
    "itineraire_point", Base.metadata,
    Column("idItineraire", ForeignKey("itineraire.idItineraire", ondelete="CASCADE"), primary_key=True),
    Column("idPoint", ForeignKey("point.idPoint", ondelete="CASCADE"), primary_key=True)
)

# 📌 Table d'association pour User <-> ItinéraireManager (Relation N:N)
itineraire_manager_table = Table(
    "itineraire_manager", Base.metadata,
    Column("idUser", ForeignKey("user.userID", ondelete="CASCADE"), primary_key=True),
    Column("idItineraire", ForeignKey("itineraire.idItineraire", ondelete="CASCADE"), primary_key=True)
)

# 📌 Modèle pour les Refuges
class Refuge(Base):
    __tablename__ = "refuge"

    idRefuge = Column(Integer, primary_key=True, index=True)
    nomRefuge = Column(String, nullable=False)
    typeRefuge = Column(String)
    communeRefuge = Column(String)
    altitudeMoyenne = Column(Float)
    typeAcces = Column(String)

    points = relationship("Point", back_populates="zone_refuge")


# 📌 Modèle pour les Utilisateurs
# 📌 Modèle pour les Utilisateurs
class User(Base):
    __tablename__ = "user"

    userID = Column(Integer, primary_key=True, index=True)
    userName = Column(String, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, nullable=True)

    # Relations corrigées : utiliser des chaînes de caractères pour éviter le problème
    alerts_visuelles = relationship("AlertVisuelle", back_populates="user", cascade="all, delete-orphan")
    alerts_vibrantes = relationship("AlertVibrante", back_populates="user", cascade="all, delete-orphan")

    itineraires = relationship("Itineraire", secondary=itineraire_manager_table, back_populates="users")
   

# 📌 Modèle pour les Itinéraires
class Itineraire(Base):
    __tablename__ = "itineraire"

    idItineraire = Column(Integer, primary_key=True, index=True)
    dureeEstimee = Column(Float)
    altitude = Column(Float)
    difficulte = Column(String)
    distance = Column(Float)

    users = relationship("User", secondary=itineraire_manager_table, back_populates="itineraires")
    points = relationship("Point", secondary=itineraire_point_table, back_populates="itineraires")


# 📌 Modèle pour les Points Géographiques
class Point(Base):
    __tablename__ = "point"

    idPoint = Column(Integer, primary_key=True, index=True)
    longitude = Column(Float, nullable=False)
    latitude = Column(Float, nullable=False)
    idZoneRefuge = Column(Integer, ForeignKey("refuge.idRefuge", ondelete="CASCADE"))

    zone_refuge = relationship("Refuge", back_populates="points")
    itineraires = relationship("Itineraire", secondary=itineraire_point_table, back_populates="points")

class AlertVibrante(Base):
    __tablename__ = "alert_vibrante"

    idAlertVibrante = Column(Integer, primary_key=True, index=True)
    dateVibrante = Column(Date, nullable=False)
    intensite = Column(Integer, nullable=False)
    userID = Column(Integer, ForeignKey("user.userID", ondelete="CASCADE"))

    user = relationship("User", back_populates="alerts_vibrantes")


class AlertVisuelle(Base):
    __tablename__ = "alert_visuelle"

    idAlertVisuelle = Column(Integer, primary_key=True, index=True)
    dateVisuelle = Column(Date, nullable=False)
    userID = Column(Integer, ForeignKey("user.userID", ondelete="CASCADE"))

    user = relationship("User", back_populates="alerts_visuelles")
