app.factory('types', function(){
	
	/**
	 * key/value store for supported types. 
	 * @type {Object}
	 */
	var all_types = {
		'Radiobutton' : {
			hasOptions : true, 
			hasPlaceholder : false,
			title: 'Radiobutton',
			input_type: 'radio'
		},
		'Textzeile': {
			hasOptions: false,
			hasPlaceholder: true,
			title: 'Textzeile',
			input_type: 'text'
		},
		'Textfeld': {
			hasOptions: false,
			hasPlaceholder : true,
			title: 'Textfeld',
			input_type: 'textarea'
		},
		'Dropdown' : {
			hasOptions: true, 
			hasPlaceholder : false,
			title: 'Dropdown',
			input_type: 'select'
		},
		'Dateiupload':{
			hasOptions: false, 
			hasPlaceholder: false,
			title: 'Dateiupload',
			input_type: 'file'
		}
	};

	return {

		/** getter for private types store object */
		getTypes : function(){
			return all_types;
		}
	}
});