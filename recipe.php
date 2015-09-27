<?php

	$listTitle = "Turkey Volume Guessing App";

	$social = array();
	$social['title'] = "Turkey Volume Guessing App";
	$social['description'] = "From the creator of JAWS Converter. An app that takes animal based measurement into the third dimension. Coming November 2015.";
	$social['image'] = "http://www.turkeyvolumeguessingapp.com/img/social.gif";
	$social['link'] = "http://www.turkeyvolumeguessingapp.com".$_SERVER[REQUEST_URI];
?>
<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
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
		<meta name="twitter:title" content="<?=$social['title']?>">
		<meta name="twitter:description" content="<?=$social['description']?>">
		<meta name="twitter:creator" content="@greenzeta">
		<meta name="twitter:image:src" content="<?=$social['image']?>">
		<meta name="twitter:domain" content="turkeyvolumeguessingapp.com">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <link href='https://fonts.googleapis.com/css?family=Anton' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="css/normalize.min.css">
		<link rel="stylesheet" type="text/css" media="all" href="css/responsiveboilerplate.css">
        <link rel="stylesheet" href="css/recipe.css">
		<script type="text/javascript">
            var idx=0;
			var to;
            function Init(){
                SetSlide(0);
				to = setInterval(function(){SetSlide(-1);},3000);
            }
            function SetSlide(pOff){
                idx+=pOff;
                if(idx>0){ idx=-4; }else if(idx<-4){ idx=0; }
                document.getElementById('slide').style.transform = 'translate('+(idx*320)+'px,0px)';
            }
        </script>
        <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
    </head>
    <body onload="Init();">
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

		<div id="banner_group" style="height: 90px; margin-bottom: 10px;">
	<div id="gzad_container" style="position:absolute; z-index:10000; margin: 0px; width: 100%; height:100%; -webkit-transition: height 0.25s linear 0.25s, -webkit-transform 0.25s linear 0.25s; transition: height 0.25s linear 0.25s, transform 0.25s linear 0.25s;">
	<a id="banner_close" href="#" onclick="GZAD_collapse(); return false;" class="banner_close fa fa-times" style="margin-top:75px; margin-left:90%; display: none; position: absolute; width: 36px; height: auto; z-index: 60000; background: #000; border-radius: 50%; border: solid 2px #fff; color: #fff; font-size: 24px; font-weight: bold; text-decoration: none; text-align: center; line-height: 32px;"></a>
	<iframe id="gzad_banner" src="" scrolling="no" border="0" marginwidth="0" style="width:100%; height:100%; /*border:solid 1px #e3343f;*/ margin-bottom:0px; position: absolute; padding:0px; overflow: hidden; -webkit-transition: height 0.25s linear 0.25s, -webkit-transform 0.25s linear 0.25s; transition: height 0.25s linear 0.25s, transform 0.25s linear 0.25s;  -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;" frameborder="0"></iframe>
	</div>
	</div>
	<script type="text/javascript">
		function GZAD_externallink(pURL){
		    //'?utm_source=gzad&utm_medium=app&utm_campaign=gzad_banner'
		    window.open(pURL,'_system');
		}

		function GZAD_expand(){
		    //alert('expand here');
		    //$('#banner_group').addClass('expanded');
		    document.getElementById('gzad_container').style.height = '100%';
		    document.getElementById('banner_close').style.display = "block";
		}

		function GZAD_collapse(){
		    //alert('expand here');
		    document.getElementById('gzad_container').style.height = '90px';
		    document.getElementById('banner_close').style.display = "none";
		}
		//$(document).ready(function(){
			var al = 'https://s3.amazonaws.com/gzads/live.html';
			var ifrm = document.getElementById('gzad_banner');
			var request = new XMLHttpRequest();
			request.open('GET', al, true);

			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
				    // Success!
					ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
					ifrm.document.open();
					ifrm.document.write(request.responseText);
					ifrm.document.close();
					setTimeout(function(){GZAD_collapse();},10000)
					} else {
					// We reached our target server, but it returned an error
					document.getElementById('gzad_banner').src = 'https://s3.amazonaws.com/gzads/backup.html';
					}
			};

			request.onerror = function() {
					// There was a connection error of some sort
					document.getElementById('gzad_banner').src = 'https://s3.amazonaws.com/gzads/backup.html';
			};

			request.send();

		//});
	</script>

		<div class="container">
			<div class="content">
				<div id="content" class="col12 clearfix">
					<div id="logo">
						<h1><img src="./img/logo_512.png"/> Turkey Volume Guessing App</h1>
					</div>
				</div>
			</div> <!-- #main -->
			<div class="content">
				<div class="col3">&nbsp;</div>
				<div id="recipe" class="col6">
					<div style="padding:5%">
						INSERTRECIPEHERE
					</div>
				</div>
				<div class="col3">&nbsp;</div>
			</div> <!-- #main -->
		</div> <!-- #main-container -->

        <div id="footer">
              <a href="#" onclick="window.open('http://www.greenzeta.com/home/listing/product', '_system'); ga('send', 'event', 'web', 'click', 'GreenZeta', 0); return false;" class="gz">
            <span class="badge">&zeta;</span>
            &nbsp;&nbsp;A GreenZeta Production
          </a>
        </div>
		<div style="clear:both;"></div>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>


        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script type="text/javascript">

		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', '<?php if($_SERVER["HTTP_HOST"] != "gibson.loc"): ?>UA-76054-32<?php endif; ?>']);
		  _gaq.push(['_trackPageview']);

		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', '<?php if($_SERVER["HTTP_HOST"] != "gibson.loc"): ?>UA-76054-32<?php endif; ?>', 'auto');
		  ga('send', 'pageview');

		</script>
    </body>
</html>
