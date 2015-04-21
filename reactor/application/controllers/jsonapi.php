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


    function share(){

        $model_ref = 'cloud_model';
		$this->load->model($model_ref);
		$this->load->helpers('idobfuscator_helper');

		$json = file_get_contents('php://input');
		$obj = json_decode($json);

        $obj->cloudName = "CrashOverride";

        $this->_response->request = $obj;
        if( isset($obj->cloudImage)){
        if( $obj->cloudImage != "" ){
            $imageData = explode('base64,',$obj->cloudImage);
            $imageData = $this->$model_ref->manageFile64($imageData[1], UPLOAD_DIR, '');
            $this->load->library('s3');
            $obj->cloudImage = $this->s3->upload(UPLOAD_DIR."/".$imageData, $imageData);
        }
        // Validation passes
        $nId = $this->$model_ref->Add(array('cloudName'=>$obj->cloudName,'cloudImage'=>$obj->cloudImage));
        $this->_response->id = IdObfuscator::encode($nId);
		$this->_response->url = base_url()."/".$this->_response->id;
        }



		$this->_JSONout();

		//list.shoplistId
	}






}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
