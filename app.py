from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",   # WAMP
        database="adopciones"
    )

@app.route("/adoptar", methods=["POST"])
def adoptar():
    data = request.json

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        INSERT INTO adopcion
        (nombre_gato, nombre_persona, email, telefono, direccion, motivacion)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        data["nombre_gato"],
        data["nombre_persona"],
        data["email"],
        data["telefono"],
        data["direccion"],
        data["motivacion"]
    ))

    conexion.commit()
    cursor.close()
    conexion.close()

    return jsonify({"mensaje": "Solicitud enviada con éxito"})
