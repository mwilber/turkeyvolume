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

        <link href='https://fonts.googleapis.com/css?family=Anton' rel='stylesheet' type='text/css'>
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

                <div class="animation">
                    <p class="one">From the creator of JAWS Converter</p>

                    <p class="two">An app that takes animal based measurement into the third dimension</p>

                    <p class="three">Coming November 2015</p> 
                       <form class="three">
                           <label>Receive Updates: </label>
                            <input type="text" id="email" name="email" placeholder="email"/><button>Submit</button>
                        </form>
                </div>

            </div> <!-- #main -->
        </div> <!-- #main-container -->
        
        <div id="footer">
              <a href="policy.php" onclick="ga('send', 'event', 'web', 'click', 'policy', 0);" class="policy">
            Privacy Policy
          </a>
              <a href="#" onclick="window.open('http://www.greenzeta.com/home/listing/product', '_system'); ga('send', 'event', 'web', 'click', 'GreenZeta', 0); return false;" class="gz">
            <span class="badge">&zeta;</span>
            &nbsp;&nbsp;A GreenZeta Production
          </a>
        </div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>
        
        <script type="text/javascript">
            $(document).ready(function(){
               $('.animation form').submit(function(){
                   $.post('./reactor/jsonapi/register',{email:$('#email').val()},function(){
                       $('.animation form').empty().append($('<label>').html("Thank You."));
                   });
                  return false; 
               });
            });
        </script>

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
