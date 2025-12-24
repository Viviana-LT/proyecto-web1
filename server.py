import http.server
import socketserver
import os
import mimetypes

PORT = 8000

class MyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # 1. Si entras a la raíz, redirigir a index.html
        if self.path == '/':
            self.path = '/index.html'
        
        # 2. Construir la ruta al archivo
        # Eliminamos el primer '/' para que busque en la carpeta actual
        file_path = self.path.lstrip('/')
        
        # 3. Verificar si el archivo solicitado existe
        if os.path.exists(file_path) and os.path.isfile(file_path):
            self.send_response(200)
            
            # 4. Detectar el tipo de contenido automáticamente (HTML, CSS, JS, PNG, JPG, TTF)
            content_type, _ = mimetypes.guess_type(file_path)
            if content_type:
                self.send_header('Content-type', content_type)
            
            self.end_headers()

            # 5. Abrir el archivo en modo binario ('rb') y enviarlo
            # Esto es vital para las imágenes de tu carpeta 'recurs'
            with open(file_path, 'rb') as file:
                self.wfile.write(file.read())
        else:
            # Error 404
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Error 404: No encontramos ese archivo en proyecto-web1")

# Iniciar servidor
with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Servidor funcionando en: http://localhost:{PORT}")
    httpd.serve_forever()