import http.server
import socketserver
import os
import mimetypes
import mysql.connector
import json
from decimal import Decimal

mimetypes.add_type('font/ttf', '.ttf')

PORT = 8000

# 1. DEFINICIÓN DE LA CONEXIÓN
def conectar_db():
    print("Intentando conectar a MySQL...") 
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="ds00videojueg0-",
            database="neko_mori",
            connect_timeout=5
        )
        print("¡Conexión establecida con éxito!")
        return conn
    except mysql.connector.Error as err:
        print(f"Error específico de MySQL: {err}")
    except Exception as e:
        print(f"Otro error: {e}")
    return None

# 2. CLASE MANEJADORA (HANDLER)
class MyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        print(f"GET Request recibido: {self.path}")
        
        # IMPORTANTE: Verificar rutas API PRIMERO
        if self.path.startswith('/api/'):
            if self.path == '/api/productos':
                print("Ruta /api/productos detectada")
                self.obtener_productos_db()
                return
            else:
                print(f"Ruta API no encontrada: {self.path}")
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "API endpoint not found"}).encode())
                return

        # RUTA PARA ARCHIVOS ESTÁTICOS
        if self.path == '/': 
            self.path = '/index.html'
        
        file_path = self.path.lstrip('/')
        
        
        if os.path.exists(file_path) and os.path.isfile(file_path):
            self.send_response(200)
            content_type, _ = mimetypes.guess_type(file_path)
            self.send_header('Content-type', content_type or 'application/octet-stream')
            self.end_headers()
            with open(file_path, 'rb') as file:
                self.wfile.write(file.read())
        else:
            print(f"Archivo no encontrado: {file_path}")
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>404 - Archivo no encontrado</h1>')

    def do_POST(self):
        # RUTA PARA PROCESAR PAGOS
        if self.path == '/api/pagar':
            self.procesar_pago()
            return
        
        self.send_response(404)
        self.end_headers()

    def obtener_productos_db(self):
        print("=== Ejecutando obtener_productos_db ===")
        try:
            db = conectar_db()
            if db is None:
                raise Exception("No se pudo conectar a la base de datos")
                
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM productos")
            lista_productos = cursor.fetchall()
            
            print(f"Productos obtenidos de la BD: {len(lista_productos)}")
            
            # Convertir Decimal a float para que sea serializable en JSON
            for producto in lista_productos:
                for key, value in producto.items():
                    if isinstance(value, Decimal):
                        producto[key] = float(value)
            
            print(f"Productos después de conversión: {lista_productos}")
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            json_response = json.dumps(lista_productos, ensure_ascii=False)
            self.wfile.write(json_response.encode('utf-8'))
            
            cursor.close()
            db.close()
            print("=== Respuesta enviada exitosamente ===")
        except Exception as e:
            print(f"Error en obtener_productos_db: {e}")
            import traceback
            traceback.print_exc()
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    def procesar_pago(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            productos_comprados = json.loads(post_data)
            
            db = conectar_db()
            if db is None:
                raise Exception("No se pudo conectar a la base de datos")
            
            cursor = db.cursor()
            
            for item in productos_comprados:
                # Actualizar stock
                cursor.execute(
                    "UPDATE productos SET stock = stock - %s WHERE nombre = %s AND stock >= %s",
                    (item['cantidad'], item['title'], item['cantidad'])
                )
            
            db.commit()
            cursor.close()
            db.close()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
            
        except Exception as e:
            print(f"Error en procesar_pago: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

# 3. BLOQUE DE ARRANQUE (MAIN)
if __name__ == "__main__":
    print("--- Iniciando Sistema Neko no Mori ---")
    
    # Verificamos conexión antes de abrir el puerto
    prueba = conectar_db()
    if prueba:
        prueba.close()
        print("Todo listo para recibir peticiones.")
    else:
        print("Advertencia: El servidor iniciará pero las consultas a la DB fallarán.")

    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        print(f"Servidor funcionando en: http://localhost:{PORT}")
        httpd.serve_forever()