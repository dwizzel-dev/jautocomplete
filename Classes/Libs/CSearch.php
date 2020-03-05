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
                    "kw" => $this->searchKw(),
                    "make" => $this->searchMake()
                ]    
            ]        
        ];
    }

    public function searchKw(){
        $content = $this->openDB('kw');
        return $this->match($content);
    }

    public function searchMake(){
        $content = $this->openDB('make');
        return $this->match($content);
    }

    private function openDB($name){
        $path = DIR_CACHE."js/db-{$name}.en_US.data";
        if(!file_exists($path)){
            return [];
        }
        $file = fopen($path, "r");
        $content = fgets($file);
        return $content;
    }

    private function match($content){
        $rtn = [];
        $matches = [];
        $splitWord = explode(' ', trim(str_replace('/\s+/', ' ', $this->word)));
        foreach($splitWord as $word){
            $regex = '/\|+((?:[\d\s\w\-&\.]*\s|)'.$word.'[\d\s\w\-&\.]*)/i';
            if(preg_match_all($regex, $content, $match) !== false){
                $matches[] = $match[1];         
            }
        }
        if(!count($matches)){
            return $rtn;
        }
        $uMatch = $matches[0];
        for($i=1;$i<count($matches);$i++){
            $uMatch = array_intersect($uMatch, $matches[$i]);        
        }
        foreach($uMatch as $id=>$w){
            if($id > 20){
                break;
            }
            array_push($rtn, [
                'id' => $id,
                'name' => $w
            ]);
        }
        return $rtn;
    }

    private function fake($content){
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