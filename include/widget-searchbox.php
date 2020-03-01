<?php
/**
@auth:	Dwizzel
@date:	00-00-0000
@info:	le search box a l'interieur des widgets


*/

$tmpStrWidgetNameUID = 'widget-searchbox-exercises-'.rand();

$getQuerySearch = isset($_GET['q']) ? $_GET['q'] : '';


?>
<!-- loaded css -->
<link rel="stylesheet" href="<?php echo PATH_CSS.'searchbox-exercises.'.DEFAULT_VERSIONING.'.css'; ?>" type="text/css">
<link rel="stylesheet" href="<?php echo PATH_CSS.'global.'.DEFAULT_VERSIONING.'.css'; ?>" type="text/css">
<!-- search box layer -->
<div class="widget-searchbox-exercises noprint <?php echo $tmpStrWidgetNameUID; ?>"></div>
<!-- loaded script -->
<script src="<?php echo PATH_JS; ?>/ahook.js" type="text/javascript"></script>
<script src="<?php echo PATH_JS; ?>/adebug.js" type="text/javascript"></script>
<script src="<?php echo PATH_JS; ?>/jlang.js" type="text/javascript"></script>
<script src="<?php echo PATH_JS; ?>/jserver.js" type="text/javascript"></script>
<script src="<?php echo PATH_JS; ?>/jcomm.js" type="text/javascript"></script>
<script src="<?php echo PATH_JS; ?>/jsearch.js" type="text/javascript"></script>
<script src="<?php echo PATH_JS; ?>/jappz.js" type="text/javascript"></script>
<script src="<?php echo PATH_JS; ?>/jautocomplete.js" type="text/javascript"></script>
<script src="<?php echo PATH_JS; ?>/jquery-1.7.2.js" type="text/javascript"></script>
<!-- locale script -->
<script>
jQuery(document).ready(function($){
	//main application 		
	(window.gAppz = window.gAppz || new JAppz({
		debug: true,
		sessionId: 0,
		isLocaleDb:true,
		localeLang: 'en_US',
		serverService: '<?php echo PATH_SERVICE; ?>',	
		serverFormProcess: '<?php echo PATH_FORM_PROCESS; ?>',
		serverCashPath: '<?php echo PATH_CACHE_JS; ?>',
		serverImagePath: '<?php echo PATH_IMAGE; ?>',
		mainContainer: '.frontpage-block',
		currentSearchedWord: '<?php echo $getQuerySearch; ?>',
		focusOnInput: true,	
		searchContainer: '.<?php echo $tmpStrWidgetNameUID; ?>',
	})).init();
});	
</script>
<?php

unset($tmpStrWidgetNameUID);


//EOF