import os
from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context
from dotenv import load_dotenv
from DataBase.models import Base

# Charger les variables d'environnement depuis .env
load_dotenv()


# Récupérer DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL n'est pas défini ! Vérifie ton fichier .env.")

# Configurer Alembic
config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Configurer les logs
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Cible pour l'autogénération des migrations
target_metadata = Base.metadata
print("🔍 Vérification du metadata :", target_metadata.tables.keys())
def run_migrations_offline() -> None:
    """Exécuter les migrations en mode offline."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Exécuter les migrations en mode online."""
    engine = create_engine(DATABASE_URL, poolclass=pool.NullPool)

    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
