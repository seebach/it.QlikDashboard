var app = {};

$(document).ready(function(){


  var prefix = '/';

  var config = {
    host: 'qs.itellidemo.dk',
    prefix: prefix,
    port: window.location.port,
    isSecure: window.location.protocol === "https:"
  };


  require.config( {
    baseUrl: (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + config.prefix + "resources"
  } );

  require( ["js/qlik"], function ( qlik ) {

    var i=4;
    $("#addRow").click(function(){
      $('#modal-content').modal('show')
    });
    $("#insertId").click(function(){
      var qsid = $('#objectIds').val();
      var html = '<div class="col-sm-4">';
      html += '<div id="QV'+i+'">QS'+i+'</div>';
      html += '<button type="button" class="btn btn-info btn-sm zoombtn" data-toggle="modal" data-target="#modal-zoom">zoom</button>';
      html += '<button type="button" class="btn btn-info btn-sm removebtn" >x</button>';
      html += '</div>';

      $('#last').before(html);
      qs = 'QV'+i;
      app.getObject(qs,qsid);
      i++;

    });

    $(document).on('click', ".removebtn", function() {
      $(this).parent().remove();
    });

    $('.zoombtn').click(function() {
      //alert($(this).prev().attr('id'))
      //app.getObject('QSZOOM','RBJkQ');
      var $QSZOOM = $(this).prev().clone();
      $('#QSZOOM').html($QSZOOM);

//    alert("Hello");
    });

    var app = qlik.openApp('8c01277a-aae5-4f9c-94c7-b02de896fe7e', config);

    //  app.getObject('QV04','admCvFH');
    app.getObject('QV1','ewhnvM');
    app.getObject('QV2','kjzhVu');
    app.getObject('QV3','RBJkQ');

    app.getAppObjectList( 'sheet', function(reply){
    	//var qlikObjects = [];
    //  var str = '';
    	$.each(reply.qAppObjectList.qItems, function(key, value) {
        //console.log("my object: %o", reply.qAppObjectList.qItems)
        //str += 't:'+ value.qData.title + ' ';
    		$.each(value.qData.cells, function(k,v){
    	//		str +=  v.type+' '+v.name + ' ';
        //  qlikObjects.push({"type": v.type, "name":v.name});

          $('#objectIds').append( $('<option></option>').val(v.name).html(v.type+" id: "+v.name) )
    		});
    	});
    //  console.log("my object: %o", qlikObjects)
    });

  } );

});
