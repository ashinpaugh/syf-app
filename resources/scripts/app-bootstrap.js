/**
 * Bootstrap the AngularJS app.
 * 
 * @author Austin Shinpaugh
 */

var ApiEndpoint_Dev, ApiEndpoint_Stage, ApiEndpoint_Prod,
    ApiEndpoint, ApiResponseFormat,
    okHealthApp, okHealthControllers,
    okHealthServices, okHealthFilters
;

/**
 * If the API endpoint changes, this must be updated to the new URI, and the
 * app must be recompiled.
 * 
 * I.E.: cordova build android
 * 
 * @type {string}
 */
ApiEndpoint_Dev   = 'http://api.health.moop.dev/app_dev.php/v1';
ApiEndpoint_Stage = 'http://api.health.moop.stage/app_stage.php/v1';
ApiEndpoint_Prod  = 'http://api.health.moop.ly/v1';

ApiEndpoint       = ApiEndpoint_Stage;
ApiResponseFormat = 'json';
