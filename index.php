<?php
/**
@auth:	Monsieur Dwizzel
@date:	00-00-0000
@info:	starthome page for all treatment

@SQL: select make.name || ' ' || model.name || ' ' || vehicles.year || '|' from vehicles left join make on vehicles.make = make.id left join model on vehicles.model = model.id GROUP BY make.name, model.name, vehicles.year ORDER BY make.name, model.name, vehicles.year DESC;

*/

header('Content-Type: text/html; charset=utf-8');

// ERROR REPORTING
error_reporting(E_ALL);

// BASE DEFINE
require_once('define.php');

// ERROR REPORTING
error_reporting(ERROR_LEVEL);

?>
<!DOCTYPE html>
<html lang="en_US">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <meta charset="utf-8">
    <title>jautocomplete</title>
    <body>
        <div class="frontpage-block search-box-squeeze">
            <?php require_once(DIR_INCLUDE.'widget-searchbox.php'); ?>
        </div>
    </body>
</html>