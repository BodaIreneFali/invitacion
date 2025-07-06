Invite = {
    // Declarar targetDate como una variable privada dentro del ámbito de Invite
    init: function() {
        this.setParallaxHeight();
        // Inicializar la fecha objetivo: 30 de agosto de 2025
        let targetDate = new Date("2025-08-30T18:30:00");
        this.updateCountdown(targetDate);
        this.events();
    },
    
    events: function() {
        $(document).on("change", "#formAsistencia .asistencia .custom-control-input", function () {
            $(".formAsistencia-info").addClass('show');
            if ($(this).val() === "Si") {
                $(".formAsistencia-si").addClass('show');
            } else {
                $(".formAsistencia-si").removeClass('show');
            }
        });
        $(document).on("change", "#formAsistencia .acompanante .custom-control-input", function () {
            if ($(this).val() === "Si") {
                $(".formulario-acompanante").addClass('show');
                $(".acompanante").removeClass('line-bottom');
            } else {
                $(".formulario-acompanante").removeClass('show');
                $(".acompanante").addClass('line-bottom');
            }
        });
        $(document).on("change", "#formAsistencia .ninios .custom-control-input", function () {
            if ($(this).val() === "Si") {
                $(".formulario-ninios").addClass('show');
                $(".ninios").removeClass('line-bottom');
            } else {
                $(".formulario-ninios").removeClass('show');
                $(".ninios").addClass('line-bottom');
            }
        });
        $(document).on("change", "#formAsistencia .err", function (){
            Invite.isOkAsistencia();
        });

        $('#sendAsistencia').on('click', function(e) {
            e.preventDefault();
            if (Invite.isOkAsistencia()) {
                // Load and disabled buttom.
                $("#sendAsistencia").text("Enviando...");
                $("#sendAsistencia").prop("disabled", true);
                
                // Envio form
                Invite.sendAsistencia();
            }
        });
    },

    //Envio de formulario
    sendAsistencia: function() {
        var form = document.getElementById('formAsistencia');
        var action = form.action || 'https://script.google.com/macros/s/AKfycbxPoJjW88GEHpCExpr1k9T8q4AmcrlVlAaYGPh0Fv0iBFzNtxpKSzw03OLmPyYpGjlr/exec';
        var data = new FormData(form);
        fetch(action, {
            method: 'POST',
            body: data,
        })
        .then(() => {
            $(form).hide();
            $('#sendAsistencia').hide();
            $('.form-block-description').empty(); // Limpiar contenido previo
            $('.form-block-description').append("<h5 class='text mt-5'>Informaci&oacute;n enviada con éxito</h5><h5 class='sub-text mt-2'>Gracias por confirmar</h5>");
        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            $('.form-block-description').append("<h5 class='text mt-5'>Error al enviar</h5><p class='sub-text mt-2'>Por favor, intenta de nuevo más tarde.</p>");
        });

    },

    // Validacion de form.
    isOkAsistencia: function() {

        // Remuevo mensajes de error anteriores
        $("#error-form").remove();
        $('.err').removeClass('err');
  
        // Variables necesarias para la validacion
        var flag = true;
        var err = '';
  
        // Variables del form para validar.
        var attend = $('input[name="asistencia"]:checked').val();
        var name = $.trim($("#nombreAsistente").val());
        var phone = $.trim($("#telefonoAsistente").val());
        var email = $.trim($("#correoAsistente").val());
        var partner = $('input[name="acompanante"]:checked').val();
        var partnerName = $.trim($("#acompanantesNombre").val());
        var child = $('input[name="ninios"]:checked').val();
        var childName = $.trim($("#niniosNombre").val());
  
        // Nombre
        if (name == '') {
            flag = false;
            $("#nombreAsistente").addClass('err');
            err = err + "Indica un nombre<br>";
        }
        //Telefono
        if(phone == '' || !/^\+?[0-9\s\-()]{7,15}$/.test(phone)) {
            flag = false;
            $("#telefonoAsistente").addClass('err');
            err = err + "Indica un n&uacute;mero de tel&eacute;fono v&aacute;lido<br>";
        }
        //Email
        if(email == '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ) {
            flag = false;
            $("#correoAsistente").addClass('err');
            err = err + "Indica un correo electr&oacute;nico v&aacute;lido<br>";
        }
        //Si asiste
        if(attend == 'Si') {
            if(partner) {
                if(partner == 'Si' && partnerName == ''){
                    flag = false;
                    $("#acompanantesNombre").addClass('err');
                    err = err + "Indica el nombre completo de los acompañantes<br>";
                }
            } else {
                flag = false;
                $("input[name='acompanante']").addClass('err');
                err = err + "Indica si vendr&aacute;s acompañado<br>";
            }
            if(child) {
                if(child == 'Si' && childName == '') {
                    flag = false;
                    $("#niniosNombre").addClass('err');
                    err = err + "Indica el o los nombres de los niños<br>";
                }
            } else {
                flag = false;
                $("input[name='ninios']").addClass('err');
                err = err + "Indica si vendr&aacute;s con niños<br>";
            }
        }
  
        if (flag === false) {
          $('.msj-content').after('<span id="error-form">' + err + '</span>');
        } else {
            var date = new Date()
            const options = {
                year: 'numeric', 
                month: 'numeric', 
                day: 'numeric',
                hour: 'numeric', 
                minute: 'numeric', 
                second: 'numeric', 
            };
            date = new Intl.DateTimeFormat('es-Es', options).format(date);
            $('#datetime').val(date);
        }
        return flag;
    },

    // Función para calcular y asignar el alto de la pantalla al parallax
    setParallaxHeight: function() {
        const parallaxHeight = window.innerHeight + 100;
        const mainBlock = document.querySelector('.main-block');
        if (mainBlock) {
            mainBlock.style.height = `${parallaxHeight}px`;
        }
    },

    // Función para actualizar la cuenta atrás
    updateCountdown: function(targetDate) {
        var now = new Date();
        var timeDifference = targetDate - now;

        if (timeDifference <= 0) {
            document.querySelector(".countdown").innerHTML = "<p>¡El gran día ha llegado!</p>";
            return;
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.querySelector(".days p").textContent = days;
        document.querySelector(".hours p").textContent = hours;
        document.querySelector(".mins p").textContent = minutes;
        document.querySelector(".segs p").textContent = seconds;

        // Actualizar la cuenta atrás cada segundo
        setTimeout(() => this.updateCountdown(targetDate), 1000);
    },
};

$(document).ready(function() {
    Invite.init();
});

$(window).on('resize', function() {
    Invite.setParallaxHeight();
});