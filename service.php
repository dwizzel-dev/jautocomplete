<?php
/**
@auth:	Monsieur Dwizzel
@date:	00-00-0000
@info:	fake fetch service


*/

use Classes\Libs\CSearch;


header('Content-Type: text/html; charset=utf-8');

// ERROR REPORTING
error_reporting(E_ALL);

// BASE DEFINE
require_once('define.php');

// ERROR REPORTING
error_reporting(ERROR_LEVEL);

$section = $_GET['section'] ?? '';
$service = $_GET['service'] ?? '';
$data = json_decode($_GET['data'] ?? '', true);
$kwType = $data['kwtype'] ?? '';

//we need them all
if(empty($section) || empty($service) || empty($data)){
    exit('NOT GOOD');
}

//fake return for testing
$arrFake = [
    'section' => $section,
    'service' => $service,
    'data' => [
        'cword' => $data['word'],
        'result' => [
            "make" => [
                ['id' => "0", 'name' => "B un"],
                ['id' => "1", 'name' => "B deux"],
                ['id' => "1", 'name' => "b Trois"],
            ],
            "kw" => [
                ['id' => "0", 'name' => "un"],
                ['id' => "1", 'name' => "deux"],
                ['id' => "2", 'name' => "trois"],
                ['id' => "3", 'name' => "quatre"],
                ['id' => "4", 'name' => "cinq"],
            ],
        ]    
    ]        
];

exit(json_encode($arrFake));

//EOF