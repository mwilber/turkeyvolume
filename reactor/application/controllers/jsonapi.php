<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class JSONAPI extends CI_Controller {

	var $_response;

	function JSONAPI(){

		parent::__construct();

		$this->load->model('user_model');

		$this->_response = new stdClass();
		$this->_response->error = new stdClass();

		$this->_response->error->type = 0;
		$this->_response->error->message = "";

	}

	function _JSONout(){
        //header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
		header('Content-type: application/json');
		echo json_encode($this->_response);
	}

	function _HandleSession($pUserToken = ""){
		if($this->session->userdata('userId') == "" && $pUserToken != ""){
			//Try to restore the user session here
			$this->load->helper('idobfuscator_helper');
			$pUserToken = IdObfuscator::decode($pUserToken);
			$this->user_model->Restore(array('userToken'=>$pUserToken));
		}
		if($this->session->userdata('userId') == ""){
			$this->_response->error->type = -1;
			$this->_response->error->message = "Not logged in";
			return false;
		}else{
			return true;
		}
	}

	function wakeup(){
		$this->_JSONout();
	}

    function share(){

        $model_ref = 'cloud_model';
		$this->load->model($model_ref);
		$this->load->helpers('idobfuscator_helper');

		$json = file_get_contents('php://input');
		$obj = json_decode($json);

        $obj->cloudName = "CrashOverride";

		if( !isset($obj->cloudHeight)){
			$obj->cloudHeight = 0;
		}
		if( !isset($obj->cloudWidth)){
			$obj->cloudWidth = 0;
		}
		if( !isset($obj->cloudDepth)){
			$obj->cloudDepth = 0;
		}
		$obj->cloudDataStart = $obj->cloudHeight."x".$obj->cloudWidth."x".$obj->cloudDepth;


        $this->_response->request = $obj;
        if( isset($obj->cloudImage)){
        if( $obj->cloudImage != "" ){
            $imageData = explode('base64,',$obj->cloudImage);
            $imageData = $this->$model_ref->manageFile64($imageData[1], UPLOAD_DIR, '');
            $this->load->library('s3');
            $obj->cloudImage = $this->s3->upload(UPLOAD_DIR."/".$imageData, $imageData);
        }
        // Validation passes
        $nId = $this->$model_ref->Add(array('cloudName'=>$obj->cloudName,'cloudImage'=>$obj->cloudImage,'cloudDataStart'=>$obj->cloudDataStart));
        $this->_response->id = IdObfuscator::encode($nId);
		$this->_response->url = str_replace("reactor/", "", base_url())."t/".$this->_response->id;
		$this->_response->img = $obj->cloudImage;
        }



		$this->_JSONout();

		//list.shoplistId
	}

	function register(){
		
		$this->_response->error->type = -1;
		$this->_response->error->message = "no address";
		
		if(isset($_POST['email'])){
			$this->load->model('profile_model');
			$nId = $this->profile_model->Add(array('profileEmail'=>$_POST['email']));
			$this->_response->error->type = 0;
			$this->_response->error->message = "success";
		}
		
		$this->_JSONout();
	}




}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
