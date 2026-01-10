import os
import mysql.connector

def registrar_adopcion(data):
    conn = mysql.connector.connect(
        host=os.environ.get("DB_HOST"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
        database=os.environ.get("DB_NAME")
    )

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO adopcion
        (nombre_adoptante, email, telefono, direccion, motivacion)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        data["nombreAdoptante"],
        data["email"],
        data["telefono"],
        data["direccion"],
        data["motivacion"]
    ))

    conn.commit()
    cursor.close()
    conn.close()

