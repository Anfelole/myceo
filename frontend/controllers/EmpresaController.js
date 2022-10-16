/* Author:  Andres Felipe Lopez Leon - Mision Tic 2022 */

//metodo que se llama al cargar la pagina document.ready()
$(document).ready(() => {

/* ---------------------------------------------------GET------------------------------------------------------------------------------- */

    //metodo para hacer una peticion GET a nuestro backend
    const getEmpresa = () => {
        //Ajax = metodo para hacer peticiones a la API
        $.ajax({
            url: 'http://localhost:9011/empresa',
            type: 'GET',
            dataType: 'json',
            success: function (res) {

                let data = ''; //variable para guardar los datos de la respuesta 

                //bucle para guardar todas las respuestas en la variable data
                res.forEach(element => {
                    data += `
                 <tr empresaId = ${element.idEmpresa}>
                 <td>${element.idEmpresa}</td>
                 <td>${element.tipoEmpresa}</td>
                 <td>${element.nitEmpresa}</td>
                 <td>${element.ciudadEmpresa}</td>
                 <td>${element.telefonoEmpresa}</td>
                 <td>${element.emailEmpresa}</td>
                <td>
                    <button id="btn-detalles"class="btn btn-warning">Detalles</button>
                </td>
                <td>
                <button id="btn-eliminar"class="btn btn-danger">Eliminar</button>
                </td>
                <td>
                <button id="btn-editar"class="btn btn-primary">Editar</button>
                </td>
                 </tr>
               `
                });

                //insertar los datos en el Tbody
                $('#tbody').html(data);
            }
        })
    }



    /* ---------------------------------------------------POST------------------------------------------------------------------------------- */



    //metodo para hacer una peticion POST a nuestro backend
    const postEmpresa = () => {
        //definir una funcion click al boton con id="agregar"

        $('#btn-agregar').on('click', function () { //escuchar boton agregar general
            limpiarFormulario(); //limpia el formulario
            $('#empresaDiv').show();  //muestra el formulario
            $('#editar').hide();  //esconde el boton editar del formulario
            $('#agregar').show(); // muestra el boton agregar del formulario
        })
        
        $('#agregar').on('click', function () {
            //obtengo los valores que estan escritos en el formulario y los guardo en el objeto datosEmpresa.
            const datosEmpresas = {
                tipoEmpresa: $('#tipo').val(),
                nitEmpresa: $('#nit').val(),
                ciudadEmpresa: $('#ciudad').val(),
                telefonoEmpresa: $('#telefono').val(),
                emailEmpresa: $('#email').val()
            }

            //Ajax = metodo para hacer peticiones a la API
            $.ajax({
                url: 'http://localhost:9011/empresa',
                contentType: 'application/json',  //indicamos el tipo de contenido a mandar json
                type: 'POST', 
                data: JSON.stringify(datosEmpresas), //se debe convertir el objeto empresa a tipo JSON y se manda
                dataType: 'json',
                success: (data) => {  // este campo nos indica que la peticion fue realizada y sirve para ejecutar metodos
                    $('#mensajes').html('Empresa registrada').css('display', 'block') //muestro mensaje de confirmacion
                    getEmpresa(); //llamo al metodo get paraactualizar las empresas
                    limpiarFormulario(); //vacio los campos del formulario
                    $('#empresaDiv').hide(); //cierro el formulario
                    $('#btn-agregar').show(); //muestro el boton agregar
                }
            })
        })
    }


/* ---------------------------------------------------GET/id------------------------------------------------------------------------------- */



    //metodo para hacer una peticion GET/id a nuestro backend
    const getEmpresaId = () => {
        $(document).on('click', '#btn-detalles', function () { //capturamos el evento click del boton detalles y ejecutamos una funcion

            let btnDetalles = $(this)[0].parentElement.parentElement //entramos a los atributos del boton que estamos pulsando con this y
            let id = $(btnDetalles).attr('empresaId');               // nos traemos el atribito empresaId y lo guardamos en una variable "id"


            //Ajax = metodo para hacer peticiones a la API
            $.ajax({
                url: 'http://localhost:9011/empresa/' + id, //mandamos el id
                type: 'GET',
                dataType: 'json',
                success: (res) => {

                    //creo una variable data para guardar los datos que traigo desde el backend
                    let data = ` 
                    <strong>Tipo:</strong>  ${res.idEmpresa} <br> 
                    <strong>Nit:</strong> ${res.nitEmpresa} <br> 
                    <strong>Ciudad:</strong>  ${res.ciudadEmpresa} <br> 
                    <strong>Telefono:</strong>  ${res.telefonoEmpresa} <br> 
                    <strong>Email:</strong>  ${res.emailEmpresa} <br><br>
                    <button id="btn-limpiar" class="btn btn-warning">Limpiar</button><br><br>
                    `

                    let empresa = $('#empresa-detalles').html(data); //inserto los datos en el html en la seccion de detalles

                    $('#btn-limpiar').on('click', () => { //quito los datos de la pantalla
                        empresa.html('');
                    })
                }
            })
        })
    }


/* ---------------------------------------------------DELETE------------------------------------------------------------------------------- */


    //metodo para hacer una peticion DELETE a nuestro backend
    const deleteEmpresa = () => {
        //evento para escuchar el click del boton eliminar
        $(document).on('click', '#btn-eliminar', function () {

            if (confirm('¿Deseas eliminar la empresa?')) { //mando un mensaje de confirmacion al usuario

                let btnEliminar = $(this)[0].parentElement.parentElement; //entramos a los atributos del boton que estamos pulsando con this y
                let id = $(btnEliminar).attr('empresaId');               // nos traemos el atributo empresaId y lo guardamos en una variable "id"


                //Ajax = metodo para hacer peticiones a la API
                $.ajax({
                    url: 'http://localhost:9011/empresa/' + id,  //mandamos el id
                    type: 'DELETE',
                    dataType: 'json',
                    success: (res) => {
                        $('#mensajes').html('Empresa eliminada').css('display', 'block'); //en la seccion de mensajes mostramos el mensaje
                        getEmpresa();   //actualizamos las empresas
                    }
                })
            }



        })
    }


 /* ---------------------------------------------------PUT------------------------------------------------------------------------------- */


    ///metodo para actualizar nuestras empresas SE DEBE HACER EN DOS PASOS

    //PASO 1 - Se deben mostrar los campos de la empresa que vallamos a actualizar en nuestro formulario
    //PASO 2 - Se debe hacer la peticion PUT a nuestro servidor


    //PASO 1 - Metodo para mostrar los datos de nuestra empresa en el formulario
    const rellenarFormulario = () => {
        //evento para escuchar el click del boton editar
        $(document).on('click', '#btn-editar', function () {

            let btnEditar = $(this)[0].parentElement.parentElement; //entramos a los atributos del boton que estamos pulsando con this y
            let id = $(btnEditar).attr('empresaId');               // nos traemos el atributo empresaId y lo guardamos en una variable "id"

            $('#agregar').hide();  // ocultamos el boton agregar del formulario
            $('#empresaDiv').show(); //mostramos el formulario
            $('#editar').show(); //mostramos el boton editar


            //Ajax = metodo para hacer peticiones a la API - pedimos los datos de la empresa que vamos a editar desde el servidor
            $.ajax({
                url: 'http://localhost:9011/empresa/' + id,  //mandamos el id
                type: 'GET',
                dataType: 'json',
                success: (res) => {
                    //metemos los datos en el formulario
                    $('#id').val(res.idEmpresa);
                    $('#tipo').val(res.tipoEmpresa);
                    $('#nit').val(res.nitEmpresa);
                    $('#ciudad').val(res.ciudadEmpresa);
                    $('#telefono').val(res.telefonoEmpresa);
                    $('#email').val(res.emailEmpresa);
                }
            })

        })
    }


    //PASO 2 - metodo para hacer una peticion PUT a nuestro backend
    const putEmpresa = () => {
        //escuchamos el click del boton editar delformulario
        $('#editar').on('click', function () {
          
            $('#agregar').hide();  //ocultamos el boton agregar
            $('#editar').show();   //mostramos el boton editar

            let id = $('#id').val(); //obtenemos el id desde el formulario

            //creo un objeto empresa y le doy los datos que tengo en mi formulario
            const datosEmpresas = {
                tipoEmpresa: $('#tipo').val(),
                nitEmpresa: $('#nit').val(),
                ciudadEmpresa: $('#ciudad').val(),
                telefonoEmpresa: $('#telefono').val(),
                emailEmpresa: $('#email').val()
            }

            //Ajax = metodo para hacer peticiones a la API
            $.ajax({
                url: 'http://localhost:9011/empresa/' + id, //mandamos el id
                contentType: 'application/json', //indicamos el tipo de contenido a mandar
                type: 'PUT',
                data: JSON.stringify(datosEmpresas), // convertimos los datos de empresa a JSON
                dataType: 'json',
                success: (data) => {
                    $('#mensajes').html('Empresa registrada').css('display', 'block') //mostramos el mensahe empresa registrada
                    getEmpresa();  //actualizamos
                    limpiarFormulario();  //limpiamos el formulario
                    $('#empresaDiv').hide();  //ocultamos el formulario
                }
            })
        })
    }


/* ----------------------------------------------OTROS METODOS------------------------------------------------------------------------------- */

        //metodo para limpiar el formulario
        const limpiarFormulario = () => {
            $('#tipo').val('');
            $('#nit').val('');
            $('#ciudad').val('');
            $('#telefono').val('');
            $('#email').val('');
        }

/* ---------------------------------------------------BOTON CANCELAR------------------------------------------------------------------------- */

    
    $('#cancelar').on('click', function () {
        limpiarFormulario(); //limpia el formulario
        $('#empresaDiv').hide();  //cierra el formulario
    })

    /* ---------------------------------------------------LLAMAR FUNCIONES------------------------------------------------------------------- */

    //llamando funciones...
    getEmpresa();
    postEmpresa();
    getEmpresaId();
    deleteEmpresa();
    rellenarFormulario();
    putEmpresa();
})