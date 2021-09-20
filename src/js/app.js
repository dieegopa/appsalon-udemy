let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}


document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
    
    
});


function iniciarApp(){
    mostrarServicios();
    
    //resalta el tab actual
    mostrarSeccion();    
    
    //oculta o muestra la seccion segun el tab
    cambiarSeccion();
    
    //paginacion
    paginaSiguiente();
    paginaAnterior();
    
    //comprueba la pagina actual para ocultar o mostra la paginacion
    botonesPaginador();
    
    //Muestra el resumen de la cita o mensaje de error
    mostrarResumen();
    
    
    //Almacena el nombre
    nombreCita();
    
    //almacena la fecha de la cita
    fechaCita();
    
    //deshabilita dias pasados
    deshabilitarFechaAnterior();


    //almacena la hora de la cita
    horaCita();
}


function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', ()=>{
        pagina++;
        
        botonesPaginador();
        
    });
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=>{
        pagina--;
        
         botonesPaginador();
    });
}


function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');
    
    if(pagina === 1 ){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(pagina ==3 ){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    
    mostrarSeccion();
}

function mostrarSeccion(){
    
    //eliminar la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    
    
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
    
    //eliminar la clase de actual en el tab anterior y agregar en el actual
    const tabAnterior = document.querySelector('.tabs button.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    
    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
    
}

function cambiarSeccion(){
    
    const enlaces = document.querySelectorAll('.tabs button');
    
    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e=> {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);    
            
            mostrarSeccion();
            botonesPaginador();
            
        })
    })
    
}

async function mostrarServicios(){
    try{
      
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();       
        const {servicios} = db;
        
        //Generar el HTML
        
        servicios.forEach(servicio=> {
            const {id,nombre,precio} = servicio;
            
            //DOM Scripting
            //Generar nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            
            //Generar el contenedor del servicio
            
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;
            
            
            //selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;
            
            //inyectar precio y nombre al div de servicio
            
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            
            
            document.querySelector("#servicios").appendChild(servicioDiv);
            
        });
            
    }catch(error){
        console.log(error);
    }
}

function seleccionarServicio(e){
   //forzar el elemento al cual le damos click sea el div
    
    let elemento;
    
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }
    
    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');
        
        const id = parseInt(elemento.dataset.idServicio);
        
        
        eliminarServicio(id);
        
    } else {
        elemento.classList.add('seleccionado');
        
        servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        
        //console.log(servicioObj);
        
        agregarServicio(servicioObj);
    }
    
    
}


function mostrarResumen(){
    //destructuring
    const {nombre,fecha,hora,servicios} = cita;
    
    const resumenDiv = document.querySelector('.contenido-resumen');
    
    //limpia el html previo

    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
    
    //validacion de objeto
    
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, nombre, hora y fecha';
        
        noServicios.classList.add('invalidar-cita');
        
        resumenDiv.appendChild(noServicios);

        return;
    } 
    
    //agregar a resumenDiv

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Fecha: </span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);


    let cantidad = 0;

    //iterar sobre el arreglo de servicios
    servicios.forEach( servicio =>{

        const {nombre,precio} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split("$");

        cantidad += parseInt(totalServicio[1].trim());

        //console.log(textoServicio);
        //colocar texto de servicio y precio en el div

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    //console.log(cantidad);

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    
    cantidadPagar.innerHTML = `<span>Total a pagar: </span> $ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);

    //console.log(nombreCita);
    
}

function eliminarServicio(id){
    
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    
    //console.log(cita);
}

function agregarServicio(servicioObj){
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj];
    
    //console.log(cita);
    
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();
        
        //validacion de que nombre debe tener algo
        
        if(nombreTexto === '' || nombreTexto.length < 3){
            //console.log('nombre no valido');
            
            mostrarAlerta('Nombre No Valido','error');
            
        } else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }

            cita.nombre = nombreTexto;
            
            //console.log(cita);
        }
        
       //console.log(e.target.value);
    });
}

function mostrarAlerta(mensaje,tipo){
    //console.log(mensaje);
    
    //si hay una alerta previa entonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }
    
    
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    
    if(tipo === 'error'){
        alerta.classList.add('error');
        //console.log(alerta);
    }
    
    
    //insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);
    
    
    //eliminar alerta despues de 3 segundos
    setTimeout(()=>{
        alerta.remove();
    },3000);
}


function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
       //console.log(e.target.value);
        
        const dia = new Date(e.target.value).getUTCDay();
        
        if([0,6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no validos','error');
            //console.log('Domingo');
        } else{
            cita.fecha = fechaInput.value;
            //console.log(cita);
        }
        //console.log(dia);
    });
}

function deshabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');
    
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const month  = ("0" + (fechaAhora.getMonth() + 1)).slice(-2)
    const day = fechaAhora.getDate()+1;

    //formato deseado AAAA-MM-DD

    const fechaDeshabilitar = `${year}-${month}-${day}`;
    
    inputFecha.min = fechaDeshabilitar;
    //console.log(fechaDeshabilitar);
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    hora.addEventListener('input', e=> {

        const horaCita = e.target.value;

        const hora = horaCita.split(':');

        if(hora[0]<10  || hora[0] > 18){
            mostrarAlerta('Hora no Valida','error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
            
        } else{
            cita.hora = horaCita;
        }

        console.log(cita);
    });
}