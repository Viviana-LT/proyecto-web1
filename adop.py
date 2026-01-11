import os
import mysql.connector

def registrar_adopcion(data):
    conn = get_connection()
    cursor = conn.cursor()

    sql = """
    INSERT INTO adopciones
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