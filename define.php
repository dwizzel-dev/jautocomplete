<?php
/**
@auth:	Dwizzel
@date:	00-00-0000
@info:	essentials web site defined, used all across the site, there is aan include at the bottom so user can overwrite those with is own
*/
	
//-----------------------------------------------------------------------------------------------

// DEFINE
define('VERSION', '1.0.0');
define('IS_DEFINED', 1);
define('EOL', "\n");
define('TAB', "\t");

//BASIC
date_default_timezone_set('America/New_York');

// DEFAULT BRANDING AND VERSIONING
define('DEFAULT_BRAND', '000');
define('DEFAULT_VERSIONING', '003');

//BASE TEMPLATE NAME
define('TEMPLATE_NAME', 'default');

//LOADABLE
define('SITE_DEFINE_EDITABLE','define-editable.php');

//DATABASE
define('DB_DRIVER', 'mysql');/*the db drivers*/
define('DB_TYPE', 'mysql');/*the type of database*/
define('DB_HOSTNAME', 'localhost');/*the hostname*/
define('DB_PORT', '3306');
define('DB_USERNAME', '');/*the user connecting to databasse*/
define('DB_PASSWORD', '');/*the psw of the user*/
define('DB_DATABASE', 'blanksite');
define('DB_PREFIX', 'blanksite_');

// DATABASE SESSION CONN
define('DB_SESS_DRIVER', 'mysql');/*the db drivers*/
define('DB_SESS_TYPE', 'mysql');/*the type of database*/
define('DB_SESS_DATABASE', 'session');/*the database name*/
define('DB_SESS_HOSTNAME', 'localhost');
define('DB_SESS_PORT', '3306');
define('DB_SESS_USERNAME', '');
define('DB_SESS_PASSWORD', '');
define('DB_SESS_TABLE', 'ws_sessions');
define('DB_SESS_PREFIX', '');/*the table prefix*/

//this is the file generated by the admin interface to overwrite the values above
//NB: TEMPLATE_ANEM is in this file
require_once(SITE_DEFINE_EDITABLE);

// ABSOLUTE PATH
define('DIR', 'C:\dwizzel-local-server\code\www\github.com\dwizzel-dev\local-autocomplete\_autocomplete\\');/*compltete directory of the web site*/
define('DIR_CSS', DIR.'css/'.TEMPLATE_NAME.'/');
define('DIR_INC', DIR.'inc/');
define('DIR_CLASS', DIR.'class/');
define('DIR_LANG', DIR_INC.'lang/');
define('DIR_MEDIA', DIR.'images/'.TEMPLATE_NAME.'/');
define('DIR_COURRIEL_MESSAGE', DIR_INC.'email/');
define('DIR_TEMPLATE', DIR);
define('DIR_VIEWS', DIR_TEMPLATE.'views/');
define('DIR_CONTROLLER', DIR_TEMPLATE.'controller/');
define('DIR_MODEL', DIR_TEMPLATE.'model/');
define('DIR_WIDGET', DIR_TEMPLATE.'widget/');
define('DIR_INCLUDE', DIR_TEMPLATE.'include/');
define('DIR_LOGS', DIR.'temp/logs/');
define('DIR_CACHE', DIR.'temp/cache/');
//LES FICHIER CACHE POUR SEARCH EN JS ET PHP
define('DIR_RENDER_KW_JS', DIR_CACHE.'js/');
define('DIR_RENDER_KW_PHP', DIR_CACHE.'search/');
define('DIR_RENDER_EX_PHP', DIR_CACHE.'exercises/');
define('DIR_RENDER_CAT_PHP', DIR_CACHE.'categories/');
define('DIR_RENDER_KEYWORD_PHP', DIR_CACHE.'keywords/');
// RELATIVE PATH
define('PATH_WEB', '/_autocomplete/');/*the base web site path*/
define('PATH_WEB_SECURE', 'https://www.blank-site.com/');/*the secure address of the site*/
define('PATH_WEB_NORMAL', 'http://www.blank-site.com/');/*the normal address of the site*/

//pour le URL simplifie avec le .htaccess
//change les path de facon
// http://www.blank-site.com/en/exercises/library/geriatric/
//OU
// http://www.blank-site.com/index.php?&lang=en_US&path=exercises/library/geriatric/
//
define('SIMPLIFIED_URL', 1);
if(SIMPLIFIED_URL){
	define('PATH_HOME', PATH_WEB);	
	define('PATH_SERVICE', PATH_WEB.'service/');
	define('PATH_OFFLINE', PATH_WEB.'offline/');
	define('PATH_404', PATH_WEB.'404/');
	define('PATH_FORM_PROCESS', PATH_WEB.'process/');
}else{
	define('PATH_HOME', PATH_WEB.'index.php');
	define('PATH_SERVICE', PATH_WEB.'service');
	define('PATH_OFFLINE', PATH_WEB.'offline.php');
	define('PATH_404', PATH_WEB.'404.php');
	define('PATH_FORM_PROCESS', PATH_WEB.'process-form.php');
	}

define('PATH_CSS', PATH_WEB.'css/');
define('PATH_JS', PATH_WEB.'js/');
define('PATH_CACHE_JS', PATH_WEB.'temp/cache/js/');
define('PATH_IMAGE', PATH_WEB.'images/');
define('PATH_IMAGE_EXERCISE', PATH_IMAGE.'exercises/');
define('PATH_IMAGE_DEFAULT', PATH_IMAGE.'default-exercise.png');


// MODEL DEFAULT
define('MODEL_DEFAULT_TOP_FRONTPAGE','top-frontpage.php');
define('MODEL_DEFAULT_BOTTOM_CONTENT','bottom-content.php');
define('MODEL_DEFAULT_HEADER','header.php');
define('MODEL_DEFAULT_FOOTER','footer.php');
define('MODEL_DEFAULT_META','meta.php');
define('MODEL_DEFAULT_PREPEND','prepend.php');
define('MODEL_DEFAULT_CSS','css.php');
define('MODEL_DEFAULT_SCRIPT','script.php');
define('MODEL_DEFAULT_APPEND','append.php');
define('MODEL_DEFAULT_STRUCTURE','structure.php');

//CONTROLLER DEFAULT
define('CONTROLLER_DEFAULT_HOME','home');
define('CONTROLLER_DEFAULT_PAGE','page');
define('CONTROLLER_DEFAULT_404','404');

//ROUTER DEFAULT
define('ROUTER_KEY_DEFAULT_HOME_EN','home');
define('ROUTER_KEY_DEFAULT_HOME_FR','accueil');
define('ROUTER_KEY_DEFAULT_HOME_ES','inicio');

//OTHER
define('ERROR_LEVEL', E_ALL);
define('ENABLE_LOG', false);

//VIEWS
define('VIEW_DEFAULT','page');
define('VIEW_404','404');
define('VIEW_HOME','home');
define('VIEW_NEWS','news');

//LIMITER
define('LIMIT_NEWS_PER_PAGE', 2);
define('LIMIT_RESULT_PER_PAGE', 10);
define('LIMIT_MAX_PAGINATION_BOX', 10);

//DEFAULT
define('DEFAULT_NO_IMAGE', 'no_image');
define('DEFAULT_ID_SEPARATOR', '-');

//ICONS
define('PATH_SOCIALMEDIA_ICONS', PATH_IMAGE.'widget/socialmedia/icons/default/size3/');






//END

