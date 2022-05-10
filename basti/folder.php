<?
if(isset($_GET['path'])) {
	$rootdir = "";
	$path = $_GET['path'];
	if(substr($path,-1) != "/") $path.="/";
	if(is_dir($rootdir.$path) and strpos(realpath($rootdir.$path),"gui/files") !== false)
	{
		$handle = opendir ($rootdir.$path);
		$folders = Array();
		$files = Array();
		while (($file = readdir($handle)) !== false) {
			if($file == '.') continue;
			if($file == '..' and $path=="") continue;
			if(is_file($rootdir.$path."/".$file)) $files[] = $file;
			elseif(is_dir($rootdir.$path."/".$file)) $folders[] = 	$file;
		}
		closedir($handle);
		asort($folders);
		asort($files);
		$foldercontents = array_merge($folders,$files);
		if(!isset($_GET['view'])) $view = "tiles";
		else $view = $_GET['view'];
		displayContents($rootdir.$path,$foldercontents,$view);
	} else {
		echo '<div style="text-align:center;margin-top:5px;">Ordner nicht gefunden.</div>';
	}
}
function displayContents($path,$contents,$view) {
	if($view == "tiles") $class = "tiles";
	else $class = "list";
	echo '<div class="foldercontent '.$class.'">';
	foreach($contents as $item) {
		$ending = substr(strrchr($item,"."),1);
		if($ending != "") $filetype = getTypeFor($ending);
		else $filetype = "folder";
		if($filetype == "link") {
			echo '<div class="item file icon-link-outline" data-name="'.$item.'" data-path="'.$path.$item.'"></div>';
		} elseif($filetype == "image") {
			echo '<div class="item file icon-picture" data-name="'.$item.'" data-path="'.$path.$item.'"><img src="'.$path.$item.'" class="thumb" /></div>';
		} elseif($filetype == "music") {
			echo '<div class="item file icon-note-beamed" data-name="'.$item.'" data-path="'.$path.$item.'"></div>';
		} elseif($filetype == "video") {
			echo '<div class="item file icon-movie" data-name="'.$item.'" data-path="'.$path.$item.'"></div>';
		} elseif($filetype == "text") {
			echo '<div class="item file icon-pencil-squared" data-name="'.$item.'" data-path="'.$path.$item.'"></div>';
		} elseif($filetype == "folder") {
			$temppath = $path;
			$icon = "folder";
			if($item == "..") {
				if(substr_count($path,"/") < 2) continue;
				else {
					/*$path = substr($path,0,strrpos(substr($path,0,-1),"/")+1);	*/
					$path = dirname($path);
					$item = "";
					$icon = "up-bold";
				}
			}
			echo '<div class="item folder icon-'.$icon.'" data-name="'.$item.'" data-path="'.$path.$item.'"></div>';
			$path = $temppath;
		} else {
			echo '<div class="item app icon-window" data-name="'.$item.'" data-path="'.$path.$item.'"></div>';
		}
	}
}
function getTypeFor($needle) {
	$jsonfile = file_get_contents('presets.json');
	$jsonobj = json_decode($jsonfile);
	$types = $jsonobj->types;
	foreach($types as $key => $val) {
		foreach($types->$key as $val2) {
			if($val2 == $needle) return $key;
		}
	}
}
?>