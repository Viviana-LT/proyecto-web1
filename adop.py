from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
app = Flask(__name__)
CORS(app)
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="neko_mori"
    )

@app.route("/adoptar", methods=["POST"])
def adoptar():
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    sql = """
        INSERT INTO adopciones
        (nombre_gato, nombre_adoptante, email, telefono, direccion, motivacion)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data["nombreGato"],
        data["nombreAdoptante"],
        data["email"],
        data["telefono"],
        data["direccion"],
        data["motivacion"]
    ))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"mensaje": "Adopción registrada con éxito 🐱"})

if __name__ == "__main__":
    app.run(debug=True)
