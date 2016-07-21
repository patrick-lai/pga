/**
 * appsscript script to run in a google spreadsheet that synchronizes its
 * contents with a fusion table by replacing all rows.
 * based on instructions here:
 * https://htmlpreview.github.io/?https://github.com/fusiontable-gallery/fusion-tables-api-samples/blob/master/FusionTablesSheetSync/docs/reference.html#enabling_advanced_services
 */

// replace with your fusion table's id (from File > About this table)
var TABLE_ID = '1b4XoPuboTQ-x6K_uoIpjEg0k4Nwa8gEewhFpDypw';

// Location column
var docProperties = PropertiesService.getScriptProperties();
var LOCATION_COLUMN = docProperties.getProperty('Location');
var POKEDEX_COLUMN = docProperties.getProperty('PokedexId');
var NAME_COLUMN = docProperties.getProperty('PokemonName');

// first row that has data, as opposed to header information
var FIRST_DATA_ROW = 2;

// true means the spreadsheet and table must have the same column count
var REQUIRE_SAME_COLUMNS = false;

/**
 * replaces all rows in the fusion table identified by TABLE_ID with the
 * current sheet's data, starting at FIRST_DATA_ROW.
 */
function sync() {
    var tasks = FusionTables.Task.list(TABLE_ID);
    // Only run if there are no outstanding deletions or schema changes.
    if (tasks.totalItems === 0) {
        var sheet = SpreadsheetApp.getActiveSheet();
        var wholeSheet = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
        var values = wholeSheet.getValues();
        if (values.length > 1) {
            var csvBlob = Utilities.newBlob(convertToCsv_(values), 'application/octet-stream');
            FusionTables.Table.importRows(TABLE_ID, csvBlob, { isStrict: REQUIRE_SAME_COLUMNS, startLine: FIRST_DATA_ROW - 1 });
            Browser.msgBox('Imported ' + (values.length - 1) + ' rows in your Fusion Table', Browser.Buttons.OK);
            wholeSheet.clear();
            sheet.appendRow(["TimeStamp", "PokemonName", "PokedexId","Location"]);
        }
    } else {
        Logger.log('Skipping row replacement because of ' + tasks.totalItems + ' active background task(s)');
    }
};

/**
 * converts the spreadsheet values to a csv string.
 * @param {array} data the spreadsheet values.
 * @return {string} the csv string.
 */
function convertToCsv_(data) {
    // See https://developers.google.com/apps-script/articles/docslist_tutorial#section3
    var csv = '';
    for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
            var value = data[row][col].toString();
            if (value.indexOf(',') != -1 ||
                value.indexOf('\n') != -1 ||
                value.indexOf('"') != -1) {
                    // Double-quote values with commas, double quotes, or newlines
                    value = '"' + value.replace(/"/g, '""') + '"';
                    data[row][col] = value;
            }
            // GeoCode locations
            if(col == LOCATION_COLUMN){
              data[row][col] = geocode(data[row][col].toString());
            }
            // Get Name
            if(col == POKEDEX_COLUMN){
              var attributes = data[row][col].split(" ");
              data[row][POKEDEX_COLUMN] = attributes[0];
              data[row][NAME_COLUMN] = attributes[1];
            }
        };
        // Join each row's columns and add a carriage return to end of each row except the last
        if (row < data.length && data[row][LOCATION_COLUMN]) {
            csv += data[row].join(',') + '\r\n';
        };
    };
    return csv;
};

// create menu buttons
function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [{
        name: "Update Fusion Table",
        functionName: "sync"
    }];
    ss.addMenu("Sync Spreadsheet To Fusion Table", menuEntries);
};

function geocode(address) {
  if (!address) {
    return '';
  }

  Utilities.sleep(100);

  var results = Maps.newGeocoder().geocode(address);

  // If all your form responses will be within a given area, you may get better
  // geocoding results by biasing to that area. Uncomment the code below and set
  // the desired region, bounding box, or component filter. The example shows
  // how to indicate that the addresses should be in Spain. For full details, see
  // https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingRequests
  //
  // var results = Maps.newGeocoder().geocode({ address: address, region: 'es' });

  Logger.log('Geocoding: ' + address);
  if (results.status == 'OK') {
    var bestResult = results.results[0];
    var lat = bestResult.geometry.location.lat;
    var lng = bestResult.geometry.location.lng;
    var latLng = lat + ' ' + lng;
    Logger.log('Results: ' + latLng);
    return latLng;
  } else {
    Logger.log('Error geocoding: ' + address);
    Logger.log(results.status);
    return '';
  }
}
