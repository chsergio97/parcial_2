
$(document).ready(function () {

    // Páginas permitidas
    const paginasValidas = [
        "home",
        "nosotros",
        "servicios"
    ];

    
    $(document).on("click", "[data-ir]", function () {
        const pagina = $(this).data("ir");

        window.location.hash = pagina;
    });

    // Navegación entre vistas
    function cargarPagina(pagina) {

        // Validar la página solicitada
        if (!paginasValidas.includes(pagina)) {
            pagina = "home";
        }

        $("#contenido").html("<p>Cargando contenido...</p>");

        $.get("pages/" + pagina + ".html")
            .done(function (respuesta) {

                $("#contenido").html(respuesta);

                // Actualizar el botón activo
                $("nav button").removeClass("activo");

                $('nav button[data-page="' + pagina + '"]')
                    .addClass("activo");

                // Inicializar la vista de servicios
                if (pagina === "servicios") {
                    cargarServicios();
                }

            })
            .fail(function (xhr) {

                console.error(
                    "Error al cargar la página:",
                    "pages/" + pagina + ".html",
                    xhr.status
                );

                $("#contenido").html(
                    "<div class='contenido-pagina'>" +
                    "<h2>Error al cargar la página</h2>" +
                    "<p>Archivo: pages/" + pagina + ".html</p>" +
                    "<p>Código HTTP: " + xhr.status + "</p>" +
                    "</div>"
                );

            });
    }


    // Consultar servicios desde JSON
    function cargarServicios() {

        const $lista = $("#listaServicios");

        $lista.html("<p>Cargando servicios...</p>");

        $.getJSON("data/servicios.json")
            .done(function (respuesta) {

                const servicios = respuesta.servicios;

                // Generar las tarjetas
                function mostrarServicios(lista) {

                    $lista.empty();

                    $("#contadorServicios").text(
                        lista.length +
                        (lista.length === 1
                            ? " servicio encontrado"
                            : " servicios encontrados")
                    );

                    if (lista.length === 0) {
                        $lista.append(
                            $("<p>").text(
                                "No se encontraron servicios."
                            )
                        );

                        return;
                    }

                    $.each(lista, function (indice, servicio) {

                        const $tarjeta = $("<article>")
                            .addClass("tarjeta-servicio");

                        const $icono = $("<div>")
                            .addClass("servicio-icono");

                        $("<i>")
                            .addClass(
                                "fa-solid " + servicio.icono
                            )
                            .attr("aria-hidden", "true")
                            .appendTo($icono);

                        const $titulo = $("<h3>")
                            .text(servicio.nombre);

                        const $descripcion = $("<p>")
                            .text(servicio.descripcion);

                        const $categoria = $("<span>")
                            .addClass("servicio-categoria")
                            .text(servicio.categoria);

                        const $puerto = $("<p>")
                            .addClass("servicio-puerto")
                            .text(
                                servicio.puerto == null
                                    ? "Puerto: No aplica"
                                    : "Puerto: " + servicio.puerto
                            );

                        $tarjeta.append(
                            $icono,
                            $titulo,
                            $descripcion,
                            $categoria,
                            $puerto
                        );

                        $lista.append($tarjeta);
                    });
                }


                // Mostrar todos los servicios inicialmente
                mostrarServicios(servicios);


                // Filtrar servicios al escribir
                $("#buscarServicio")
                    .off("input")
                    .on("input", function () {

                        const busqueda = $(this)
                            .val()
                            .trim()
                            .toLowerCase();

                        const filtrados = servicios.filter(
                            function (servicio) {

                                const texto = [
                                    servicio.nombre,
                                    servicio.descripcion,
                                    servicio.categoria,
                                    servicio.puerto
                                ].join(" ").toLowerCase();

                                return texto.includes(busqueda);
                            }
                        );

                        mostrarServicios(filtrados);
                    });

            })
            .fail(function (xhr) {

                console.error(
                    "Error al consultar data/servicios.json:",
                    xhr.status
                );

                $lista.empty().append(
                    $("<p>").text(
                        "No fue posible consultar los servicios."
                    )
                );

                $("#contadorServicios").text("");

            });
    }


    // Detectar selección del menú
    $("nav button").on("click", function () {

        const pagina = $(this).data("page");

        // Actualizar el fragmento de la URL
        if (window.location.hash !== "#" + pagina) {
            window.location.hash = pagina;
        } else {
            cargarPagina(pagina);
        }

    });


    // Detectar cambios de URL y navegación atrás/adelante
    $(window).on("hashchange", function () {

        const pagina = window.location.hash.substring(1);

        cargarPagina(
            paginasValidas.includes(pagina)
                ? pagina
                : "home"
        );

    });


    // Recuperar la sección seleccionada al cargar o recargar
    const paginaInicial = window.location.hash.substring(1);

    cargarPagina(
        paginasValidas.includes(paginaInicial)
            ? paginaInicial
            : "home"
    );

});
