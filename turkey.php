<?php

	$listTitle = "My Listmas";

	$social = array();
	$social['title'] = "InsertTitleHere";
	$social['description'] = "InsertDescriptionHere";
	$social['image'] = "http://www.turkeyvolume.com/icons/icon_256.png";
	$social['link'] = "http://www.turkeyvolume.com".$_SERVER[REQUEST_URI];

	if(isset($_GET['t'])){
		define('BASEPATH', str_replace('\\', '/', $system_path));
		include('reactor/application/config/constants.php');
		include('reactor/application/config/database.php');
		include('reactor/application/helpers/idobfuscator_helper.php');

		//
		if($_SERVER["HTTP_HOST"] == "gibson.loc"){
			if( !is_numeric($_GET['t']) ) $_GET['t'] = IdObfuscator::decode($_GET['t']);
		}else{
			$_GET['t'] = IdObfuscator::decode($_GET['t']);
		}

		try {
		    $dbh = new PDO("mysql:host=".$db['default']['hostname'].";dbname=".$db['default']['database'].";charset=utf8", $db['default']['username'], $db['default']['password'],array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
		    /*** echo a message saying we have connected ***/
		    //echo 'Connected to database';
		    }
		catch(PDOException $e)
		    {
		    echo $e->getMessage();
		    }

		$stmt = $dbh->prepare("SELECT cloudImage FROM tblCloud WHERE cloudId=".$_GET['t']);
		$stmt->execute();
		if( $stmt->rowCount() <= 0 ){
			//
			$rootpg = (!empty($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . "/";
			if( $_SERVER['HTTP_HOST'] == "gibson.loc" ){
				$rootpg .= "turkeyvolume/";
			}
			header("Location: ".$rootpg);
			//print_r($rootpg);
			die();
		}else{
			$titleRS = $stmt->fetch();
			//print_r($titleRS['cloudImage']);
			$pgTitle = "Turkey Volume";
		}
	}

?>
<!DOCTYPE html>
<html>
    <head>
	  <meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

		<title><?=$pgTitle?></title>
		<meta name="description" content="<?=$social['description']?>">
		<meta name="author" content="Matthew Wilber">
		<meta property="og:title" content="<?=$social['title']?>" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="<?=$social['link']?>" />
		<meta property="og:image" content="<?=$social['image']?>" />
		<meta property="og:site_name" content="<?=$social['title']?>" />
		<meta property="fb:admins" content="631337813" />
		<meta property="og:description" content="<?=$social['description']?>" />


		<!-- Twitter Summary Card -->
		<meta name="twitter:card" content="summary">
		<meta name="twitter:site" content="@greenzeta">
		<meta name="twitter:title" content="My Listmas">
		<meta name="twitter:description" content="<?=$social['description']?>">
		<meta name="twitter:creator" content="@greenzeta">
		<meta name="twitter:image:src" content="<?=$social['image']?>">
		<meta name="twitter:domain" content="mylistmas.com">

		<!--<meta name="twitter:card" content="app">
		<meta name="twitter:description" content="<?=$social['description']?>">
		<meta name="twitter:app:country" content="US">
		<meta name="twitter:app:name:iphone" content="Listmas">
		<meta name="twitter:app:id:iphone" content="">
		<meta name="twitter:app:url:iphone" content="">
		<meta name="twitter:app:name:ipad" content="Cannonball">
		<meta name="twitter:app:id:ipad" content="">
		<meta name="twitter:app:url:ipad" content="">
		<meta name="twitter:app:name:googleplay" content="Listmas">
		<meta name="twitter:app:id:googleplay" content="com.greenzeta.listmas">
		<meta name="twitter:app:url:googleplay" content="https://play.google.com/store/apps/details?id=com.greenzeta.listmas">-->

    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, target-densitydpi=device-dpi" />
		<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
		<link rel="icon" href="/favicon.ico" type="image/x-icon">
		<link href='fonts/opensans_regular_macroman/stylesheet.css' rel='stylesheet' type='text/css'>
		<link href='fonts/opensans_bold_macroman' rel='stylesheet' type='text/css'>
		<link type="text/css" href="css/jquery.jscrollpane.css" rel="stylesheet" media="all" />
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="css/list.css" />
    <link rel="stylesheet" type="text/css" href="css/color.css" />
    <title>Turkey Volume</title>

    <script type="text/javascript">
		var social = [];
			social['title'] = "<?=$social['title']?>";
			social['description'] = "<?=$social['description']?>";
			social['image'] = "<?=$social['image']?>";
			social['link'] = "<?=$social['link']?>";

		</script>
    </head>
    <body>

		<img src="<?=$titleRS['cloudImage']?>"/>

        <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=true"></script>
        <script type="text/javascript" src="js/socialshare.js"></script>
		<script type="text/javascript" src="js/util.js"></script>
        <script type="text/javascript" src="js/index.js"></script>

        <script type="text/javascript">

		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', '<?php if($_SERVER["HTTP_HOST"] != "gibson.loc"): ?>UA-76054-30<?php endif; ?>']);
		  _gaq.push(['_trackPageview']);

		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', '<?php if($_SERVER["HTTP_HOST"] != "gibson.loc"): ?>UA-76054-30<?php endif; ?>', 'auto');
		  ga('send', 'pageview');

		</script>
    </body>
</html>