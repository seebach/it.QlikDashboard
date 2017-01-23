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
    // array to keep all elements to in saved in
    var DBitems = [];
    // keep all object in app here
    var SheetObjects=[];

    $("#addRow").click(function(){
      $('#modal-content').modal('show');
      $("#objectIds").trigger("change");
    });

    $('#SheetObjectIds').on('change', function() {
      //console.log('Change to ' + this.value);
      app.getObject('QSPreview',this.value);
    })

    function makeGridBox (qsid) {
      var html = '<div class="col-lg-2 col-md-3 col-sm-4 col-xs-5 qs-box-wrapper">';
      html += '<div id="QV'+i+'" class="qs-box">QS'+i+'</div>';
      html += '<button type="button" class="btn btn-info btn-sm zoombtn" data-toggle="modal" data-target="#modal-zoom">zoom</button>';
      html += '<button type="button" class="btn btn-info btn-sm removebtn" >x</button>';
      html += '</div>';
      return html;
    }
    function makeFilterBox (qsid) {
      var html = '<div class="row qs-box-wrappe">';
      html += '<div id="QV'+i+'" class="qs-box-fliter">QS'+i+'</div>';
      html += '<button type="button" class="btn btn-info btn-sm filter-removebtn" >x</button>';
      html += '</div>';
      return html;
    }
    function insertQlikObj (lastid,qsid,options) {
      console.log("insert: "+qsid);
      var elementid = 'QV'+i;
      var type;


      SheetObjects.filter(function (SheetObjects) {
         if(SheetObjects.guid == qsid ) {
           type = SheetObjects.type;
         }
      });
      // handle filters differently
      if(type==='filterpane') {
        app.getObject(elementid,qsid,'');
        var html = makeFilterBox(qsid);
        $('#filters').before(html);
      } else {
        app.getObject(elementid,qsid,options);
        var html = makeGridBox(qsid);
          $(lastid).before(html);
      }

      // add to list of objects
      DBitems.push({'qs': elementid, 'guid': qsid});
      i++;
    }

    $("#insertId").click(function(){
      $.each(selection, (function (index, value) {
        var qsid = value;
        insertQlikObj('#last',qsid,{"noInteraction": true,"noSelections": true});
      }));

      // reset the selections array
      $('#QSPreview').empty();
      selection = [];
      //$('#Sheets').find('selected').remove()
      $('#Sheets').prop('selectedIndex', -1);
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
      //console.log($( "#Sheets option:selected" ).data("sheetGuid")) ;
      var sheetGuid = $( "#Sheets option:selected" ).data("sheetGuid");
      var i = 0;
    //   console.log(SheetObjects);
      app.getObjectProperties(sheetGuid).then(function(model){
	       console.log(model);
       });
       for (var prop in SheetObjects) {
         if(SheetObjects[prop].sheetGuid==sheetGuid) {
          var guid = SheetObjects[prop].guid;

         console.log(i+' : '+guid);
         // Add new row for earch 3 eleemnt
        //  if(i==0 || (i/4) % 1 == 0) { //modlues 1 is zero for whole numbers
            var divId = 'QSPreview-'+i;
          //  $('#QSPreview').append('<div class="row align-items-start" id="'+divId+'"></div>');
          //}
          $('#QSPreview').append('<div class="col-lg-2 col-md-3 col-sm-4 col-xs-5 panel" ><span id="select-'+guid+'" class="selectedIcon" >aa</span><div id="preview-'+guid+'" ></div></div>');
          app.getObject('preview-'+guid,guid,{"noInteraction": true,"noSelections": true});
          $( "#preview-"+guid ).click(function() {
            selectObject ($(this).attr('id').replace('preview-',''))
          });
          $( "#select-"+guid ).click(function() {
              selectObject ($(this).attr('id').replace('select-',''))
          });
          // check if object already selected
          var index = selection.indexOf(guid);
          if (index > -1) {
            $("#select-"+guid).toggle();
          }
          i++;
        }  }
      ;
    });

    function selectObject (addGuid) {
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
        $('#QSZOOM').empty();
      app.getObject('QSZOOM', zoomGuid);
      // dirty hack to force rerender
      var height = Math.random()+90;

      console.log(height);
        $('#QVZOOM').height(height+"%");
    });

    //var app = qlik.openApp('8c01277a-aae5-4f9c-94c7-b02de896fe7e', config);
    var app = qlik.openApp('8dd051e5-78d3-4347-98ba-3c03c5c1aa28', config);



    app.getAppObjectList( 'sheet', function(reply){
    $.each(reply.qAppObjectList.qItems, function(key, sheet) {
      $("#Sheets").append($('<option></option>').val(sheet.qMeta.title).attr('data-sheet-guid',sheet.qInfo.qId).html(sheet.qMeta.title));
    	$.each(sheet.qData.cells, function(index,value){
          if ('type' in value   ) {
        SheetObjects.push({'sheet': sheet.qMeta.title,'sheetGuid':sheet.qInfo.qId,'guid':value.name,'type':value.type});
          }
    		});
    	});
    });
    insertQlikObj('#last','UgtPjHC',{"noInteraction": true,"noSelections": true});
    insertQlikObj('#last','jUbp',{"noInteraction": true,"noSelections": true});
    insertQlikObj('#last','dgXswmw',{"noInteraction": true,"noSelections": true});

  } );

});
