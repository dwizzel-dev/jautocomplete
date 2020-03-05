<?php

namespace Classes\Libs;

class CSearch{

    private $data;
    private $section;
    private $service;
    private $kwType;
    private $word;

    public function __construct($data){
        $this->data = $data;
        $this->section = $data['section'] ?? '';
        $this->service = $data['service'] ?? '';
        $this->kwType = $data['kwtype'] ?? '';
        $this->word = $data['data']['word'] ?? '';
    }

    public function search(){
        return [
            'section' => $this->section,
            'service' => $this->service,
            'data' => [
                'cword' => $this->word,
                'result' => [
                    "make" => $this->searchMake(),
                    "kw" => $this->searchKw(),
                ]    
            ]        
        ];
    }

    public function searchKw(){
        $path = DIR_CACHE.'js/db-kw.en_US.data';
        if(!file_exists($path)){
            return [];
        }
        $file = fopen($path, "r");
        $content = fgets($file);
        $count = 0;
        return array_map(function($item) use (&$count){
            return [
                'id' => $count++,
                'name' => $item
            ];
        }, explode('|', $content));
    }

    public function searchMake(){
        $path = DIR_CACHE.'js/db-make.en_US.data';
        if(!file_exists($path)){
            return [];
        }
        $file = fopen($path, "r");
        $content = fgets($file);
        $count = 0;
        return array_map(function($item) use (&$count){
            return [
                'id' => $count++,
                'name' => $item
            ];
        }, explode('|', $content));
    }

}

//EOF