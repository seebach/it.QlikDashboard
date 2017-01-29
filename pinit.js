var app = {};
// array to keep all elements to in saved in
var DBitems = [];

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

  var objectCounter=0;

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

  function makeGridBox (elementid) {
    var html = '<div class="col-md-9 col-xs-9 qs-box-wrapper">';
    html += '<div id="'+elementid+'" class="qs-box">'+elementid+'</div>';
    html += '<div class="zoombtn" data-toggle="modal" data-target="#modal-zoom" Title="Click to see details"></div>';
    html += '<div  class="glyphicon glyphicon-remove removebtn removebtn-ui" ></div>';
    html += '</div>';
    return html;
  }
  function makeFilterBox (elementid) {
    var html = '<div class="col-md-3 col-xs-3 qs-box-filter">';
    html += '<div id="'+elementid+'" class="">'+elementid+'</div>';
    html += '<div  class="glyphicon glyphicon-remove removebtn-filter removebtn-ui" ></div>';
    html += '</div>';
    return html;
  }
  function insertQlikObj (lastid,qsid,options) {
    log("insert: "+qsid);
    var elementid = 'QV'+objectCounter;
    var type;
    SheetObjects.filter(function (SheetObjects) {
       if(SheetObjects.guid == qsid ) {
         type = SheetObjects.type;
       }
    });
    app.getObjectProperties(qsid).then(function(model){
    console.log(model.properties.visualization);
    type = model.properties.visualization;
    // handle filters differently
    if(type==='filterpane') {
      app.getObject(elementid,qsid,'');
      var html = makeFilterBox(elementid);
      $('#filters').before(html);
    } else {
      app.getObject(elementid,qsid,options);
      var html = makeGridBox(elementid);
        $(lastid).before(html);
    }

    addObjects (elementid,qsid) ;
    });
    objectCounter++;
  }

  $("#insertId").click(function(){
    $.each(selection, (function (index, value) {
      var qsid = value;
      insertQlikObj('#addRow',qsid,{"noInteraction": true,"noSelections": true});
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
    console.log($(this).parent()[0].children[0].id);
    removeObjects(removeId);
    //console.log(DBitems);
  });
  $(document).on('click', ".removebtn-filter", function() {
    $(this).parent().remove();
    var removeId= $(this).parent()[0].children[0].id;
    console.log($(this).parent());
    removeObjects(removeId);
    //console.log(DBitems);
  });
  // array for selected guid
  var selection = [];
  $(document).on('change', "#Sheets", function(){
    // Clear select first...
    $('#QSPreview').empty();
    //var html = '<div class="col-sm-4">';
    $('#SheetObjectIds option').remove();

    //console.log($( "#Sheets option:selected" ).data("sheetGuid")) ;
    var sheetGuid = $( "#Sheets option:selected" ).data("sheetGuid");
    var i = 0;
    var colSize = 100 / 24;
    var rowSize = 100 / 12;

  app.getObject(sheetGuid).then(function(model) {
		model.layout.cells.map(function(d) {
			return {
				id: d.name,
				top: d.row * rowSize,
				left: d.col * colSize,
				width: d.colspan * colSize,
				height: d.rowspan * rowSize
			}
		})
		.forEach(function(d) {
      $('#QSPreview').append('<div class="preview-wrapper" id="preview-' + d.id + '" ><span id="select-'+d.id+'" class="ui-icon ui-icon-check selectedIcon" ></span><div id="show-'+d.id+'" ></div></div>');
      $('#preview-' + d.id).css({
				top: 'calc(' + d.top + '%)',
				left: 'calc(' + d.left  + '%)',
				width: 'calc(' + d.width + '%)',
				height: 'calc(' + d.height + '%)',
				position: 'absolute'
			})
      /*
			$('<div id="preview-' + d.id + '" class="preview-wrapper" />').css({
				top: 'calc(' + d.top + '%)',
				left: 'calc(' + d.left  + '%)',
				width: 'calc(' + d.width + '%)',
				height: 'calc(' + d.height + '%)',
				position: 'absolute'
			}).appendTo('#QSPreview');
*/
      app.getObject('show-'+d.id,d.id,{"noInteraction": true,"noSelections": true});
      $( "#preview-"+d.id ).click(function() {
        selectObject ($(this).attr('id').replace('preview-',''))
        $('#select-' + d.id).toggle();
        $('#select-' + d.id).toggleClass( "selected" );
      });
		})
	});

  /*
    app.getObjectProperties(sheetGuid).then(function(model){
       console.log(model);
     });
     for (var prop in SheetObjects) {
       if(SheetObjects[prop].sheetGuid==sheetGuid) {
        var guid = SheetObjects[prop].guid;

       console.log(objectCounter+' : '+guid);
       // Add new row for earch 3 eleemnt
      //  if(i==0 || (i/4) % 1 == 0) { //modlues 1 is zero for whole numbers
          var divId = 'QSPreview-'+i;
        //  $('#QSPreview').append('<div class="row align-items-start" id="'+divId+'"></div>');
        //}
        $('#QSPreview').append('<div class="col-lg-2 col-md-3 col-sm-4 col-xs-5 panel preview-wrapper" ><span id="select-'+guid+'" class="selectedIcon" ></span><div id="preview-'+guid+'" ></div></div>');
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
      }  } */
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
  if(localStorage.getItem('defaultObjects').length>=3) {
    log('read from storage');
     var defaultObjects = JSON.parse(localStorage.getItem('defaultObjects'));
  } else {
    log('st defaults');
    var defaultObjects = ['UgtPjHC','jUbp','dgXswmw','30428be5-4dbd-451e-8a59-137a4bd6c5e0','3c6300ca-b471-4b79-8e0d-b601b23b1678','8bcff869-0a14-4e56-8448-ad1611cc2e66','3491b46e-9ec4-48c6-a74c-b919cd78d835','0ba3a6e1-2bd1-4170-9e2a-a3d80f03ff56','156100bb-c7bc-4d47-a7ad-6cf4cf83515e'];
  }
  for (qid of defaultObjects) {
    insertQlikObj('#addRow',qid,{"noInteraction": true,"noSelections": true});
  }
} );

});
function log (message) {
  console.log(message);
}
function addObjects (elementid,qsid) {
DBitems.push({'qs': elementid, 'guid': qsid});
setLocalStorage();
}
function removeObjects (removeId) {
for (var i = DBitems.length - 1; i >= 0; i--) {
  if(DBitems[i].qs == removeId) {
    DBitems.splice(i, 1);
  }
}
setLocalStorage();
}
function setLocalStorage () {
var saveToStorage = [];
for (value of DBitems) {
    saveToStorage.push(value.guid)
}
//saveToStorage.push(DBitems.filter(function(value,index) { return value.guid;}));
// console.log(saveToStorage);
localStorage.setItem('defaultObjects',JSON.stringify(saveToStorage)) ;
}
