import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")


connection = psycopg2.connect(DB_URL)

scribe = connection.cursor()

scribe.execute("INSERT INTO routers (name) VALUES (%s)",("TEST ROUTER",))

connection.commit()
scribe.close()
connection.close()