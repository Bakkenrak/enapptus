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
	     */
	     protected function form($in) {
	     	if($this->verb == 'save'){ //Save Form fields

		        if ($this->method == 'POST') { //requires JSON data to be POSTed
		        	
		        	$inputs = json_decode(file_get_contents('php://input'));
		        	if(!is_array($inputs)) 
		        		return parent::_response(Array('error' => "Expecting an array of field objects."), 400);

		        	$new_ids = array();

					foreach ($inputs as $input) { //expects array of fields
						
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

						//Array containing the (new) IDs of the persisted fields
						array_push($new_ids, intval($field->id()));
					}

		            return parent::_response($new_ids); //(new) IDs for update in front-end
		        } 
		        else {
		            return parent::_response(Array('error' => "Only accepts POST requests"), 403);
		        }

		    }
		    else{ //call to other URI than save: /form/*

		    	if ($this->method == 'GET') { //returns form data on GET requests
		        	
		        	$fields = ORM::for_table('field')->find_array();

					$i = 0;
					foreach ($fields as $idx => $field) {
						$fields[$idx]['option'] = ORM::for_table('option')->where('fId', $field['fId'])->find_array();
					}

		            return parent::_response($fields); //form fields array as JSON object
		        } 
		        else {
		            return parent::_response(Array('error' => "Only accepts GET requests"), 403);
		        }

		    }
		}
	}
?>