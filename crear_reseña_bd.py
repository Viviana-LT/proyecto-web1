def crear_resena_db(raw_data):
    conexion = None
    cursor = None
    try:
        # Decodificar el JSON que viene del JS
        data = json.loads(raw_data)
        
        conexion = conectar_db()
        if not conexion:
            return '500 Error', [('Content-Type', 'application/json')], json.dumps({"error": "No hay conexión a DB"})
            
        cursor = conexion.cursor()
        
        query = """
        INSERT INTO resenas (nombre_usuario, titulo, calificacion, contenido)
        VALUES (%s, %s, %s, %s)
        """
        valores = (
            data["nombre_usuario"],
            data["titulo"],
            data["calificacion"],
            data["contenido"]
        )
        
        cursor.execute(query, valores)
        conexion.commit()
        
        # Devolvemos éxito al JS
        return '200 OK', [('Content-Type', 'application/json')], json.dumps({"mensaje": "¡Reseña guardada con éxito!"})
    
    except Exception as e:
        return '500 Error', [('Content-Type', 'application/json')], json.dumps({"error": str(e)})
    finally:
        if cursor: cursor.close()
        if conexion: conexion.close()