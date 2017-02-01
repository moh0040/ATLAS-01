$(function() {

var RestApi='http://gate.atlascon.cz:9999/rest/s/';
///////////////////////////////////////////////////////////getting schema name
  $.ajax({
      type: 'GET',
      url: RestApi+'listSchemaNames',
      success: function(data) {
            for (var i = 0; i < data.length; i++) {
                $("#fir").append("<option>"+data[i]+"</option>");
            }
      },
      error: function() {
            alert("error to load schema name!");
      },
  });
/////////////////////////////////////////////////////getting the version of schema
  $('#fir').on("change", function() {
  $('#myTextArea').empty();
  $('#spanid').empty();
 $('input[type=number]').val('');

  var schem =$("#fir").val();
        $.ajax({
            type: 'GET',
            url:RestApi+'listVersions/'+schem,
            contentType: "application/json",
            success:function(data2){
                $("#sec").empty();
                for (var i = 0; i < data2.length; i++) {
                     $("#sec").append("<option>"+data2[i]+"</option>");
                }
            },
            error: function() {
                 alert("error to load version of schema!");
            },
        });
 });
//////////////////////////////////////////////////loading text schema into text-area
$(".button7").prop("disabled",true);
$(".button7").css('font-weight', 'normal');
$(".button9").prop("disabled",true);


$('#fir').on("change", function() {
    $('#sec').on("change", function() {
      var one =$("#fir").val();
      var two =$("#sec").val();
      console.log(two);
      $("#tbl_S2").val(two);
      if ($("#tbl_S2").is('empty')) {
           console.log('empty-version-box');
      } else {
             $(".button9").prop("disabled",false);
             $(".button9").css('font-weight', 'bold');
        };
      $.ajax({
           type: 'GET',
           url:RestApi+'original/'+one+"/"+two,
           success:function(data3){
                var str = JSON.stringify(data3, undefined, 4);
                $("#myTextArea").val(str);
            },
            error: function() {
                 alert("error to load text of schema!");
            },
      });
//////////////////////////////////////////////////////////////state of schema
              $.ajax({
                  type: 'GET',
                  url:RestApi+'state/'+one+"/"+two,
                  success: function(data4) {
                        var a="DRAFT";
                        var b="PUBLISHED";
                        var c="DEPRECATED";
                        var d="INVALID";
                        $(".button1, .button2, .button3, .button4").css('background-color', '#dddddd');
                        $(".button1, .button2, .button3, .button4").css('color', '#848484');
                        $(".button1, .button2, .button3, .button4").css('font-weight', 'normal');
                        $(".button7").css('font-weight', 'bold');
                        if (data4==a) {
                            $(".button1").css('background-color', '#00F8B2');
                            $(".button1").css('color', '#242424');
                            $(".button1").css('font-weight', 'bold');
                            $(".button7").prop("disabled",false);
                            $(".button8").prop("disabled",false);
                            $(".button11").prop("disabled",false);
                        }else if(data4==b){
                            $(".button2").css('background-color', '#01DF01');
                            $(".button2").css('color', '#242424');
                            $(".button2").css('font-weight', 'bold');
                            $(".button7").prop("disabled",false);
                            $(".button8").prop("disabled",true);
                            $(".button11").prop("disabled",false);
                        }else if(data4==c){
                            $(".button3").css('background-color', '#FFA200');
                            $(".button3").css('color', '#242424');
                            $(".button3").css('font-weight', 'bold');
                            $(".button7").prop("disabled",false);
                            $(".button8").prop("disabled",true);
                            $(".button11").prop("disabled",false);
                        }else if(data4==d){
                            $(".button4").css('background-color', '#FF0000');
                            $(".button4").css('color', '#242424');
                            $(".button4").css('font-weight', 'bold');
                            $(".button7").prop("disabled",true);
                            $(".button7").css('font-weight', 'normal');
                            $(".button8").prop("disabled",true);
                            $(".button11").prop("disabled",false);
                        }
                  },
                  error: function() {
                        alert("error to load state of schema !");
                  },
              });
//////////////////////////////////////////////////////////////////////////validation mark
                var validation = $('#myTextArea').val();
                $.ajax({
                     type: 'POST',
                     url: RestApi+'validate',
                     data:validation,
                     contentType: "application/json",
                     success: function(data5) {
                        $('#spanid').html('<h3 style="font-size:14px; color:black; font-weight:bold; font-style:italic;">Valid Schema : <span style="font-size:20px; color:#01DF3A; font-weight:bold; font-style:italic;">&#10004;</span></h3>');

                     },
                     error: function() {
                         $('#spanid').html('<h3 style="font-size:14px; color:black; font-weight:bold; font-style:italic;">Invalid Schema : <span style="font-size:20px; color:red; font-weight:bold; font-style:italic;">&#10006;</span></h3>');
                     },
                });
    });
});





////////////////////////////////////////////////////////////////////Transition
$(".button7").on('click', function() {
$('#state3').show(20).delay(4000).hide(50);
    var SchemName = $('#fir').val();
    var VerSchem = $('#sec').val();
    if (confirm('Do you want to change the state of schema ?')) {
    var order0 =
    {
      "post": {
        "tags": [
          "schemas"
        ],
        "operationId": "transitState",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": SchemName,
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": VerSchem,
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "default": {
            "description": "successful operation"
          }
        }
      }
    };
        $.ajax({
            type: 'POST',
            url: RestApi+'stateTransition/'+ SchemName+"/"+VerSchem,
            //data:order0, //does not effect on result becouse the result is success or not
            contentType: "application/json",
            success: function(data5) {
                console.log(data5);
                $("#state3").html('<h3 style="font-size:15px; color:green; font-weight:bold; font-style:italic;">State Changed... </h3>');
            },
            error: function() {
               alert("error in transition!");
            },
        });
    };
});
//////////////////////////////////////////////////////////////// adding new schema ()
var $ver=$('#tbl_S2');
var $tex=$('#myTextArea');
$(".button8").on('click', function() {
    if (confirm('Are you sure ?')) {

                var order =
                {
                  "post": {
                    "tags": [
                      "schemas"
                    ],
                    "operationId": "createUpdateSchema",
                    "consumes": [
                      "application/json"
                    ],
                    "produces": [
                      "application/json"
                    ],
                    "parameters": [
                      {
                        "name": $ver.val(),
                        "in": "path",
                        "required": true,
                        "type": "integer",
                        "format": "int32"
                      },
                      {
                        "in": "path",
                        "name": $tex.val(),
                        "required": false,
                        "schema": {
                          "type": "string"
                        }
                      }
                    ],
                    "responses": {
                      "default": {
                        "description": "successful operation"
                      }
                    }
                  }
                };

        $.ajax({
            type: 'POST',
            url: RestApi+ $ver.val(),
            data:$tex.val(),
            contentType: "application/json",
            success: function(data4) {
                $("#fir").append("<option>"+data4+"</option>");
            },
            error: function() {
               alert("error to add a new schema !");
            },
        });
    };
});
///////////////////////////////////////////////////////////////////////////clean button
$(".button9").on('click', function reset() {
    if (confirm('Are you sure to clean version and schema values ?')) {
        $('#myTextArea').val('');
        $('#spanid').empty();
       $('input[type=number]').val('');
       $(".button8").prop("disabled",false);
    };
  });
  ////////////////////////////////////////////////////////////////////validation button
  $(".button11").on('click', function() {
                var validation = $('#myTextArea').val();
                $.ajax({
                     type: 'POST',
                     url: RestApi+'validate',
                     data:validation,
                     contentType: "application/json",
                     success: function(valid) {
                        if (valid===true) {
                            $('#spanid').html('<h3 style="font-size:14px; color:black; font-weight:bold; font-style:italic;">Valid Schema : <span style="font-size:20px; color:#01DF3A; font-weight:bold; font-style:italic;">&#10004;</span></h3>');

                        }else if(valid===false){
                         $('#spanid').html('<h3 style="font-size:14px; color:black; font-weight:bold; font-style:italic;">Invalid Schema : <span style="font-size:20px; color:red; font-weight:bold; font-style:italic;">&#10006;</span></h3>');
                        }
                     },
                     error: function() {
                     },
                });
                });
/////////////////////////////////////////////////////////////////////////////////end
});
