<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cloud extends CI_Controller
{
	var $profile = array(
        'model' => 'cloud_model',
        );

	// Create
	function add($pFormat="html")
	{
		header('Access-Control-Allow-Origin: *');

		$json = file_get_contents('php://input');
		$obj = json_decode($json);

		if( isset($obj->cloudName )){
		$POST['cloudName'] = $obj->cloudName;
		$POST['cloudImage'] = $obj->cloudImage;
		$POST['cloudDataStart'] = $obj->cloudDataStart;
		$POST['cloudDataFinish'] = $obj->cloudDataFinish;
		$POST['profileId'] = $obj->profileId;
		$POST['cloudComment'] = $obj->cloudComment;
		$POST['checkinTwitter'] = $obj->checkinTwitter;
		$POST['decoy'] = $obj->decoy;
	}

		$model_ref = $this->profile['model'];
		$this->load->model($model_ref);

		$response = new stdClass();
		$response->status = 1;

		$data['format'] = $pFormat;
		$data['fields'] = $this->$model_ref->_fields();
		$data['lookups'] = array();

		foreach( $this->$model_ref->_fields() as $name=>$props ){
			if(substr_compare($name, 'Id', -2, 2) === 0){
				if(file_exists(APPPATH."models/".substr($name, 0, -2)."_model.php")){
					// Load up dropdown menu data for join fields
					$modelName = substr($name, 0, -2)."_model";
					$this->load->model($modelName);
					$data['lookups'][$name] = $this->$modelName->_GetRef();
				}
			}
		}

		$share = array();

    	if( isset($_POST['checkinTwitter']) ){
    		if($_POST['checkinTwitter'] == 1){
    			$share['Twitter'] = 1;
    		}
    		unset($_POST['checkinTwitter']);
    	}

		unset($_POST['decoy']);


	    // Validate form
	    $this->form_validation->set_rules($this->$model_ref->_rq(), 'required', 'trim|required');

	    if($this->form_validation->run())
	    {


			//////////////////////////////////////////////////////////////////////
	    	// Do any record preprocessing here
	    	//////////////////////////////////////////////////////////////////////

			if( $_POST['cloudImage'] != "" ){

				$imageData = explode('base64,',$_POST['cloudImage']);
				$imageData = $this->$model_ref->manageFile64($imageData[1], UPLOAD_DIR, '');

				// Image processing code from TPI. Scales and crops the image to square
//	    		$imageData = $this->$model_ref->manageFile64($_POST['checkinPhoto'], UPLOAD_DIR);
//
//				//Process the image here
//				$this->load->helper('ImageWorkshop');
//				$twitterLayer = new ImageWorkshop(array(
//				    'imageFromPath' => UPLOAD_DIR."/".$imageData,
//				));
//
//				// Resize the image so the smallest dimension equals the desired dimension
//				if( $twitterLayer->getWidth() > $twitterLayer->getHeight() ){
//					$twitterLayer->resizeInPixel(null, 1024, true);
//				}else{
//					$twitterLayer->resizeInPixel(1024, null, true);
//				}
//				$twitterLayer->cropInPixel(1024, 1024, 0, 0, 'MM');
//
//				$image = $twitterLayer->getResult();
//
//				//header('Content-type: image/jpeg');
//				//imagejpeg($image, null, 95); // JPG with a quality of 95%
//				$twitterLayer->save(UPLOAD_DIR."/", $imageData, CREATE_FOLDERS, BACKGROUND_COLOR, JPEG_IMAGE_QUALITY);
//
				$this->load->library('s3');
				$_POST['cloudImage'] = $this->s3->upload(UPLOAD_DIR."/".$imageData, $imageData);
	    	}else{
	    		
	    	}


	        // Validation passes
	        $nId = $this->$model_ref->Add($_POST);
	        $response->id = $nId;

	        // Verify the record is there
        	$data['record'] = $this->$model_ref->Get(array($this->$model_ref->_pk() => $nId));

        	$this->load->model('auth_model');
        	//$this->load->model('prize_model');
			$this->load->helpers('idobfuscator_helper');
        	$authRecs = $this->auth_model->Get(array('profileId'=>$_POST['profileId']));
        	//$prizeRec = $this->prize_model->Get(array('prizeId'=>$_POST['prizeId']));

        	$prizeName = $_POST['cloudName'];

        	//if( isset($prizeRec->prizeName) ){
        	//	$prizeName = $prizeRec->prizeName;
        	//}

        	$prizeUrl = "http://www.cloud-artist.com/ck/".IdObfuscator::encode($nId);

        	foreach ($authRecs as $authRec) {
        		if( isset($share['Twitter']) ){
					switch ($authRec->authService) {
						case 'Facebook':
							$response->facebook = new stdClass();
							 $attachment =  array(
								 'access_token' => $authRec->authToken,
								 'message' => $_POST['cloudComment'],
								 'name' => $prizeName,
								 'link' => $prizeUrl,
								 'description' => 'Get the app and create your own cloud at Cloud-Artist.com',
								 'picture'=>$_POST['cloudImage'],
								 //'actions' => json_encode(array('name' => $action_name,'link' => $action_link))
								 );

							$response->facebook->attachment = $attachment;

							$ch = curl_init();
							curl_setopt($ch, CURLOPT_URL,'https://graph.facebook.com/me/feed');
							curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
							curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
							curl_setopt($ch, CURLOPT_POST, true);
							curl_setopt($ch, CURLOPT_POSTFIELDS, $attachment);
							curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  //to suppress the curl output
							$result = curl_exec($ch);
							curl_close ($ch);

							$response->facebook->result = $result;

							break;

						case 'Twitter':
							$response->twitter = new stdClass();
							//$twitterTxt = "Check out my ".$prizeName." on The Prize Inside";
							$twitterTxt = "";
							if( $_POST['cloudComment'] != "" ) $twitterTxt = $_POST['cloudComment'];

							// Reduce to 110 chars
							if(strlen($twitterTxt) > 110) substr($twitterTxt,0,105).'...';

							// Set tmhOAuth config object
							$tmhOAuthConfig = array(
							  'consumer_key'    => 'eGxn56PqJxBoizNIf4qQJa9FQ',
							  'consumer_secret' => '7GbgkKfZeSgnSikpKWYZJFp6CwJNjn4pY7cNKF0Vff29PjgPCM',
							  'user_token'      => $authRec->authToken,
							  'user_secret'     => $authRec->authSecret,
							);

							$this->load->library('TmhOAuth', $tmhOAuthConfig);
							$code="0";
							//echo '<br/>Making call: '.$code.'<br/>';
							$code = $this->tmhoauth->request(
								   'POST',
								   'https://api.twitter.com/1.1/statuses/update.json',
								   array(
						 //		    'media[]'  => "@{$outFile};type=image/jpeg;filename={$outFile}",
								     'status'   => $twitterTxt.": ".$prizeUrl
								   ),
								   true, // use auth
								   true  // multipart
								 );

							$response->twitter->code = $code;
							$response->twitter->response = $this->tmhoauth->response;

							break;

						case 'Foursquare':
							$response->foursquare = new stdClass();
							if( $_POST['checkinLocation'] != "" ){

								 $attachment =  array(
									 'oauth_token' => $authRec->authToken,
									 'shout' => $_POST['cloudComment']." ".$prizeUrl,
									 'venueId' => $_POST['checkinLocation'],
									 'v' => '20140128',
									 //'actions' => json_encode(array('name' => $action_name,'link' => $action_link))
									 );

								$response->foursquare->attachment = $attachment;

								$ch = curl_init();
								curl_setopt($ch, CURLOPT_URL,'https://api.foursquare.com/v2/checkins/add');
								curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
								curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
								curl_setopt($ch, CURLOPT_POST, true);
								curl_setopt($ch, CURLOPT_POSTFIELDS, $attachment);
								curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  //to suppress the curl output
								$result = curl_exec($ch);
								curl_close ($ch);

								$response->foursquare->response = $result;

							}

							break;

						default:

							break;
					}/*end switch */
				}
			}

			if($pFormat == "html"){
				if($nId)
		        {
		            $this->session->set_flashdata('flashConfirm', 'The item has been successfully added.');
		           redirect($this->uri->segment(1));
		        }
		        else
		        {
	                $this->session->set_flashdata('flashError', 'A database error has occured, please contact your administrator.');
		            redirect($this->uri->segment(1));
		        }
			}elseif($pFormat == "xml"){
				// TODO: see if we can redirect with flash
				//redirect($this->uri->segment(1)."/details/xml/".$nId);

				$this->details("xml", $nId);
			}else{
				//redirect($this->uri->segment(1)."/get/".$nId);
				header('Content-type: application/json');
				echo json_encode($response);
			}
	    }else{
	    	$this->load->view('template/template_head');
		    $this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_add_form', $data);
			$this->load->view('template/template_foot');
	    }
	}

    // Retrieve
	function index($pFormat="html")
	{
		$model_ref = $this->profile['model'];
		$this->load->model($model_ref);
		$this->load->helpers('idobfuscator_helper');

		$data['total_rows'] = $this->$model_ref->Get(array('count' => true));
		$data['records'] = $this->$model_ref->Get(array('sortBy'=>$this->$model_ref->_ds(),'sortDirection'=>'DESC'));
		$data['fields'] = $this->$model_ref->_fields();
		$data['pk'] = $this->$model_ref->_pk();
		
		foreach($data['records'] as $record){
			$record->hash = IdObfuscator::encode($record->cloudId);
		}

		if($pFormat == "html"){
			if( $this->session->userdata('userEmail') ){
				$this->load->view('template/template_head');
				$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_index', $data);
				$this->load->view('template/template_foot');
			}else{
				redirect('admin/login');
			}

		}elseif($pFormat == "xml"){
			$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_index_xml', $data);
		}


	}

	function detail($pId=0,$pFormat="html"){
		$model_ref = $this->profile['model'];
		$this->load->model($model_ref);
		$data['record'] = $this->$model_ref->Get(array($this->$model_ref->_pk()=>$pId));

		if( $pFormat=='json' ){
			header('Content-type: application/json');
			echo json_encode($data['record']);
		}elseif( $pFormat=='html' ){
			echo '<ul>';
			foreach(get_object_vars($data['record']) as $field=>$value){
				echo "<li>{$field}: {$value}</li>";
			}
			echo '</ul>';
		}
	}


	function csv($pFormat="html")
	{
		$model_ref = $this->profile['model'];
		$this->load->model($model_ref);


		$data['total_rows'] = $this->$model_ref->Get(array('count' => true));
		$data['records'] = $this->$model_ref->Get(array('sortBy'=>$this->$model_ref->_ds(),'sortDirection'=>'ACS'));
		$data['fields'] = $this->$model_ref->_fields();
		$data['pk'] = $this->$model_ref->_pk();

		$header = "";
		$filedata = "";
		foreach($data['records'][0] as $name=> $value)
		{
		    $header .= $name . "\t";
		}

		foreach($data['records'] as $row)
		{
		    $line = '';
		    foreach( $row as $value )
		    {
		        if ( ( !isset( $value ) ) || ( $value == "" ) )
		        {
		            $value = "\t";
		        }
		        else
		        {
		            $value = str_replace( '"' , '""' , $value );
		            $value = '"' . $value . '"' . "\t";
		        }
		        $line .= $value;
		    }
		    $filedata .= trim( $line ) . "\n";
		}
		$filedata = str_replace( "\r" , "" , $filedata );

		if ( $filedata == "" )
		{
		    $filedata = "\n(0) Records Found!\n";
		}

		header("Content-type: application/octet-stream");
		header("Content-Disposition: attachment; filename=".$this->uri->segment(1)."_export.xls");
		header("Pragma: no-cache");
		header("Expires: 0");
		print "$header\n$filedata";



	}


	function paginated($offset = 0)
	{
		$model_ref = $this->profile['model'];
		$this->load->model($model_ref);

	    $this->load->library('pagination');

	    $perpage = 10;

	    $config['base_url'] = base_url() . $this->uri->segment(1).'/index/';
	    $config['total_rows'] = $this->$model_ref->Get(array('count' => true));
	    $config['per_page'] = $perpage;
	    $config['uri_segment'] = 3;

	    $this->pagination->initialize($config);

	    $data['pagination'] = $this->pagination->create_links();

		$data[$this->uri->segment(1)] = $this->$model_ref->Get(array('sortBy'=>'order','sortDirection'=>'ASC','limit' => $perpage, 'offset' => $offset));
		$data['fields'] = $this->$model_ref->_fields();
		$data['pk'] = $this->$model_ref->_pk();

		$this->load->view('template/template_head');
		$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_paginated', $data);
		$this->load->view('template/template_foot');

	}

	// Update
	function edit($recordId)
	{
		$model_ref = $this->profile['model'];
		$this->load->model($model_ref);

		$data['fields'] = $this->$model_ref->_fields();
		$data['pk'] = $this->$model_ref->_pk();
		$data['rq'] = $this->$model_ref->_rq();

		$data['lookups'] = array();

		foreach( $this->$model_ref->_fields() as $name=>$props ){
			if(substr_compare($name, 'Id', -2, 2) === 0){
				if(file_exists(APPPATH."models/".substr($name, 0, -2)."_model.php")){
					// Load up dropdown menu data for join fields
					$modelName = substr($name, 0, -2)."_model";
					$this->load->model($modelName);
					$data['lookups'][$name] = $this->$modelName->_GetRef();
				}
			}
		}

		$data['record'] = $this->$model_ref->Get(array($this->$model_ref->_pk() => $recordId));
	    if(!$data['record']) redirect($this->uri->segment(1));

		// Validate form
	    $this->form_validation->set_rules($this->$model_ref->_rq(), 'required', 'trim|required');

	    if($this->form_validation->run())
		{
	        // Validation passes
	        $_POST[$this->$model_ref->_pk()] = $recordId;

	        if($this->$model_ref->Update($_POST))
	        {
	            $this->session->set_flashdata('flashConfirm', 'The user has been successfully updated.');
	            redirect($this->uri->segment(1));
	        }
	        else
	        {
                $this->session->set_flashdata('flashError', 'A database error has occured, please contact your administrator.');
	            redirect($this->uri->segment(1));
	        }
	    }

		$this->load->view('template/template_head');
		$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_edit_form', $data);
		$this->load->view('template/template_foot');
	}

	// Delete
	function delete($recordId)
	{
		$model_ref = $this->profile['model'];
		$this->load->model($model_ref);

	    $data['record'] = $this->$model_ref->Get(array($this->$model_ref->_pk() => $recordId));
	    if(!$data['record']) redirect($this->uri->segment(1));

	    $this->$model_ref->Delete($recordId);

	    $this->session->set_flashdata('flashConfirm', 'The user has been successfully deleted.');
	    redirect($this->uri->segment(1));
	}

	function get($recordId)
	{
		$model_ref = $this->profile['model'];
		$this->load->model($model_ref);
		$this->load->model('profile_model');
		$this->load->helpers('idobfuscator_helper');

		$response = new stdClass();
		$response->id = $recordId;

	    $response->data = $this->$model_ref->Get(array($this->$model_ref->_pk() => $recordId));
		$response->data->cloudDataStart = json_decode($response->data->cloudDataStart);
		$response->data->cloudDataFinish = json_decode($response->data->cloudDataFinish);

		$response->profile = $this->profile_model->Get(array('profileId'=>$response->data->profileId));
		unset($response->data->profileId);

		$response->data->cloudId = IdObfuscator::encode($response->data->cloudId);
		$response->data->cloudLink = "http://www.cloud-artist.com/ck/".$response->data->cloudId;

	    header('Content-type: application/json');
		echo json_encode($response);
	}

	function listing($pProfileId = 0)
	{
		$model_ref = $this->profile['model'];
		$this->load->model($model_ref);

	    $response = new stdClass();
	    $response->data = $this->$model_ref->Get(array('profileId'=>$pProfileId,'sortBy'=>$this->$model_ref->_ds(),'sortDirection'=>'DESC'));

		foreach ($response->data as $key => $value) {
			unset($response->data[$key]->cloudDataStart);
			unset($response->data[$key]->cloudDataFinish);
			$response->data[$key]->cloudTimeStamp = date('d M Y', strtotime($response->data[$key]->cloudTimeStamp));
		}

	    header('Content-type: application/json');
		echo json_encode($response);
	}
}
