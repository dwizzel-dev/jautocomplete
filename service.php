<?php
/**
@auth:	Monsieur Dwizzel
@date:	00-00-0000
@info:	fake fetch service


*/

use Classes\Libs\CSearch;
use Classes\Libs\CReq;


header('Content-Type: text/html; charset=utf-8');

// ERROR REPORTING
error_reporting(E_ALL);

// BASE DEFINE
require_once('define.php');

// ERROR REPORTING
error_reporting(ERROR_LEVEL);

//BYE!
exit(
    json_encode(
        (new CSearch(
            json_decode(
                base64_decode(CReq::get('data', '')), 
                true
            )
        ))->search()
    )
);
 
//EOF