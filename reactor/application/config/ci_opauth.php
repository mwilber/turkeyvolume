<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$config['opauth_config'] = array(
    'path' => '/reactor/oauth/login/', //example: /ci_opauth/auth/login/
	'callback_url' => '/reactor/oauth/authenticate/', //example: /ci_opauth/auth/authenticate/
    'callback_transport' => 'post', //Codeigniter don't use native session
    'security_salt' => 'b0nh3ad!',
    'debug' => false,
    'Strategy' => array( //comment those you don't use
        'Twitter' => array(
            'key' => 'eGxn56PqJxBoizNIf4qQJa9FQ',
            'secret' => '7GbgkKfZeSgnSikpKWYZJFp6CwJNjn4pY7cNKF0Vff29PjgPCM'
        ),
        'Facebook' => array(
            'app_id' => '653498184686265',
            'app_secret' => '62f3b2a892e5ebef4383912e5102a828',
            'scope' => 'publish_stream,user_photos,user_friends'
        )
        //'Foursquare' => array(
		//    'client_id' => 'UMRUA4UFFY0RLEI1TKGXUT30JLQULNFRM3YVQWNCASQ3VE31',
		//    'client_secret' => '4XSWL2PUIN02A3RNJY4GFRCLISF4RPC3URLVLHK2AOQD0EQ5'
		//)
        //'Google' => array(
        //    'client_id' => 'client_id',
        //    'client_secret' => 'client_secret'
        //),
        //'OpenID' => array(
		//	'openid_url' => 'openid_url'
		//)
    )
);

/* End of file ci_opauth.php */
/* Location: ./application/config/ci_opauth.php */
