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
		        	if(!is_array($inputs)) return Array('error' => "Expecting an array of field objects.");

		        	$new_ids = array();

					foreach ($inputs as $input) { //expects array of fields
						
						//check for 
						if(!isset($input->fId)) return Array('error' => "Attribute fId is missing");
						if(!isset($input->title)) return Array('error' => "Attribute title is missing");
						if(!isset($input->type)) return Array('error' => "Attribute type is missing");
						if(!isset($input->placeholder)) return Array('error' => "Attribute placeholder is missing");
						if(!isset($input->rank)) return Array('error' => "Attribute rank is missing");


						if($input->fId == "" || $input->fId == 0) { //when new field
							$field = ORM::for_table('fields')->create(); //create object
						}
						else {
							$field = ORM::for_table('fields')->use_id_column('fId')->where('fId',$input->fId)->find_one(); //retrieve by id
						}
						//update fields
						$field->title = $input->title;
						$field->type = $input->type;
						$field->placeholder = $input->placeholder;
						$field->rank = $input->rank;
						$field->save();

						//remove old options
						ORM::for_table('options')->where('fId', $field->id())->delete_many();

						if(isset($input->options)) { //if options available
							foreach ($input->options as $option) {
								$o = ORM::for_table('options')->create();
								$o->fId = $field->id(); //retrieve Id of possibly new field via id()
								$o->type = $option->type;
								$o->value = $option->value;
								$o->save();
							}
						}

						//Array containing the (new) IDs of the persisted fields
						array_push($new_ids, intval($field->id()));
					}

		            return json_encode($new_ids); //(new) IDs for update in front-end
		        } 
		        else {
		            return "Only accepts POST requests";
		        }

		    }
		    else{ //call to other URI than save: /form/*

		    	if ($this->method == 'GET') { //returns form data on GET requests
		        	
		        	$fields = ORM::for_table('fields')->find_array();

					$i = 0;
					foreach ($fields as $idx => $field) {
						$fields[$idx]['options'] = ORM::for_table('options')->where('fId', $field['fId'])->find_array();
					}

		            return json_encode($fields); //form fields array as JSON object
		        } 
		        else {
		            return "Only accepts GET requests";
		        }

		    }
		}
	}
?>