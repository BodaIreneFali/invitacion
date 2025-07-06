Invite = {
    events: function(){
        $(document).on("change", "#formAsistencia .asistencia .custom-control-input", function (){
            $(".formAsistencia-info").addClass('show');
            if($(this).val()==="Si"){
                $(".formAsistencia-si").addClass('show');
            } else {
                $(".formAsistencia-si").removeClass('show');
            }
        });
        $(document).on("change", "#formAsistencia .acompanante .custom-control-input", function (){
            if($(this).val()==="Si"){
                $(".formulario-acompanante").addClass('show');
                $(".acompanante").removeClass('line-bottom');
            } else {
                $(".formulario-acompanante").removeClass('show');
                $(".acompanante").addClass('line-bottom');
            }
        });
        $(document).on("change", "#formAsistencia .ninios .custom-control-input", function (){
            if($(this).val()==="Si"){
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
        var $form = $('form#formAsistencia'), 
        url = 'https://script.google.com/macros/s/AKfycbwUdF1iueblxS9UxdErPw8Bhzi4aHjX_JFB0RCFbabIuRfsBlyMkmwmR6w65Pv5W67f/exec';
        var jqxhr = $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: $form.serializeObject(),
            async: false,
        });

        setTimeout(function() {
            $form.hide();
            $('#sendAsistencia').hide();
            $('.formulario-content').append("<h5 class='modal-title'>Informaci&oacute;n enviada</h5><p class='subtitle'>Gracias</p>");
        }, 2000);
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
        if(phone == '' || !/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(phone)) {
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
          $('#formAsistencia').after('<span id="error-form">' + err + '</span>');
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

    parallax: function(){
        if (device == 'mobile' || $(window).width() < 768) {
            var portadaParallax = './img/portada-mobile.jpeg';
            var instagramParallax = './img/instagram_mobile01.jpeg';
        } else {
            var portadaParallax = './img/portada-desktop.jpeg';
            var instagramParallax = './img/instagram_desktop01.jpeg';
        }
        
        $('.portada').parallax({
            imageSrc: portadaParallax
        });

        $('.instagram').parallax({
            imageSrc: instagramParallax
        });
    },

    videoHeight: function() {
        var video = $('footer iframe');
        if (video.length > 0) {
            var width = video.width();
            var height = width*9/16;
            video.attr('height', height + 'px');
        }
    },
   
}
$(document).ready(function (){
    Invite.events();
    Invite.parallax();
    Invite.videoHeight();
});

$(window).resize(function(){
	Invite.videoHeight();
})