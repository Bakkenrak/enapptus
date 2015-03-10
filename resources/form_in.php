<?php
	require_once "library\idiorm.php";
	require_once "config.php";

	header('Content-Type: application/json');

	$input = json_decode(file_get_contents('php://input'));

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
	$field->save();

	//remove old options
	ORM::for_table('options')->where('fId', $field->id())->delete_many();

	foreach ($input->options as $option) {
		$o = ORM::for_table('options')->create();
		$o->fId = $field->id(); //retrieve Id of possibly new field via id()
		$o->type = $option->$type;
		$o->value = $option->value;
		$o->save();
	}

	echo json_encode(array('status' => 'success','message'=> 'Field successfully persisted'));
?>