$(document).ready(function () {
  var frases = [
    {
      words: [
        "Os",
        "recursos",
        "foram",
        "aplicados",
        "em",
        "uniformes",
        "mobílias",
        "equipamentos",
        "eletrônicos",
        "e",
        "materiais",
        "de",
        "escritório.",
      ],
      correctIndexes: [5, 6],
      commas: 2,
    },
    {
      words: [
        "A",
        "secretária",
        "não",
        "possui",
        "terras",
        "nem",
        "no",
        "Ceará",
        "nem",
        "em",
        "qualquer",
        "outro",
        "estado.",
      ],
      correctIndexes: [7],
      commas: 1,
    },
    {
      words: [
        "O",
        "sigilo",
        "bancário",
        "brasileiro",
        "tem",
        "sido",
        "ameaçado",
        "por",
        "uma",
        "crescente",
        "discreta",
        "e",
        "eficaz",
        "pressão",
        "da",
        "Justiça.",
      ],
      correctIndexes: [9, 10],
      commas: 2,
    },
    {
      words: [
        "Fez",
        "o",
        "discurso",
        "mais",
        "completo",
        "irônico",
        "verdadeiro",
        "e",
        "humano",
        "que",
        "já",
        "vimos.",
      ],
      correctIndexes: [4, 5],
      commas: 2,
    },
    {
      words: [
        "O",
        "substantivo",
        "ou",
        "seu",
        "substituto",
        "deve",
        "ficar",
        "em",
        "negrito.",
      ],
      correctIndexes: [1, 4],
      commas: 2,
    },
  ];
  var fraseAtual = 0;
  var totalFrases = frases.length;
  var commasPlaced = 0;
  var totalVirgulasNaFrase = 0;
  var audioAcerto = document.getElementById("audio-acerto");
  var audioErro = document.getElementById("audio-errado");
  var audioClique = document.getElementById("audio-clique");

  carregarFrase(fraseAtual);

  function carregarFrase(indice) {
    $("#zonaDeSoltar").empty();
    $(".areaVirgulas").empty();
    commasPlaced = 0;
    var fraseObj = frases[indice];
    var words = fraseObj.words;
    totalVirgulasNaFrase = fraseObj.commas;
    var fraseHtml = "";
    for (var i = 0; i < words.length; i++) {
      fraseHtml += "<span class='word'>" + words[i] + "</span>";
      fraseHtml +=
        " <span class='drop-zone' data-index='" +
        i +
        "' data-correct='false'></span> ";
    }
    $("#zonaDeSoltar").html(fraseHtml);
    for (var c = 0; c < totalVirgulasNaFrase; c++) {
      var virgulaElem = $("<span class='virgula draggable'>,</span>");
      $(".areaVirgulas").append(virgulaElem);
    }
    $(".draggable").draggable({
      revert: "invalid",
      start: function () {
        if (audioClique) audioClique.play();
      },
    });
    $(".drop-zone").droppable({
      accept: ".draggable",
      drop: function (event, ui) {
        var dropZone = $(this);
        var virgulaArrastada = ui.draggable;
        var existingComma = dropZone.find(".draggable");
        if (existingComma.length > 0) {
          var wasCorrect = dropZone.attr("data-correct") === "true";
          if (wasCorrect) {
            commasPlaced--;
          }
          existingComma.remove();
        }
        dropZone.empty();
        virgulaArrastada.css({ top: 0, left: 0 }).appendTo(dropZone);
        var indexGap = parseInt(dropZone.attr("data-index"));
        var fraseInfo = frases[fraseAtual];
        if (fraseInfo.correctIndexes.includes(indexGap)) {
          dropZone.attr("data-correct", "true");
          virgulaArrastada
            .removeClass("virgula-errada")
            .addClass("virgula-correta");
          commasPlaced++;
          if (audioAcerto) audioAcerto.play();
        } else {
          dropZone.attr("data-correct", "false");
          virgulaArrastada
            .removeClass("virgula-correta")
            .addClass("virgula-errada");

          if (audioErro) audioErro.play();

          setTimeout(function () {
            virgulaArrastada.removeClass("virgula-errada virgula-correta");
            virgulaArrastada
              .detach()
              .css({ top: 0, left: 0 })
              .appendTo(".areaVirgulas");
            virgulaArrastada.draggable({
              revert: "invalid",
              start: function () {
                if (audioClique) audioClique.play();
              },
            });
          }, 1000);
        }
        virgulaArrastada.draggable({
          revert: "invalid",
          start: function () {
            if (audioClique) audioClique.play();
          },
        });
        if (commasPlaced === totalVirgulasNaFrase) {
          $(".areaVirgulas").hide();
          $("#modalFeedback").modal("show");
          $("#modalFeedback").on("hidden.bs.modal", function () {
            $("#proximaFrase").show();
          });
        }
      },
    });
    $("#proximaFrase").hide();
  }

  $("#proximaFrase").on("click", function () {
    fraseAtual++;
    if (fraseAtual < totalFrases) {
      $(".areaVirgulas").show();
      carregarFrase(fraseAtual);
    } else {
      $("#modalFimDoJogo").modal("show");
      $("#proximaFrase").hide();
    }
  });

  $(".btn-close-obj").on("click", function () {});
});
