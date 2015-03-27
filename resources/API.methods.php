<?php
	require_once 'API.class.php';
	// https://github.com/j4mie/idiorm
	require_once "library\idiorm.php";
	require_once "config.php";
	// https://github.com/PHPAuth/PHPAuth
	include("library\auth.class.php");

	class MyAPI extends API
	{
	    protected $User;

		protected $auth;

	    public function __construct($request, $origin) {
	        parent::__construct($request);

			$this->auth = new Auth();	        
	    }



	    protected function login() {
	    	if ($this->method == 'POST') { //returns form data on GET requests

		        	return $this->doLogin();

		        } 
		        else {

		            return parent::_response(Array('error' => "Only accepts POST requests"), 403);

		        }
	    }

	    protected function logout() {
	    	//$this->auth->authenticate(); //check if caller is authorized to use this method
		    return $this->doLogout();
	    }

	    /**
	     * Holds functionality regarding form fields administration
	     * Calls to api/form/
	     */
	     protected function form() {
	     	if($this->verb == 'save'){ //calls to api/form/save

	     		$this->auth->authenticate(true); //check if caller is authorized to use this method

		        if ($this->method == 'POST') { //requires JSON data to be POSTed

		        	return $this->saveFormField();

		        } 
		        else {

		            return parent::_response(Array('error' => "Only accepts POST requests"), 403);

		        }

		    } elseif(isset($this->args[0]) && is_numeric($this->args[0])) { // call to api/form/{id}

				if($this->method == 'GET') { //return form field with given id

					return $this->getFormField();

				} elseif($this->method == 'DELETE') { //delete member with given id

					$this->auth->authenticate(true); //check if caller is authorized to use this method

					return $this->deleteFormField();

				} else { // wrong method

					return parent::_response(Array('error' => 'Only accepts GET or DELETE requests.'), 403);

				}

			} else{ //call to other URI than save: /form/*

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

				$this->auth->authenticate(true); //check if caller is authorized to use this method

				if($this->method == 'POST') {

					return $this->saveMember();

				} else {

					return parent::_response(Array('error' => "Only accepts POST requests"), 403);

				}

			} elseif(isset($this->args[0]) && is_numeric($this->args[0])) { // call to api/member/{id}

				if($this->method == 'GET') { //return member with given id

					try{
						$this->auth->authenticate(true);
					} catch (Exception $e) {
						return $this->getMember();
					}

					return $this->getMember(true);

				} elseif($this->method == 'DELETE') { //delete member with given id

					$this->auth->authenticate(true); //check if caller is authorized to use this method

					return $this->deleteMember();

				} else { // wrong method

					return parent::_response(Array('error' => 'Only accepts GET or DELETE requests.'), 403);

				}

			} else { //call to any other domain: api/member/*
				if ($this->method == 'GET') { // return all members
		        	
		        	try{
						$this->auth->authenticate(true);
					} catch (Exception $e) {
						return $this->getMembers();
					}

		        	return $this->getMembers(true);

		        } 
		        else {

		            return parent::_response(Array('error' => "Only accepts GET requests"), 403);

		        }

			}
		}


		/**
		*	Holds functionality regarding application administration
		*	Calls to api/application
		*/
		protected function application() {
			if($this->verb == 'save') { //call to api/application/save

				if($this->method == 'POST') {

					return $this->saveApplication();

				} else {

					return parent::_response(Array('error' => "Only accepts POST requests"), 403);

				}

			} elseif(isset($this->args[0]) && is_numeric($this->args[0])) { // call to api/application/{id}

				$this->auth->authenticate(); //check if caller is authorized to use this method

				if($this->method == 'GET') { //return member with given id

					return $this->getApplication();

				} elseif($this->method == 'DELETE') { //delete application with given id

					$this->auth->authenticate(true); //check if caller is authorized to use this method

					return $this->deleteApplication();

				} else { // wrong method

					return parent::_response(Array('error' => 'Only accepts GET or DELETE requests.'), 403);

				}
			} else { //call to any other domain: api/member/*
				
				$this->auth->authenticate(); //check if caller is authorized to use this method
				
				if ($this->method == 'GET') { // return all applications

					return $this->getApplications();

		        } 
		        else {

		            return parent::_response(Array('error' => "Only accepts GET requests"), 403);

		        }

			}
		}


		/**
		*	Holds functionality regarding vote administration
		*	Calls to api/member
		*/
		protected function vote() {

			$mId = $this->auth->authenticate(); //check if caller is authorized to use this method

			if($this->verb == 'save') { //call to api/vote/save

				if($this->method == 'POST') {

					return $this->saveVote($mId);

				} else {

					return parent::_response(Array('error' => "Only accepts POST requests"), 403);

				}

			} elseif(isset($this->args[0]) && is_numeric($this->args[0]) && isset($this->args[1]) && is_numeric($this->args[1])) { // call to api/vote/{mid}/{aId}

				if($mId != $this->args[0])
					return parent::_response(Array('error' => "Not allowed to retrieve or delete vote of another member"), 401);

				if($this->method == 'GET') { //return vote for given ids

					return $this->getVote();

				} else { // wrong method

					return parent::_response(Array('error' => 'Only accepts GET requests.'), 403);

				}

			} elseif(isset($this->args[0]) && is_numeric($this->args[0])) { // call to api/vote/{mid}

				if($mId != $this->args[0])
					return parent::_response(Array('error' => "Not allowed to retrieve votes of another member"), 401);

				if($this->method == 'GET') { //return votes for member

					return $this->getVotesByMember();

				} else { // wrong method

					return parent::_response(Array('error' => 'Only accepts GET requests.'), 403);

				}

			} else { //call to any other domain: api/vote/*
				if ($this->method == 'GET') { // return all votes
		        	
					return $this->getVotes();

		        } 
		        else {

		            return parent::_response(Array('error' => "Only accepts GET requests"), 403);

		        }

			}
		}


		/**
		*	Holds functionality regarding vote administration
		*	Calls to api/member
		*/
		protected function question() {

			$mId = $this->auth->authenticate(); //check if caller is authorized to use this method

			if($this->verb == 'save') { //call to api/vote/save

				if($this->method == 'POST') {

					return $this->saveQuestion($mId);

				} else {

					return parent::_response(Array('error' => "Only accepts POST requests"), 403);

				}

			} elseif(isset($this->args[0]) && is_numeric($this->args[0]) && isset($this->args[1]) && is_numeric($this->args[1])) { // call to api/question/{mid}/{aId}

				if($mId != $this->args[0])
					return parent::_response(Array('error' => "Not allowed to retrieve question of another member"), 401);

				if($this->method == 'GET') { //return vote for given ids

					return $this->getQuestionsByMemberAndApplication();

				} else { // wrong method

					return parent::_response(Array('error' => 'Only accepts GET requests.'), 403);

				}

			} elseif(isset($this->args[0]) && is_numeric($this->args[0])) { 

				if($this->method == 'GET') { // call to api/question/{aid} 
					//return votes for member
					return $this->getQuestionsByApplication($mId);

				} elseif($this->method == 'DELETE') {  // call to api/question/{qid} 
					//delete vote for given id
					return $this->deleteQuestion($mId);

				} else { // wrong method

					return parent::_response(Array('error' => 'Only accepts GET requests.'), 403);

				}

			} else { //call to any other domain: api/vote/*
				if ($this->method == 'GET') { // return all votes grouped by application and vote value
		        	
					return $this->getQuestions($mId);

		        } 
		        else {

		            return parent::_response(Array('error' => "Only accepts GET requests"), 403);

		        }

			}
		}




	// LOGIC ----------------------------------------------------------------


		private function doLogin(){
			$input = json_decode($this->file); //decode input JSON

			// check if member name and password are provided
			if(!isset($input->member)) 
				return parent::_response(Array('error' => "Attribute member is missing"), 400);
			if(!isset($input->password)) 
				return parent::_response(Array('error' => "Attribute password is missing"), 400);

			if(!isset($input->remember)) //if no information whether to remember the login is provided, don't
				$remember = false;
			else
				$remember = $input->remember;

			$authResult = $this->auth->login($input->member, $input->password, $remember);

			return parent::_response($authResult[0], $authResult[1]);
		}

		private function doLogout(){
			if($this->auth->logout($_COOKIE[$this->auth->getCookieName()]))
				return parent::_response(Array('info' => 'Logged out successfully.'));
			else
				return parent::_response(Array('error' => 'Logout failed.'), 500);
		}


		// Form fields ------------------------------------------------------

		private function getFormFields(){
			$fields = ORM::for_table('field')->find_array();

			foreach ($fields as $idx => $field) {
				$fields[$idx]['options'] = ORM::for_table('option')->where('fId', $field['fId'])->find_array();
			}

            return parent::_response($fields); //form fields array as JSON object
		}

		private function getFormField(){
			$field = ORM::for_table('field')->where('fId', $this->args[0])->find_one();

			if(!$field) //when no field with this id in db
				return parent::_response(Array('error' => 'Field not found'), 403);

			return parent::_response($field->as_array());
		}

		private function deleteFormField(){
			$field = ORM::for_table('field')->use_id_column('fId')->where('fId', $this->args[0])->find_one();

			if(!$field) //when no field with this id in db
				return parent::_response(Array('error' => 'Field not found'), 403);

			$id = $field->fId;
			$field->delete();
			return parent::_response(Array('information' => 'Field with ID ' . $id . ' was deleted.'));
		}

		private function saveFormField(){
			$input = json_decode($this->file); //decode input JSON
			
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
			if(!isset($input->is_required)) 
				return parent::_response(Array('error' => "Attribute is_required is missing"), 400);


			$field = ORM::for_table('field')->use_id_column('fId')->where('fId', $input->fId)->find_one(); //retrieve by id
			if(!$field) //when new field
				$field = ORM::for_table('field')->create(); //create new object
	
			//update fields
			$field->title = $input->title;
			$field->type = $input->type;
			$field->placeholder = $input->placeholder;
			$field->rank = $input->rank;
			$field->is_required = $input->is_required;
			$field->save();

			//remove old options
			ORM::for_table('option')->where('fId', $field->id())->delete_many();

			if(isset($input->options)) { //if options available
				foreach ($input->options as $option) {
					//check for missing properties
					if(!isset($option->type)) 
						return parent::_response(Array('error' => "Attribute type is missing in option"), 400);
					if(!isset($option->value)) 
						return parent::_response(Array('error' => "Attribute value is missing in option"), 400);

					$o = ORM::for_table('option')->create();
					$o->fId = $field->id(); //retrieve Id of possibly new field via id()
					$o->type = $option->type;
					$o->value = $option->value;
					$o->save();
				}
			}

			$input->fId = $field->id(); //set (possibly) updated fId
		

            return parent::_response($input);
		}


	// Members ---------------------------------------------------------------

		private function getMembers($admin = false) {
			//fetch all, without password
        	$members = ORM::for_table('member')->select_many('mId', 'name', 'admin')->find_array();

        	if(!$admin){
        		foreach ($members as $key => $value) {
        			unset($members[$key]['admin']);
        		}
        	}

            return parent::_response($members);
		}

		private function getMember($admin = false){
			$member = $this->_retrieveMember();

			if(!$member) //when no member with this id in db
				return parent::_response(Array('error' => 'Member not found'), 403);

			$member = $member->as_array();

			if(!$admin)
				unset($member['admin']);

			return parent::_response($member);
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

			if(isset($input->password) && $input->password != ""){  //when new password is defined, set it
				$member->salt = substr(strtr(base64_encode(mcrypt_create_iv(22, MCRYPT_DEV_URANDOM)), '+', '.'), 0, 22);
				$member->password = password_hash($input->password, PASSWORD_BCRYPT, ['salt' => $member->salt, 'cost' => 10]);
			} else //no password defined
				if($input->mId == 0 || $input->mId == "") //if customer is new -> password is required
					return parent::_response(Array('error' => 'A password must be provided when a new member is created.'), 400);
			
			if(isset($input->admin) && is_numeric($input->admin) && ($input->admin == 0 || $input->admin == 1)) //if admin value is correctly defined, set it
				$member->admin = $input->admin;

			$member->save();

			$output = $member->as_array();
			unset($output['password']); //remove password field as it should not be given out from the server
			unset($output['salt']);
			return parent::_response($output);
		}


	// Applications --------------------------------------------------------

		private function getApplication(){
			$application = ORM::for_table('application')->where('aId', $this->args[0])->find_one();

			if(!$application)
				return parent::_response(Array('error' => 'Application not found'), 403);

			$application->answers = ORM::for_table('answer')->where('aId', $this->args[0])->find_array();

			return parent::_response($application->as_array());
		}

		private function getApplications(){
			$applications = ORM::for_table('application')->find_array();

			foreach ($applications as $idx => $application) {
				$applications[$idx]['answers'] = ORM::for_table('answer')->where('aId', $application['aId'])->find_array();
			}

			return parent::_response($applications);
		}

		private function saveApplication(){
			$input = json_decode($this->file); //decode input json

			if(!isset($input->aId))
				return parent::_response(Array('error' => "Attribute aId is missing."), 400);

			if(!isset($input->answers) || !is_array($input->answers)) //if input is no array
        		return parent::_response(Array('error' => "Expecting an array attribute 'answers' with answer objects."), 400);

        	$application = ORM::for_table('application')->use_id_column('aId')->find_one($input->aId); //try to find by id
        	if(!$application) { //when not found in db
				$application = ORM::for_table('application')->use_id_column('aId')->create(); //create new
				$application->save(); //persist, all values are automatically filled in db
			}
			
			$aId = $application->id(); //get Id of new application

			ORM::for_table('answer')->where('aId', $aId)->delete_many(); //delete all previous answers

			//iterate answer objects and persist in db
			foreach ($input->answers as $answer) {
				if(isset($answer->fId) && isset($answer->value)) { //when all information provided
					$a = ORM::for_table('answer')->create();
					$a->aId = $aId;
					$a->fId = $answer->fId;
					$a->value = $answer->value;
					$a->save();
				}
			}

			return parent::_response($aId); //return ID of newly created application
		}

		private function deleteApplication() {
			$application = ORM::for_table('application')->use_id_column('aId')->find_one($this->args[0]);

			if(!$application) //when no application with this id in db
				return parent::_response(Array('error' => 'Application not found'), 403);

			$id = $application->aId;
			$application->delete();
			return parent::_response(Array('information' => 'Application with ID ' . $id . ' was deleted.'));
		}

	// Votes --------------------------------------------------------

		private function getVote(){
			$vote = ORM::for_table('vote')->where(Array('mId' => $this->args[0], 'aId' => $this->args[1]))->find_one();
			if(!$vote)
				return parent::_response(Array('error' => 'Vote not found'), 403);

			return parent::_response($vote->as_array());
		}

		private function getVotesByMember() {
			$votes = ORM::for_table('vote')->where('mId', $this->args[0])->find_array();

			return parent::_response($votes);
		}

		private function getVotes(){
			$votes = ORM::for_table('vote')->select_many('aId', 'value')->select_expr('COUNT(*)', 'count')->group_by('aId')->group_by('value')->find_array();

			return parent::_response($votes);
		}

		private function saveVote($authMId) {
			$input = json_decode($this->file); //decode input json

			//check for missing properties
			if(!isset($input->mId)) 
				return parent::_response(Array('error' => "Attribute mId is missing"), 400);
			if(!isset($input->aId)) 
				return parent::_response(Array('error' => "Attribute aId is missing"), 400);
			if(!isset($input->value)) 
				return parent::_response(Array('error' => "Attribute value is missing"), 400);

			if($authMId != $input->mId)
				return parent::_response(Array('error' => "Not allowed to save votes for other members"), 401);

			if(!ORM::for_table('member')->where('mId', $input->mId)->find_one())
				return parent::_response(Array('error' => 'Member not found'), 403);
			if(!ORM::for_table('application')->where('aId', $input->aId)->find_one())
				return parent::_response(Array('error' => 'Application not found'), 403);

			ORM::for_table('vote')->where(Array('mId' => $input->mId, 'aId' => $input->aId))->delete_many();

			$vote = ORM::for_table('vote')->create();
			$vote->mId = $input->mId;
			$vote->aId = $input->aId;
			$vote->value = $input->value;
			$vote->save();

			return parent::_response($vote->as_array());
		}

	// Questions --------------------------------------------------------

		private function getQuestionsByMemberAndApplication(){
			$questions = ORM::for_table('question')->where(Array('mId' => $this->args[0], 'aId' => $this->args[1]))->find_array();

			return parent::_response($questions);
		}

		private function getQuestionsByApplication($authMId) {
			$questions = ORM::for_table('question')->where('aId', $this->args[0])->find_array();

			foreach ($questions as $key => $question) { //remove member information from questions that are not by the requesting member
				if($question['mId']!=$authMId)
					unset($questions[$key]['mId']);
			}

			return parent::_response($questions);
		}

		private function getQuestions($authMId){
			$questions = ORM::for_table('question')->find_array();

			foreach ($questions as $key => $question) { //remove member information from questions that are not by the requesting member
				if($question['mId']!=$authMId)
					unset($questions[$key]['mId']);
			}

			return parent::_response($questions);
		}

		private function saveQuestion($authMId) {
			$input = json_decode($this->file); //decode input json

			//check for missing properties
			if(!isset($input->qId)) 
				return parent::_response(Array('error' => "Attribute qId is missing"), 400);
			if(!isset($input->mId)) 
				return parent::_response(Array('error' => "Attribute mId is missing"), 400);
			if(!isset($input->aId)) 
				return parent::_response(Array('error' => "Attribute aId is missing"), 400);
			if(!isset($input->value)) 
				return parent::_response(Array('error' => "Attribute value is missing"), 400);

			if($authMId != $input->mId)
				return parent::_response(Array('error' => "Not allowed to save questions for other members"), 401);

			if(!ORM::for_table('member')->where('mId', $input->mId)->find_one())
				return parent::_response(Array('error' => 'Member not found'), 403);
			if(!ORM::for_table('application')->where('aId', $input->aId)->find_one())
				return parent::_response(Array('error' => 'Application not found'), 403);

			$question = ORM::for_table('question')->use_id_column('qId')->find_one($input->qId);
			if(!$question)
				$question = ORM::for_table('question')->create();

			if($authMId != $question->mId)
				return parent::_response(Array('error' => "Not allowed to edit questions of other members"), 401);

			$question->mId = $input->mId;
			$question->aId = $input->aId;
			$question->value = $input->value;
			$question->save();

			$question->qId = $question->id();

			return parent::_response($question->as_array());
		}

		private function deleteQuestion($authMId) {
			$question = ORM::for_table('question')->use_id_column('qId')->find_one($this->args[0]);

			if(!$question) //when no qestion with this id in db
				return parent::_response(Array('error' => 'Question not found'), 403);

			if($authMId != $question->mId)
				return parent::_response(Array('error' => "Not allowed to delete questions for other members"), 401);

			$id = $question->qId;
			$question->delete();
			return parent::_response(Array('information' => 'Question with ID ' . $id . ' was deleted.'));
		}
	}
?>