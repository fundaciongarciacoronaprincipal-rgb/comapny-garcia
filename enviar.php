<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Recibir y limpiar datos
    $nombre  = trim(htmlspecialchars($_POST["nombre"]));
    $correo  = trim(htmlspecialchars($_POST["correo"]));
    $mensaje = trim(htmlspecialchars($_POST["mensaje"]));

    // Correo destino (temporal)
    $destino = "companygarciacorona@companygarciacorona.com.mx";

    // Asunto
    $asunto = "Nuevo mensaje desde Compañía García Corona";

    // Contenido del correo
    $contenido = "Has recibido un nuevo mensaje desde el sitio web:\n\n";
    $contenido .= "Nombre: $nombre\n";
    $contenido .= "Correo: $correo\n\n";
    $contenido .= "Mensaje:\n$mensaje\n";

    // Encabezados
    $headers  = "From: Web García Corona <no-reply@garciacorona.com>\r\n";
    $headers .= "Reply-To: $correo\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Enviar correo
    if (mail($destino, $asunto, $contenido, $headers)) {
        echo "<h2>Mensaje enviado correctamente</h2>";
        echo "<p>Gracias por contactarnos. Pronto nos comunicaremos contigo.</p>";
    } else {
        echo "<h2>Error al enviar el mensaje</h2>";
        echo "<p>Inténtalo nuevamente más tarde.</p>";
    }
} else {
    echo "Acceso no permitido.";
}
?>
