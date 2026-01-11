import os
import mysql.connector

def conectar_db():
    return mysql.connector.connect(
        host=os.environ.get("DB_HOST"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
        database=os.environ.get("DB_NAME"),
        port=int(os.environ.get("DB_PORT")),
        ssl_disabled=False
    )

def registrar_adopcion(data):
    conn = conectar_db()
    cursor = conn.cursor()

    sql = """
    INSERT INTO adopcion
    (nombre_adoptante, email, telefono, direccion, motivacion)
    VALUES (%s, %s, %s, %s, %s)
    """

    valores = (
        data["nombreAdoptante"],
        data["email"],
        data["telefono"],
        data["direccion"],
        data["motivacion"]
    )

    cursor.execute(sql, valores)
    conn.commit()

    cursor.close()
    conn.close()
