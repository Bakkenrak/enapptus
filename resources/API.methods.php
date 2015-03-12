<?php
	require_once 'API.class.php';
	require_once "library\idiorm.php";
	require_once "config.php";

	class MyAPI extends API
	{
	    protected $User;

	    public function __construct($request, $origin) {
	        parent::__construct($request);

	        //Authentication could go here
	    }

	    /**
	     * Holds functionality regarding form fields administration
	     * Calls to api/form/
	     */
	     protected function form() {
	     	if($this->verb == 'save'){ //calls to api/form/save

		        if ($this->method == 'POST') { //requires JSON data to be POSTed

		        	return $this->saveFormFields();

		        } 
		        else {

		            return parent::_response(Array('error' => "Only accepts POST requests"), 403);

		        }

		    }
		    else{ //call to other URI than save: /form/*

		    	if ($this->method == 'GET') { //returns form data on GET requests

		        	return $this->getFormFields();

		        } 
		        else {

		            return parent::_response(Array('error' => "Only accepts GET requests"), 403);

		        }
		    }
		}

		/**
		*	Holds functionality regarding member administration
		*	Calls to api/member
		*/
		protected function member() {
			if($this->verb == 'save') { //call to api/member/save

				if($this->method == 'POST') {

					return $this->saveMember();

				} else {

					return parent::_response(Array('error' => "Only accepts POST requests"), 403);

				}

			} elseif(isset($this->args[0]) && is_numeric($this->args[0])) { // call to api/member/{number}

				if($this->method == 'GET') { //return member with given id

					return $this->getMember();

				} elseif($this->method == 'DELETE') { //delete member with given id

					return $this->deleteMember();

				} else { // wrong method

					return parent::_response(Array('error' => 'Only accepts GET or DELETE requests.'), 403);

				}

			} else { //call to any other domain: api/member/*
				if ($this->method == 'GET') { // return all members
		        	
		        	return $this->getMembers();

		        } 
		        else {

		            return parent::_response(Array('error' => "Only accepts GET requests"), 403);

		        }

			}
		}



	// LOGIC ----------------------------------------------------------------

		// Form fields ------------------------------------------------------

		private function getFormFields(){
			$fields = ORM::for_table('field')->find_array();

			foreach ($fields as $idx => $field) {
				$fields[$idx]['option'] = ORM::for_table('option')->where('fId', $field['fId'])->find_array();
			}

            return parent::_response($fields); //form fields array as JSON object
		}

		private function saveFormFields(){
			$inputs = json_decode($this->file); //decode input JSON

        	if(!is_array($inputs)) //if input is no array
        		return parent::_response(Array('error' => "Expecting an array of field objects."), 400);

			foreach ($inputs as $idx => $input) { //expects array of fields
				
				//check for missing properties
				if(!isset($input->fId)) 
					return parent::_response(Array('error' => "Attribute fId is missing"), 400);
				if(!isset($input->title)) 
					return parent::_response(Array('error' => "Attribute title is missing"), 400);
				if(!isset($input->type)) 
					return parent::_response(Array('error' => "Attribute type is missing"), 400);
				if(!isset($input->placeholder)) 
					return parent::_response(Array('error' => "Attribute placeholder is missing"), 400);
				if(!isset($input->rank)) 
					return parent::_response(Array('error' => "Attribute rank is missing"), 400);


				if($input->fId == "" || $input->fId == 0) { //when new field
					$field = ORM::for_table('field')->create(); //create new object
				}
				else {
					$field = ORM::for_table('field')->use_id_column('fId')->where('fId',$input->fId)->find_one(); //retrieve by id
					if(!$field) //when no field with this id in db
						$field = ORM::for_table('field')->create(); //create new object
				}
				//update fields
				$field->title = $input->title;
				$field->type = $input->type;
				$field->placeholder = $input->placeholder;
				$field->rank = $input->rank;
				$field->save();

				//remove old options
				ORM::for_table('option')->where('fId', $field->id())->delete_many();

				if(isset($input->options)) { //if options available
					foreach ($input->options as $option) {
						$o = ORM::for_table('option')->create();
						$o->fId = $field->id(); //retrieve Id of possibly new field via id()
						$o->type = $option->type;
						$o->value = $option->value;
						$o->save();
					}
				}

				$inputs[$idx]->fId = $field->id(); //set (possibly) updated fId
			}

            return parent::_response($inputs);
		}


		// Members ---------------------------------------------------------------

		private function getMembers() {
			//fetch all, without password
        	$members = ORM::for_table('member')->select_many('mId', 'name', 'admin')->find_array();
            return parent::_response($members);
		}

		private function getMember(){
			$member = $this->_retrieveMember();

			if(!$member) //when no member with this id in db
				return parent::_response(Array('error' => 'Member not found'), 403);

			return parent::_response($member->as_array());
		}

		private function deleteMember(){
			$member = $this->_retrieveMember();

			if(!$member) //when no member with this id in db
				return parent::_response(Array('error' => 'Member not found'), 403);

			$id = $member->mId;
			$member->delete();
			return parent::_response(Array('information' => 'Member with ID ' . $id . ' was deleted.'));
		}

		private function _retrieveMember(){
			//try fetching member by the given ID, not fetching the password
			$member = ORM::for_table('member')->use_id_column('mId')->where('mId',$this->args[0])->select_many('mId', 'name', 'admin')->find_one();

			return $member;
		}

		private function saveMember() {
			$input = json_decode($this->file); //decode input json

			//check for missing properties
			if(!isset($input->mId)) 
				return parent::_response(Array('error' => "Attribute mId is missing"), 400);
			if(!isset($input->name)) 
				return parent::_response(Array('error' => "Attribute name is missing"), 400);

			$member = ORM::for_table('member')->use_id_column('mId')->where('mId',$input->mId)->find_one(); //try fetching member from db
			if(!$member) //when no member with this id in the db
				$member = ORM::for_table('member')->create(); //create new one

			$member->name = $input->name;

			if(isset($input->password) && $input->password != "")  //when new password is defined, set it
				$member->password = $input->password;
			else //no password defined
				if($input->mId == 0 || $input->mId == "") //if customer is new -> password is required
					return parent::_response(Array('error' => 'A password must be provided when a new member is created.'), 400);
			
			if(isset($input->admin) && is_numeric($input->admin) && ($input->admin == 0 || $input->admin == 1)) //if admin value is correctly defined, set it
				$member->admin = $input->admin;

			$member->save();

			$output = $member->as_array();
			unset($output['password']); //remove id field as it should not be given out from the server
			return parent::_response($output);
		}
	}
?>