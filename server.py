import http.server
import socketserver
import os
import mimetypes
import mysql.connector
import json # Necesario para enviar los datos

PORT = 8000

def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="ds00videojueg0-", # Tu contraseña de MySQL
        database="neko_mori"
    )

class MyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        print("conectadooooo")
        # RUTA PARA LA BASE DE DATOS
        if self.path == '/api/productos':
            self.obtener_productos_db()
            return

        # RUTA PARA ARCHIVOS ESTÁTICOS (HTML, CSS, JS, IMÁGENES)
        if self.path == '/': self.path = '/index.html'
        file_path = self.path.lstrip('/')
        
        if os.path.exists(file_path) and os.path.isfile(file_path):
            self.send_response(200)
            content_type, _ = mimetypes.guess_type(file_path)
            self.send_header('Content-type', content_type or 'application/octet-stream')
            self.end_headers()
            with open(file_path, 'rb') as file:
                self.wfile.write(file.read())
        else:
            self.send_response(404)
            self.end_headers()

    def obtener_productos_db(self):
        try:
            db = conectar_db()
            cursor = db.cursor(dictionary=True) # Devuelve los datos como diccionario
            cursor.execute("SELECT * FROM productos")
            lista_productos = cursor.fetchall()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*') # Evita bloqueos de seguridad
            self.end_headers()
            
            # Convertimos la lista de Python a JSON
            self.wfile.write(json.dumps(lista_productos).encode('utf-8'))
            
            cursor.close()
            db.close()
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Servidor en http://localhost:{PORT}")
    httpd.serve_forever()

def conectar_db():
    print("Intentando conectar a MySQL...") # <-- Verás esto en la terminal
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="neko_mori",
            connect_timeout=5 # Solo espera 5 segundos
        )
        print("¡Conexión establecida con éxito!")
        return conn
    except mysql.connector.Error as err:
        print(f"Error específico de MySQL: {err}")
    except Exception as e:
        print(f"Otro error: {e}")
    return None

if __name__ == "__main__":
    # AQUÍ se ejecuta para verificar la conexión nada más empezar
    db_prueba = conectar_db()
    if db_prueba and db_prueba.is_connected():
        print(" Conexión inicial exitosa.")
        db_prueba.close() # Cerramos la prueba para no dejar conexiones abiertas
    else:
        print(" No se pudo iniciar la conexión a la base de datos.")

    # Luego inicia el servidor normalmente
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        print(f"Servidor activo en http://localhost:{PORT}")
        httpd.serve_forever()