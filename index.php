<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <link rel="stylesheet" href="css/normalize.min.css">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div class="main-container">
            <div class="main wrapper clearfix">

                <canvas id="volumizer" width="500" height="500"></canvas>
                <a href="#" onclick="tkyVol.Fill(); return false;">Fill</a>
                <a id="btn_height" href="#">Set Height</a>
                <a id="btn_width" href="#">SetWidth</a>
                <a id="btn_depth" href="#">0</a>
            </div> <!-- #main -->
        </div> <!-- #main-container -->

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>
		<script src="https://code.createjs.com/createjs-2014.12.12.min.js"></script>
        <script src="js/cTurkeyVol.js"></script>
        <script type="text/javascript">
            var tkyVol;
            $(document).ready(function(){
                tkyVol = new TurkeyVol();

                $("#btn_height").click(function(){
                    var th = prompt("enter height");
                    tkyVol.InitDim('h',th);
                    return false;
                });

                $("#btn_width").click(function(){
                    var tw = prompt("enter width");
                    tkyVol.InitDim('w',tw);
                    return false;
                });

                $(document).bind("seth", function(){
                    $("#btn_height").html(parseFloat(tkyVol.GetDim('h')).round(1));
                });
                $(document).bind("setw", function(){
                    $("#btn_width").html(parseFloat(tkyVol.GetDim('w')).round(1));
                });
                $(document).bind("setd", function(){
                    $("#btn_depth").html(parseFloat(tkyVol.GetDim('d')).round(1));
                });

            });

            Number.prototype.round = function(p) {
                p = p || 10;
                return parseFloat( this.toFixed(p) );
            };

            //function isNumeric(n) {
            //  return !isNaN(parseFloat(n)) && isFinite(n);
            //}
        </script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X','auto');ga('send','pageview');
        </script>
    </body>
</html>
