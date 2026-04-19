from app.database.db import engine
from app.database.models import Base  

def init_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Done ✅")

def drop_db():
    print("Dropping tables...")
    Base.metadata.drop_all(bind=engine)
    print("Done ✅")


if __name__ == "__main__":
    init_db()
    # drop_db()