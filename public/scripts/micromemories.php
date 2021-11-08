<?php

require_once 'Mf2/Parser.php';

$ar_file = '/home/public/blog.carlesbellver.net/archive/index.json';

$ar_json = file_get_contents("$ar_file");
$archive = json_decode($ar_json);

$posts = array();
$otd_mmdd = $_GET['prefdate'] ? $_GET['prefdate'] : date('m-d');
if ($otd_mmdd == 'tomorrow') {
  $otd_mmdd = date('m-d', time()+(24*60*60));
}
elseif ($otd_mmdd == 'aftertomorrow') {
  $otd_mmdd = date('m-d', time()+2*(24*60*60));
}
elseif ($otd_mmdd == 'yesterday') {
  $otd_mmdd = date('m-d', time()-(24*60*60));
}

foreach ($archive->items as $item) {
  $date = $item->date_published;
  $url = $item->url;
  if (strpos($date, $otd_mmdd) == 5) {
    $mf = Mf2\fetch($url);
    foreach ($mf['items'] as $microformat) {
      if ($microformat['type'][0] == 'h-entry') {
        #$microformat['properties']['url'][0] = str_replace('https://blog.carlesbellver.net', '', $microformat['properties']['url'][0]);
        #$microformat['properties']['published'][0] = preg_replace('/^(\d{4})-\d{2}-\d{2} /', "$1-$otd_mmdd ", $microformat['properties']['published'][0]);
        #$microformat['properties']['published'][0] = preg_replace('/\+0\d00$/', "+0000", $microformat['properties']['published'][0]);
        array_push($posts, $microformat);
      }
    }
  }
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
echo(json_encode($posts));
?>
