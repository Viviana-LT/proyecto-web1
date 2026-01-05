<?php
$host = "nozomi.proxy.rlwy.net";
$port = 26942;
$user = "root";
$pass = "LHAMqWcysVYvNpwQMQauzzproaOPXseT";  
$db   = "railway";
$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
echo "Conectado a Railway";
?>
