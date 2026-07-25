//==============================
// CONFIGURACIÓN DEL AVISO
//==============================

const aviso={

titulo:"Cambio de Nombre Comercial",

contenido:`

<p>
Informamos a todos nuestros usuarios, clientes y colaboradores que,
debido a procesos relacionados con el registro de la marca,
nuestra empresa realizará un cambio de nombre comercial.
</p>

<p>
A partir de la fecha indicada,
<strong>Company García Corona</strong>
pasará a denominarse
<strong>Grupo García Corona</strong>.
</p>

<p>
Es importante señalar que este cambio será únicamente de nombre,
por lo que todas nuestras operaciones, servicios, compromisos,
atención y funcionamiento continuarán desarrollándose de la misma
manera que hasta ahora, sin afectar a nuestros clientes ni a los
servicios que ofrecemos.
</p>

<p>
Asimismo, el cambio se verá reflejado únicamente dentro de nuestras
plataformas y sistemas. El dominio actual permanecerá sin modificaciones
durante el proceso de transición.
</p>

<p>
Agradecemos su confianza y comprensión durante esta transición.
Seguiremos trabajando para brindar el mismo servicio y calidad
que nos caracteriza.
</p>

`,

//==============================
// SI NO QUIERES FECHA
// DEJA LAS COMILLAS VACÍAS ""
//==============================

fecha:"La actualización estará disponible a partir o antes del <strong>01 de julio de 2026.</strong>"

};


//==============================
// CARGAR INFORMACIÓN
//==============================

document.title=aviso.titulo;

document.getElementById("titulo").innerHTML=aviso.titulo;

document.getElementById("contenido").innerHTML=aviso.contenido;


//==============================
// MOSTRAR FECHA SOLO SI EXISTE
//==============================

if(aviso.fecha.trim()!=""){

document.getElementById("fecha").innerHTML=aviso.fecha;

document.getElementById("fechaBox").style.display="block";

}else{

document.getElementById("fechaBox").style.display="none";

}