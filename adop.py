import mysql.connector

def registrar_adopcion(data):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="neko_db"
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
