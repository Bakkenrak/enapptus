<?php
	require_once "library\idiorm.php";
	require_once "config.php";

	header("Content-type: application/json");
	$fields = ORM::for_table('fields')->find_array();

	$i = 0;
	foreach ($fields as $field) {
		$fields[$i++]['options'] = ORM::for_table('options')->where('fId', $field['fId'])->find_array();
	}

	echo json_encode($fields, JSON_HEX_TAG);
?>