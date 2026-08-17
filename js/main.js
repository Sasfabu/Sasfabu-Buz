(function () {
    "use strict";
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    const on = (type, el, listener, all = false) => {
        if (all) {
            select(el, all).forEach(e => e.addEventListener(type, listener))
        } else {
            select(el, all).addEventListener(type, listener)
        }
    }

    (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-N66JHZL');



    var keytime = new Date().getTime();

    $("#navbar").load("views/menu.html?key=" + keytime + performance.now(), function () {
        var pathname = window.location.pathname;
        if (pathname.indexOf("conocenos") > 0) {
            $("#con").addClass("active");
        } else if (pathname.indexOf("soluciones") > 0) {
            $("#sol").addClass("active");
        } else if (pathname.indexOf("faqs") > 0) {
            $("#faq").addClass("active");
        } else if (pathname.indexOf("contacto") > 0) {
            $("#con").addClass("active");
        } else if (pathname.indexOf("paises") > 0) {
            $("#ubi").addClass("active");
        }
        /***** Mobile nav toggle ****/
        on('click', '.mobile-nav-toggle', function (e) {
            select('#navbar').classList.toggle('navbar-mobile')
            this.classList.toggle('bi-list')
            this.classList.toggle('bi-x')
        })
        /****** Mobile nav dropdowns activate**********/
        on('click', '.navbar .dropdown > a', function (e) {
            if (select('#navbar').classList.contains('navbar-mobile')) {
                e.preventDefault()
                this.nextElementSibling.classList.toggle('dropdown-active')
            }
        }, true)
    });
    $("#footer").load("views/footer.html?key=" + keytime + performance.now());


    /****** Easy on scroll event listener  ******/

    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener);
    }

    /***** Navbar links active state on scroll ******/

    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /*** Scrolls to an element with header offset ***/

    const scrollto = (el) => {
        let header = select('#header')
        let offset = header.offsetHeight
        if (!header.classList.contains('header-scrolled')) {
            offset -= 10
        }
        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })
    }

    /*** Toggle .header-scrolled class to #header when page is scrolled ********/

    let selectHeader = select('#header')
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 10) {
                selectHeader.classList.add('header-scrolled')
                //$("#header").hide();
            } else {
                selectHeader.classList.remove('header-scrolled')
                //$("#header").show();
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }

    let selectHeaderb = select('#header.interno')
    if (selectHeaderb) {
        const headerScrolled = () => {
            if (window.scrollY > 10) {
                selectHeaderb.classList.add('header-scrolled-b')
                //$("#header").hide();
            } else {
                selectHeaderb.classList.remove('header-scrolled-b')
                //$("#header").show();
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }

    /****** Back to top button ******/

    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }


    /*** Scrool with ofset on links with a class name .scrollto****/

    on('click', '.scrollto', function (e) {
        if (select(this.hash)) {
            e.preventDefault()

            let navbar = select('#navbar')
            if (navbar.classList.contains('navbar-mobile')) {
                navbar.classList.remove('navbar-mobile')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
    }, true)

    /********** Animation on scroll ************/
    function aos_init() {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
            mirror: false
        });
    }
    window.addEventListener('load', () => {
        aos_init();
    });

})();

// ==========================================
// CONEXIÓN DE RECARGAS MUNDIALES (DING CONNECT)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const formularioRecarga = document.getElementById("form-recarga");

    if (formularioRecarga) {
        formularioRecarga.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita que la página se reinicie

            const telefonoInput = document.getElementById("input-telefono").value.trim();
            const montoInput = document.getElementById("input-monto").value.trim();
            const botonEnvio = formularioRecarga.querySelector("button[type='submit']");

            // Desactivamos el botón temporalmente para que no hagan doble clic
            const textoOriginal = botonEnvio.innerHTML;
            botonEnvio.disabled = true;
            botonEnvio.innerHTML = "Procesando transferencia...";

            try {
                // Conectamos con la función oculta de Netlify que creamos al inicio
                const respuesta = await fetch("/.netlify/functions/crear-pago", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        celular: telefonoInput,
                        monto: parseFloat(montoInput)
                    })
                });

                const resultado = await respuesta.json();

                if (respuesta.ok && resultado.urlPago) {
                    // Esto redirige al cliente de inmediato a Mercado Pago para que pague
                    window.location.href = resultado.urlPago;
                } else {
                    alert("No se pudo procesar: " + (resultado.error || "Error al generar el enlace de pago."));
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Ocurrió un problema de red. Por favor, intente nuevamente.");
            } finally {
                // Devolvemos el botón a su estado original
                botonEnvio.disabled = false;
                botonEnvio.innerHTML = textoOriginal;
            }
        });
    }
});

// Control de inicio de sesión de Netlify Identity
if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
        if (!user) {
            window.netlifyIdentity.on("login", () => {
                document.location.reload(); // Recarga la página al entrar
            });
        } else {
            console.log("Usuario autenticado en Sasfabu:", user.email);
        }
    });

    window.netlifyIdentity.on("logout", () => {
        document.location.reload(); // Recarga la página al salir
    });
}
