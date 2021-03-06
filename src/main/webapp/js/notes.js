$(document).ready(function(){
    var showError = function(erreurTexte) {
        $("erreurNote").text(erreurTexte);
        $("#erreurNote").show();
    };

    $('#popupNote').on('show.bs.modal', function (event) {
        $("#erreurNote").hide();
        var button = $(event.relatedTarget); // Button that triggered the modal
        var idProjet = button.data('projet');
        var idSeance = button.data('seance');
        var idEleve = button.data('eleve');
        $("#formNote").hide();
        $("#ajaxLoading").show();
        $("#idProjetNote").val(idProjet);
        $("#idSeanceNote").val(idSeance);
        $("#idEleveNote").val(idEleve);
        $.ajax({
            method: "GET",
            url: getUrlLectureNote(idEleve, idSeance, idProjet)
        }).done(function (data) {
            if(data) {
                $("#noteValue").val(data.valeur);
                $("#noteComment").val(data.commentaire);
            } else {
                $("#noteValue").val("");
                $("#noteComment").val("");
            }
            $("#ajaxLoading").hide();
            $("#formNote").show();
            setTimeout(function () {  $("#noteValue").focus(); }, 500);
        }).fail(function () {
            console.error("Erreur de chargement de la note");
            $("#loadingAjax").hide();
            showError("Erreur lors du chargement de la note");
        });
    });

    var getUrlLectureNote = function(idEleve, idSeance, idProjet) {
        if (idProjet) {
            return "ws/note/projet?projet=" + idProjet + "&eleve=" + idEleve;
        }
        if(idSeance) {
            return "ws/note/seance?seance=" + idSeance + "&eleve=" + idEleve;
        }
    };

    var  actualiserPage = function() {
        window.location = "note";
    };

    var enregistrerNote = function(idProjet, idSeance, idEleve, valeur, commentaire){
        $("#erreurNote").hide();
        $.ajax({
            method: "POST",
            url: idProjet ? "ws/note/projet" : "ws/note/tp",
            data: {idProjet: idProjet, idSeance: idSeance, idEleve:idEleve, note: valeur, commentaireNote: commentaire}
        })
            .done(function () {
                console.log("Enregistrement de la note OK");
                actualiserPage();
                $('#popupNote').modal('hide');
            })
            .fail(function () {
                console.error("Erreur d'enregistrement de la note");
                showError("Erreur lors de l'enregistrement de la note");
            })
    };


    $("#validerNote").click(function(){
        enregistrerNote($("#idProjetNote").val(), $("#idSeanceNote").val(), $("#idEleveNote").val(), $("#noteValue").val(),$("#noteComment").val());
    });

    var getBodyMail = function(){
        return encodeURI($("#noteComment").val().replace("[[note]]",$("#noteValue").val()));
    };

    var getEmailEleves = function(travailId){
        var emails = "";
        $("#mailTravail"+travailId).find("li").each(function(index, element){
            emails = emails + ";"+element.textContent;
        });
        return emails;
    };

    var getObjectMail = function(){
        var titreTravail = "";
        var seance = $("#idProjetNote");
        if(seance.length>0) {
            titreTravail = seance.find("option[selected]")[0].textContent;
        }else{
            titreTravail = $("#idProjet").find("option[selected]")[0].textContent;
        }
        return "Note :  ".concat(titreTravail);
    };

    $("#mailNote").click(function(){
        window.location = "mailto:"+getEmailEleves($("#idTravail").val())+"?subject="+getObjectMail()+"&body="+getBodyMail();
    });


});