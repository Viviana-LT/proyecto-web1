import os
import mimetypes
import mysql.connector
import json
from decimal import Decimal

# Tipos de archivos
mimetypes.add_type('font/ttf', '.ttf')

# --- CONFIGURACIÓN ---
DB_HOST = "VivianaF.mysql.pythonanywhere-services.com"
DB_USER = "VivianaF"
DB_PASSWORD = "vhiX$dCjh@U59.x"
DB_NAME = "VivianaF$neko_mori"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def conectar_db():
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        return conn
    except Exception as e:
        print(f"Error de conexión: {e}")
        return None

# --- FUNCIONES LÓGICAS (DB) ---

def obtener_productos_db():
    db = conectar_db()
    if not db: return '500 ERROR', [('Content-Type', 'application/json')], json.dumps({"error":"no db"})
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos")
    lista = cursor.fetchall()
    for p in lista:
        for k, v in p.items():
            if isinstance(v, Decimal): p[k] = float(v)
    cursor.close()
    db.close()
    return '200 OK', [('Content-Type', 'application/json')], json.dumps(lista, ensure_ascii=False)

def obtener_resenas_db():
    db = conectar_db()
    if not db: return '500 ERROR', [('Content-Type', 'application/json')], json.dumps({"error":"no db"})
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT nombre_usuario, titulo, calificacion, contenido FROM resenas ORDER BY id DESC LIMIT 10")
    resenas = cursor.fetchall()
    cursor.close()
    db.close()
    return '200 OK', [('Content-Type', 'application/json')], json.dumps(resenas, ensure_ascii=False)

def crear_resena_db(raw_data):
    try:
        data = json.loads(raw_data)
        db = conectar_db()
        cursor = db.cursor()
        query = "INSERT INTO resenas (nombre_usuario, titulo, calificacion, contenido) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (data["nombre_usuario"], data["titulo"], data["calificacion"], data["contenido"]))
        db.commit()
        cursor.close()
        db.close()
        return '200 OK', [('Content-Type', 'application/json')], json.dumps({"mensaje": "Reseña guardada"})
    except Exception as e:
        return '500 ERROR', [('Content-Type', 'application/json')], json.dumps({"error": str(e)})

def procesar_pago(raw_data):
    try:
        productos = json.loads(raw_data)
        db = conectar_db()
        cursor = db.cursor()
        for item in productos:
            cursor.execute("UPDATE productos SET stock = stock - %s WHERE nombre = %s AND stock >= %s", (item['cantidad'], item['title'], item['cantidad']))
        db.commit()
        cursor.close()
        db.close()
        return '200 OK', [('Content-Type', 'application/json')], json.dumps({"success": True})
    except Exception as e:
        return '500 ERROR', [('Content-Type', 'application/json')], json.dumps({"error": str(e)})

# --- FUNCIÓN PRINCIPAL (WSGI) ---

def application(environ, start_response):
    path = environ.get('PATH_INFO', '/')
    method = environ.get('REQUEST_METHOD', 'GET')
    
    status = '200 OK'
    headers = [('Content-Type', 'text/html; charset=utf-8')]
    body = b""

    try:
        # RUTAS API
        if path == '/api/productos' and method == 'GET':
            status, headers, response_text = obtener_productos_db()
            body = response_text.encode('utf-8')

        elif path == '/api/ver_resenas' and method == 'GET':
            status, headers, response_text = obtener_resenas_db()
            body = response_text.encode('utf-8')

        elif path == '/api/resenas' and method == 'POST':
            size = int(environ.get('CONTENT_LENGTH', 0))
            raw_data = environ['wsgi.input'].read(size)
            status, headers, response_text = crear_resena_db(raw_data)
            body = response_text.encode('utf-8')

        elif path == '/api/pagar' and method == 'POST':
            size = int(environ.get('CONTENT_LENGTH', 0))
            raw_data = environ['wsgi.input'].read(size)
            status, headers, response_text = procesar_pago(raw_data)
            body = response_text.encode('utf-8')

        # ARCHIVOS ESTÁTICOS
        else:
            if path == '/': path = '/index.html'
            file_path = os.path.join(BASE_DIR, path.lstrip('/'))
            if os.path.exists(file_path) and os.path.isfile(file_path):
                content_type, _ = mimetypes.guess_type(file_path)
                headers = [('Content-Type', content_type or 'application/octet-stream')]
                with open(file_path, 'rb') as f:
                    body = f.read()
            else:
                status = '404 NOT FOUND'
                body = b'<h1>404 - No encontrado</h1>'
    
    except Exception as e:
        status = '500 INTERNAL SERVER ERROR'
        body = json.dumps({"error": str(e)}).encode('utf-8')
        headers = [('Content-Type', 'application/json')]

    start_response(status, headers)
    return [body]