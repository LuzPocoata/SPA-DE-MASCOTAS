// LUZ DANIELA POCOATA QUISPE 
// PROYECTO - SPA DE MASCOTAS
let estaLogueado = false;
let usuarioActual = '';
let duenos = []; // Almacena objetos (nombre, telefono, correo) del dueño de la mascota
let mascotas = []; // Almacena objetos (nombre, especie, raza) de la mascotita
let citas = []; // Almacena objetos (fecha, hora, mascota, servicio)
let carrito = []; // Almacena objetos (id, nombre, precio, cantidad)
// Productos Fijos para la Tienda
//Desde aqui podemos aumentar mas cosas para el carrito sin necesidad de crear varias secciones o div en html, es un camino mas directo
const productosCatalogo = [
    { id: 1, nombre: 'Baño Completo', precio: 25.00, imagen: 'imagenes/Baño-Ducha.jpg' }, 
    { id: 2, nombre: 'Corte de Pelo', precio: 30.00, imagen: 'imagenes/corte de pelo.jpg' }, 
    { id: 3, nombre: 'Juguete para Mascota', precio: 15.50, imagen: 'imagenes/juguetes.jpg' }, 
    { id: 4, nombre: 'Comida Premium (Kg)', precio: 40.00, imagen: 'imagenes/comida.jpg' }, 
    { id: 5, nombre: 'Cepillo para Pelo', precio: 12.00, imagen: 'imagenes/cepillo de pelo.jpg' }, 
    { id: 6, nombre: 'Collar Elegante', precio: 20.00, imagen: 'imagenes/collar.jpg' },
    { id: 7, nombre: 'Ropa', precio: 10.50, imagen: 'imagenes/Ropa.jpg' },
    { id: 8, nombre: 'Limpieza', precio: 20.50, imagen: 'imagenes/limpieza.jpg' }
];

const seccionLogin = document.getElementById('seccion-login');
const seccionRegistro = document.getElementById('seccion-registro');
const seccionAgenda = document.getElementById('seccion-agenda');
const seccionTienda = document.getElementById('seccion-tienda');
const enlacesNav = document.getElementById('enlaces-nav');
const seccionUsuario = document.getElementById('seccion-usuario');
const campoContrasena = document.getElementById('campo-contrasena');
const alternarContrasena = document.getElementById('alternar-contrasena');

// Puse expresiones regulares para el uso de nombres (Usuario y mascota), contraseña, telefono y correo
const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const regexTelefono = /^(6|7)[0-9]{7,12}$/;    // (6|7) para que solo acepte numero telefonico que comienzan con aguno de esos
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Para la contraseña que se pueda mostrar y ocultar
function alternarVisibilidadContrasena() {
    if (campoContrasena.type === 'password') {
        campoContrasena.type = 'text';
        alternarContrasena.textContent = '👁️‍🗨️';
    } else {
        campoContrasena.type = 'password';
        alternarContrasena.textContent = '👁️'; 
    }
}

// Oculta todos los módulos y muestra el seleccionado
function mostrarModulo(idModulo) {
    if (!estaLogueado && idModulo !== 'seccion-login') {
        alert('Debes iniciar sesión primero.');
        return;
    }
    const modulos = document.getElementsByClassName('modulo');
    for (let i = 0; i < modulos.length; i++) {
        modulos[i].classList.remove('activo');
    }
    document.getElementById(idModulo).classList.add('activo');
}

// Actualiza el Modulo del sector de mascotas (si registramos a nuestras mascotas esta parte nos dara a elegir a cual de todas)
function actualizarSelectorMascotas() {
    const selector = document.getElementById('mascota-cita');
    let opcionesHTML = '<option value="">Selecciona una mascota</option>';
    
    for (let i = 0; i < mascotas.length; i++) {
        const mascota = mascotas[i];
        opcionesHTML += '<option value="' + mascota.nombre + '">' + mascota.nombre + ' (' + mascota.especie + ')</option>';
    }
    selector.innerHTML = opcionesHTML;
}

// este es el inicio para el Modulo de Inicio Sesion
function iniciarSesion(usuario) {
    estaLogueado = true;
    usuarioActual = usuario;
    actualizarInterfazDespuesLogin();
    mostrarModulo('seccion-registro'); // Muestra inmediatamente el suiguiente Modulo (Registro de dueño y mascota)
}
// funcion para el cerrado de sesion, Limpia automaticamente todo lo ingresado y leugo te vuelve a mandar al login (Inicio de sesion)
function cerrarSesion() {
    estaLogueado = false;
    usuarioActual = '';
    duenos = [];
    mascotas = [];
    citas = [];
    carrito = [];
    actualizarInterfazDespuesLogout();
    mostrarModulo('seccion-login');
}
// Con esta funcion vinculamos el menu (navegacion de la pagina), y creamos seccion de usuarios
function actualizarInterfazDespuesLogin() {
    seccionLogin.classList.remove('activo');
    enlacesNav.innerHTML =         // de esta forma se vincula mas facil sin usar mucho el llamado de las id
        '<button class="boton-nav" onclick="mostrarModulo(\'seccion-registro\')">' +
        '➕ Registro' +
        '</button>' +
        '<button class="boton-nav" onclick="mostrarModulo(\'seccion-agenda\')">' +
        '📅 Agenda' +
        '</button>' +
        '<button class="boton-nav" onclick="mostrarModulo(\'seccion-tienda\')">' +
        '🛒 Tienda' +
        '</button>';
    seccionUsuario.innerHTML = 
        '<span>Usuario: <strong>' + usuarioActual + '</strong></span>' +
        '<button class="boton-cerrar-sesion" onclick="cerrarSesion()">' +
        '➡️ Cerrar Sesión' +
        '</button>';
    document.getElementById('formulario-login').reset();
    document.getElementById('lista-de-duenos').innerHTML = '';
    document.getElementById('lista-de-mascotas').innerHTML = '';
    document.getElementById('cuerpo-tabla-citas').innerHTML = '';
    // En esta parte hace que el Catalogo del carrito este preparado para que se ejecute 
    cargarProductosCatalogo();
    actualizarCarrito();
    actualizarSelectorMascotas();
}
// con esta funcion hacemos que en pantalla por el momento solo aparezca la seccion de Inicio de Sesion
function actualizarInterfazDespuesLogout() {
    seccionLogin.classList.add('activo');
    seccionRegistro.classList.remove('activo');
    seccionAgenda.classList.remove('activo');
    seccionTienda.classList.remove('activo');
    enlacesNav.innerHTML = '';
    seccionUsuario.innerHTML = '';
    // Limpia el catálogo de la vista
    document.getElementById('rejilla-productos').innerHTML = '';
}

// --- MODULO 1: REGISTRO DEL DUEÑO Y DE LA MASCOTA ---
// Registro del Dueño
function registrarDueno() {
    const nombre = document.getElementById('nombre-dueno').value.trim();   // el trim es para que no tome en cuenta los espacios de mas 
    const telefono = document.getElementById('telefono-dueno').value.trim();
    const correo = document.getElementById('correo-dueno').value.trim();
    const formularioDueno = document.getElementById('formulario-dueno');
    // Aqui entran las expresiones regulares que se vio arriba 
    if (!regexNombre.test(nombre)) {
        alert('Error: El nombre debe contener solo letras y espacios.');
        return false;
    }
    if (!regexTelefono.test(telefono)) {
        alert('Error: El teléfono debe ser numérico y tener entre 7 y 12 dígitos.');
        return false;
    }
    if (!regexCorreo.test(correo)) {
        alert('Error: El formato de correo electrónico no es válido.');
        return false;
    }
    // Registra en un vector al dueño
    duenos.push({ nombre: nombre, telefono: '+591 ' + telefono, correo: correo });
    const listaDueno = document.getElementById('lista-de-duenos');   // se guardan los datos del dueño, en caso de que sean mas dueños se forma como una lista con sus respectivos datos 
    listaDueno.innerHTML += '<li>' + nombre + ' - ' + telefono + ' - ' + correo + '</li>';
    // luego de meter los datos del dueño y pulsar en guardar se limpia el formulario automaticamente
    formularioDueno.reset();
    alert('Dueño registrado exitosamente');
    return true;
}
// Registro de la mascota
function registrarMascota() {
    const nombre = document.getElementById('nombre-mascota').value.trim();
    const especie = document.getElementById('especie-mascota').value;
    const raza = document.getElementById('raza-mascota').value.trim();
    const formularioMascota = document.getElementById('formulario-mascota');
    if (!regexNombre.test(nombre)) {  //Validacion de los datos
        alert('Error: El nombre de la mascota debe contener solo letras y espacios.');
        return false;
    }
    if (especie === '') {
        alert('Error: Por favor, selecciona una especie.');
        return false;
    }
    if (!regexNombre.test(raza)) {
        alert('Error: La raza debe contener solo letras y espacios.');
        return false;
    }
    //Se Registra a la mascota en un vector [nombre, especie, raza]
    mascotas.push({ nombre: nombre, especie: especie, raza: raza });
    const listaMascotas = document.getElementById('lista-de-mascotas');
    listaMascotas.innerHTML += '<li>' + nombre + ' - ' + especie + ' - ' + raza + '</li>';  // si hay mas de una mascota mostrara como una lista y sus respectivas especificaciones 
    actualizarSelectorMascotas();   //Actualiza en el modulo de Agenta de cuantas mascotas son
    formularioMascota.reset();
    alert('Mascota registrada exitosamente');
    return true;
}

// --- MODULO 2: AGENDA DE SERVICIOS ---
function agendarCita() {
    const fecha = document.getElementById('fecha-cita').value;
    const hora = document.getElementById('hora-cita').value;
    const mascota = document.getElementById('mascota-cita').value;
    const servicio = document.getElementById('servicio-cita').value;
    const formularioCita = document.getElementById('formulario-cita');
    if (fecha && hora && mascota && servicio) {
        // guarada en un vector que opciones pusiste 
        citas.push({ fecha: fecha, hora: hora, mascota: mascota, servicio: servicio });
        const cuerpoTabla = document.getElementById('cuerpo-tabla-citas');
        cuerpoTabla.innerHTML +=      // estas son las secciones que hay, esta en forma de tabla
            '<tr>' +
            '<td>' + fecha + '</td>' +
            '<td>' + hora + '</td>' +
            '<td>' + mascota + '</td>' +
            '<td>' + servicio + '</td>' +
            '</tr>';
        // se guarda y se limpia el formulario
        formularioCita.reset();
        alert('Servicio agendado exitosamente');
        return true;
    }
    alert('Por favor, completa todos los campos para agendar el servicio.');
    return false;
}

// --- MODULO 3: CARRITO DE COMPRAS ---
function cargarProductosCatalogo() {
    const contenedorProductos = document.getElementById('rejilla-productos');
    let htmlProductos = ''; 
    for (let i = 0; i < productosCatalogo.length; i++) {
        const producto = productosCatalogo[i];
        htmlProductos +=     // Aqui muestra como es el estilo de la parte de catalogo para el carrito 
            '<div class="tarjeta-producto">' +
            '<div class="imagen-producto">' +
            '<img src="' + producto.imagen + '" alt="Imagen de ' + producto.nombre + '">' + 
            '</div>' +
            '<div class="nombre-producto">' + producto.nombre + '</div>' +
            '<div class="precio-producto">Bs. ' + producto.precio.toFixed(2) + '</div>' +
            '<button class="boton-comprar" onclick="agregarAlCarrito(' + producto.id + ')">' +
            '🛍️ Comprar' +
            '</button>' +
            '</div>';
    }
    contenedorProductos.innerHTML = htmlProductos;
}
//esta funcion nos permitira ver lo que añadimos al carrito 
function agregarAlCarrito(idProducto) {
    const producto = productosCatalogo.find(p => p.id === idProducto);
    if (!producto) return;
    let itemCarrito = carrito.find(item => item.id === idProducto);
    if (itemCarrito) {
        itemCarrito.cantidad += 1;
    } else {
        carrito.push({ 
            id: producto.id, 
            nombre: producto.nombre, 
            precio: producto.precio, 
            cantidad: 1 
        });
    }
    alert('Producto añadido al carrito: ' + producto.nombre);  // nos avisara de cada producto que metamos al carrito
    actualizarCarrito();
}
// con esta funcion podremos quitar los productos que metimos al carrito (si por una equivocacion o por buscar lo economico no queremos un producto entonces se puede sacar)
function eliminarDelCarrito(idProducto) {
    const longitudInicial = carrito.length;
    carrito = carrito.filter(item => item.id !== idProducto);
    if (carrito.length < longitudInicial) {
        alert('Producto eliminado del carrito.');  // e avisa que eliminaste algun producto de tu carrito
    }
    actualizarCarrito();
}
function actualizarCarrito() {     // cada que metas un producto se ira actualizando y mostrando la cantidad subtotal y total
    const contenedorCarrito = document.getElementById('items-carrito');
    const subtotalSpan = document.getElementById('subtotal');
    const totalSpan = document.getElementById('total');
    let subtotal = 0;
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
    } else {
        let htmlCarrito = '';
        for (let i = 0; i < carrito.length; i++) {
            const item = carrito[i];
            const totalItem = item.precio * item.cantidad;
            subtotal += totalItem;
            htmlCarrito += 
                '<div class="item-carrito">' +
                '<div class="nombre-item">' + item.nombre + ' (x' + item.cantidad + ')</div>' +
                '<div class="precio-item">Bs. ' + totalItem.toFixed(2) + '</div>' +
                '<button class="boton-eliminar" onclick="eliminarDelCarrito(' + item.id + ')">🗑️</button>' +
                '</div>';
        }
        contenedorCarrito.innerHTML = htmlCarrito;
    }
    // se muestra los precios del subtotal y total
    subtotalSpan.textContent = 'Bs. ' + subtotal.toFixed(2);
    totalSpan.textContent = 'Bs. ' + subtotal.toFixed(2);
}
// esta funcion pertenece l carrito, si esta vacio te dara un mensaje de que esta vacio
function finalizarCompra() {
    if (carrito.length === 0) {
        alert('El carrito está vacío. Agrega productos para finalizar la compra.');
        return;
    }
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].precio * carrito[i].cantidad;
    }
    // si esta con productos te muetra el siguiente mensaje con el precio
    alert('🎉 ¡Compra realizada exitosamente!\nTotal: Bs. ' + total.toFixed(2) + '\n¡Gracias por tu compra!');
    // Limpia automaticamente el carrito después de la compra
    carrito = [];
    actualizarCarrito();
}
// Esta es una configurcion que aparecera al principio es decir en el Login
function configurarEventos() {
    const formularioLogin = document.getElementById('formulario-login');
    formularioLogin.onsubmit = function() {
        const usuario = document.getElementById('campo-usuario').value.trim();
        const contrasena = document.getElementById('campo-contrasena').value;
        // Valida el usuario y la contraseña
        if (!regexNombre.test(usuario)) {
             alert('Error: El usuario debe contener solo letras y espacios.');
             return false;
        }
        if (!regexContrasena.test(contrasena)) {
            alert('Error: La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial.');
            return false;
        }
        if (usuario && contrasena) {
            iniciarSesion(usuario);
        } else {
            alert('Por favor, ingresa usuario y contraseña.');
        }
        return false;
    };
    // estas son por seguridad de alguno resulte erroneo
    alternarContrasena.onclick = alternarVisibilidadContrasena;
    document.getElementById('formulario-dueno').onsubmit = function() {
        return !registrarDueno() ? false : false; // Llama a la función y previene el envío
    };
    document.getElementById('formulario-mascota').onsubmit = function() {
        return !registrarMascota() ? false : false;
    };
    document.getElementById('formulario-cita').onsubmit = function() {
        return !agendarCita() ? false : false;
    };
    document.getElementById('boton-finalizar').onclick = finalizarCompra;
}
// Función principal que se ejecuta al cargar el contenido del DOM
function iniciarAplicacion() {
    configurarEventos();
}
// El código se ejecuta una vez que todo el DOM está cargado
document.addEventListener('DOMContentLoaded', iniciarAplicacion);