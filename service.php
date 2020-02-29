<?php
/**
@auth:	Monsieur Dwizzel
@date:	00-00-0000
@info:	fake fetch service


*/

header('Content-Type: text/html; charset=utf-8');

// ERROR REPORTING
error_reporting(E_ALL);

// BASE DEFINE
require_once('define.php');

// ERROR REPORTING
error_reporting(ERROR_LEVEL);

$section = $_GET['section'];
$service = $_GET['service'];
$data = json_decode($_GET['data'], true);
$kwType = $data['kwtype'];

//fake return for testing
$arrFake = [
    'section' => $section,
    'service' => $service,
    'data' => [
        'cword' => $data['word'],
        'result' => [
            "kw" => [
                ['id' => "0", 'name' => "SUV"],
                ['id' => "1", 'name' => "Scion"],
                ['id' => "2", 'name' => "Subaru"],
                ['id' => "3", 'name' => "Suzuki"],
                ['id' => "4", 'name' => "Audi S5"],
                ['id' => "5", 'name' => "Audi SQ5"],
                ['id' => "6", 'name' => "BMW 1 Series"],
                ['id' => "7", 'name' => "BMW 2 Series"],
                ['id' => "8", 'name' => "BMW 3 Series"],
                ['id' => "9", 'name' => "BMW 4 Series"],
            ],
            "make" => [
                ['id' => "0", 'name' => "Acura"],
                ['id' => "1", 'name' => "Chevrolet"],
            ]      
        ]    
    ]        
];

exit(json_encode($arrFake));

//EOF