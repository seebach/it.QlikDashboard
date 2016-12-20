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

    function createDiv (id) {
      var html = '<div class="col-xs-6 col-sm-4 col-lg-3">';
      html += '<div id="QV'+id+'" class="qs-box">QS'+id+'</div>';
      html += '<button type="button" class="btn btn-info btn-sm zoombtn" data-toggle="modal" data-target="#modal-zoom">zoom</button>';
      html += '<button type="button" class="btn btn-info btn-sm removebtn" >x</button>';
      html += '</div>';
      return html;
    }
    var i=0;
    $("#addRow").click(function(){
      $('#modal-select').modal('show')
    });
    $('#objectIds').on('change', function() {
      // alert( this.value );
      app.getObject('QSPreview',this.value);
    })
    $('#select-next').click(function() {
      var nextElement = $('#objectIds > option:selected').next('option');
    if (nextElement.length > 0) {
        $('#objectIds > option:selected').removeAttr('selected').next('option').attr('selected', 'selected');
        app.getObject('QSPreview',$( "#objectIds" ).val());
      }
    });

    $('#select-prev').click(function() {
      var prevElement = $('#objectIds > option:selected').prev('option');
      console.log("my object: %o", prevElement)
    if (prevElement.length > 0) {
        $('#objectIds > option:selected').removeAttr('selected').prev('option').attr('selected', 'selected');
        app.getObject('QSPreview',$( "#objectIds" ).val());
      }
    });

    $("#insertId").click(function(){
      var qsid = $('#objectIds').val();
      i++;
      // add to array
      selectedIds[i] =  qsid;
      alert(selectedIds);
      var html = createDiv(i);

      $('#last').before(html);
      qs = 'QV'+i;
      app.getObject(qs,qsid);

    });

    $(document).on('click', ".removebtn", function() {
      $(this).parent().remove();
    });

    $(document).on('click', ".zoombtn", function() {
      $('#QSZOOM').empty();
//    $(this).prev().clone().appendTo('#QSZOOM');

      var id = $(this).prev().attr('id').replace("QV","");

//      var $QSZOOM = $(this).prev().clone();
      app.getObject('QSZOOM',selectedIds[id-1]);
//      $('#QSZOOM').html($QSZOOM);
    });

    var app = qlik.openApp('8c01277a-aae5-4f9c-94c7-b02de896fe7e', config);

    // get list of id's
    var selectedIds = ['ewhnvM','kjzhVu','RBJkQ'] ;

    for (id in selectedIds) {
      i++;
      var html = createDiv(i);
      $('#last').before(html);
      app.getObject('QV'+i,selectedIds[id]);
    }
    //  app.getObject('QV04','admCvFH');
    //app.getObject('QV1','ewhnvM');
    //app.getObject('QV2','kjzhVu');
    //app.getObject('QV3','RBJkQ');

    app.getAppObjectList( 'sheet', function(reply){
    	//var qlikObjects = [];
    //  var str = '';
    	$.each(reply.qAppObjectList.qItems, function(key, value) {
        //console.log("my object: %o", reply.qAppObjectList.qItems)
        //str += 't:'+ value.qData.title + ' ';
    		$.each(value.qData.cells, function(k,v){
    	//		str +=  v.type+' '+v.name + ' ';
            app.getObjectProperties(v.name).then(function(model){
            });

    		});
    	});
    //  console.log("my object: %o", qlikObjects)
    });

  } );

});
