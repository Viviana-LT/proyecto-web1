import os
import mimetypes
import mysql.connector
import json
from flask import Flask, request, jsonify, send_from_directory
from adop import registrar_adopcion

app = Flask(__name__)

# ---------------- CONFIG ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DB_HOST = os.environ.get("DB_HOST")
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_NAME = os.environ.get("DB_NAME")

# Tipos MIME
mimetypes.add_type('font/ttf', '.ttf')
mimetypes.add_type('image/png', '.png')
mimetypes.add_type('image/jpeg', '.jpg')
mimetypes.add_type('image/jpeg', '.jpeg')

# ---------------- DB ----------------
def conectar_db():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=int(os.getenv("DB_PORT")),
        ssl_disabled=False
    )

# ---------------- API ----------------
@app.route("/api/productos")
def api_productos():
    db = conectar_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos WHERE stock > 0")
    productos = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(productos)

@app.route("/api/pagar", methods=["POST"])
def pagar():
    productos = request.json
    db = conectar_db()
    cursor = db.cursor()

    for item in productos:
        cursor.execute(
            "UPDATE productos SET stock = stock - %s WHERE nombre = %s AND stock >= %s",
            (item["cantidad"], item["title"], item["cantidad"])
        )

    db.commit()
    cursor.close()
    db.close()
    return jsonify({"success": True})

@app.route("/api/ver_resenas", methods=["GET"])
def ver_resenas():
    try:
        db = conectar_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT nombre_usuario, titulo, calificacion, contenido
            FROM reseñas
            ORDER BY id DESC
        """)

        datos = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(datos)

    except Exception as e:
        print("ERROR RESEÑAS:", e)
        return jsonify({"error": str(e)}), 500



@app.route("/api/resenas", methods=["POST"])
def crear_resena():
    data = request.json
    db = conectar_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO reseñas (nombre_usuario, titulo, calificacion, contenido)
        VALUES (%s, %s, %s, %s)
    """, (
        data["nombre_usuario"],
        data["titulo"],
        data["calificacion"],
        data["contenido"]
    ))

    db.commit()
    cursor.close()
    db.close()
    return jsonify({"mensaje": "Reseña guardada"})

@app.route("/adopcion", methods=["POST"])
def adopcion():
    data = request.json
    print(" LLEGÓ ADOPCIÓN")
    print(data)
    return jsonify({"ok": True})


# ---------------- ARCHIVOS ----------------
@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/recurs/<path:filename>")
def imagenes(filename):
    return send_from_directory(os.path.join(BASE_DIR, "recurs"), filename)

@app.route("/<path:archivo>")
def archivos(archivo):
    return send_from_directory(BASE_DIR, archivo)
