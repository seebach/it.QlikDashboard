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
      $('#modal-content').modal('show');
      $("#objectIds").trigger("change");

    });
/*    $('#objectIds').on('change', function() {
      //console.log('Change to ' + this.value);
      app.getObject('QSPreview',this.value);
    })
*/
    $('#SheetObjectIds').on('change', function() {
      //console.log('Change to ' + this.value);
      app.getObject('QSPreview',this.value);
    })


    $('#select-next').click(function() {
      var currentElement = $('#SheetObjectIds > option:selected');
      var nextElement = $('#SheetObjectIds > option:selected').next('option');
//      var currentElement = $('#objectIds > option:selected');
//      var nextElement = $('#objectIds > option:selected').next('option');
      //console.log("Next: %o", nextElement);

    if (nextElement.length > 0) {
        // No items so no more navigation
      } else {
        nextElement = currentElement;
      }
      document.getElementById("SheetObjectIds").value = nextElement.val();
      $("#SheetObjectIds").trigger("change");
//      document.getElementById("objectIds").value = nextElement.val();
//      $("#objectIds").trigger("change");

    });

    $('#select-prev').click(function() {
      var currentElement = $('#SheetObjectIds > option:selected');
      var prevElement = $('#SheetObjectIds > option:selected').prev('option');
//      var currentElement = $('#objectIds > option:selected');
//      var prevElement = $('#objectIds > option:selected').prev('option');

      //console.log("Prev: %o", prevElement)
    if (prevElement.length > 0) {
        // No items so no more navigation
      }  else {
        prevElement= currentElement;
      }
      document.getElementById("SheetObjectIds").value = prevElement.val();
      $("#SheetObjectIds").trigger("change");
//      document.getElementById("objectIds").value = prevElement.val();
//      $("#objectIds").trigger("change");
    });

    $("#insertId").click(function(){
      $.each(selection, (function (index, value) {
        var qsid = value;
  //      var qsid = $('#objectIds').val();
        var html = '<div class="col-sm-4">';
        html += '<div id="QV'+i+'" class="qs-box">QS'+i+'</div>';
        html += '<button type="button" class="btn btn-info btn-sm zoombtn" data-toggle="modal" data-target="#modal-zoom">zoom</button>';
        html += '<button type="button" class="btn btn-info btn-sm removebtn" >x</button>';
        html += '</div>';

        $('#last').before(html);
        qs = 'QV'+i;
        app.getObject(qs,qsid);
        DBitems.push({'qs': qs, 'guid': qsid});
        //console.log(DBitems);
        i++;
      }));

      // reset the selections array
      selection = [];
    });

    $(document).on('click', ".removebtn", function() {
      $(this).parent().remove();
      var removeId= $(this).parent()[0].children[0].id;
      //console.log($(this).parent()[0].children[0].id);
      for (var i = DBitems.length - 1; i >= 0; i--) {
        if(DBitems[i].qs == removeId) {
          DBitems.splice(i, 1);
        }
      }
      //console.log(DBitems);
    });

    // array for selected guid
    var selection = [];
    $(document).on('change', "#Sheets", function(){
      // Clear select first...
      $('#QSPreview').empty();
      //var html = '<div class="col-sm-4">';
      $('#SheetObjectIds option').remove();
      //console.log(this.value);
//      if(this.value != 'null') {
        /* replace with foreach later */
///----
      console.log($( "#Sheets option:selected" ).data("sheetGuid")) ;
      var sheetGuid = $( "#Sheets option:selected" ).data("sheetGuid");
      var i = 0;
      app.getObjectProperties(sheetGuid).then(function(model){
	       console.log(model);
       });
       for (var prop in SheetObjects) {
         if(SheetObjects[prop].sheetGuid==sheetGuid) {
          var guid = SheetObjects[prop].guid;
         console.log(i+' : '+guid);
         // Add new row for earch 3 eleemnt
          if(i==0 || (i/4) % 1 == 0) { //modlues 1 is zero for whole numbers
            var divId = 'QSPreview-'+i;
            $('#QSPreview').append('<div class="row align-items-start" id="'+divId+'"></div>');
          }
          $('#'+divId).append('<div class="col-sm-3 panel" ><span id="select-'+guid+'" class="selectedIcon" >aa</span><div id="preview-'+guid+'" ></div></div>');
          app.getObject('preview-'+guid,guid,{"noInteraction": true,"noSelections": true});
          $( "#preview-"+guid ).click(function() {
            selectObeject ($(this).attr('id').replace('preview-',''))
          });
          $( "#select-"+guid ).click(function() {
              selectObeject ($(this).attr('id').replace('select-',''))
          });
          i++;
        }  }
      ;
    });

    function selectObeject (addGuid) {
      var index = selection.indexOf(addGuid);
      // check if value exists then add or remove it
      if (index > -1) {
        selection.splice(index, 1);
      } else {
        selection.push(addGuid);
      }
      $("#select-"+addGuid).toggle();
      console.log(selection);
    }


    $(document).on('click', ".zoombtn", function(){
       // console.log($(this).parent()[0].children[0].id);
      var zoomId =$(this).parent()[0].children[0].id;
      //console.log('zoom: ' + zoomId);
      for (var i = DBitems.length - 1; i >= 0; i--) {
        if(DBitems[i].qs == zoomId) {
          var zoomGuid = DBitems[i].guid;
        }
      }
        //console.log(zoomId + ' is: ' + zoomGuid);

      app.getObject('QSZOOM', zoomGuid);
    });

    //var app = qlik.openApp('8c01277a-aae5-4f9c-94c7-b02de896fe7e', config);
    var app = qlik.openApp('8dd051e5-78d3-4347-98ba-3c03c5c1aa28', config);

    //  app.getObject('QV04','admCvFH');
    app.getObject('QV1','UgtPjHC');
    app.getObject('QV2','jUbp');
    app.getObject('QV3','dgXswmw');

    var DBitems = [];
    DBitems.push({'qs':'QV1', 'guid':'UgtPjHC'});
    DBitems.push({'qs':'QV2','guid':'jUbp'});
    DBitems.push({'qs':'QV3', 'guid':'dgXswmw'});


    var SheetObjects=[];
    app.getAppObjectList( 'sheet', function(reply){
    //console.log(reply);
    //SheetObjectIds
    var sheetTitle = '';
    var sheetGuid = '';
    var sheetTitlePrev = '';
    $.each(reply.qAppObjectList.qItems, function(key, value) {
      //console.log(value);
      sheetTitle = value.qMeta.title;
      sheetGuid = value.qInfo.qId;

    // loop sheets
    	$.each(value.qData.cells, function(k,v){
//R        console.log(v);
          if ('type' in v ) {
        SheetObjects.push({'sheet': sheetTitle,'sheetGuid':sheetGuid,'guid':v.name,'type':v.type});
        //if(sheetTitle !== sheetTitlePrev){
           // $('#objectIds').append( $('<optgroup></optgroup>').prop('label', sheetTitle)); // Breaks Next-Prev
           if(sheetTitle.indexOf('Chart')!= -1) {
              $("#Sheets").append($('<option></option>').val(sheetTitle).attr('data-sheet-guid',sheetGuid).html(sheetTitle));
           }
          }
/*          if(v.type != "text-image") {
            $('#objectIds').append( $('<option></option>').val(v.name).html(v.type+" id: "+v.name) );
          } */
          sheetTitlePrev = sheetTitle;
    		});
    	});
    });
    //console.log('O %o', SheetObjects);
  } );

});
