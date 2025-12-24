from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="adopciones"
    )

@app.route("/adoptar", methods=["POST"])
@app.route("/adoptar", methods=["POST"])
def adoptar():
    conexion = None
    cursor = None

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No llegaron datos"}), 400

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
        return jsonify({"mensaje": "Solicitud enviada con éxito"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor is not None:
            cursor.close()
        if conexion is not None:
            conexion.close()
