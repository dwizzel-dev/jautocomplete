<?php

namespace Classes\Libs;

class CReq{

    public function __construct(){}

    public static function get($k, $default = null){
        if(isset($_GET[$k])){
            return $_GET[$k];
        }
        return $default;
    }

}

//EOF