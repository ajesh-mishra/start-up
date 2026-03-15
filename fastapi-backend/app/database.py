from sqlmodel import create_engine, Session

DATABASE_HOST = "postgres-database"
DATABASE_PORT = 5432
DATABASE_USER = "postgres"
DATABASE_PASSWORD = "postgres"  
DATABASE_URL = (
    f"postgresql+psycopg2://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}"
)

engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session
