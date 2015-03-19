app.factory('myModal', function (btfModal) {
	
	/** @type {Object} variable for storing current modal service object */
	var curr_modal = {};
	/** @type {Object} key value store for sharing information between modal and modal emitting controller */
	var content = {};
  	
  	return {
  		/** setter for private content object */
  		setContent: function(data){
  			content = data;
  		},
  		/** getter for private content object */
  		getContent: function(key){
  			return content[key];
  		},
  		/** getter for the modal. used in modal controller*/
  		getCurrentModal : function(){
  			return curr_modal;
  		},
  		/** redefines the current modal service */
	  	getNewModal : function(templateUrl, controller_name){
	  		curr_modal = btfModal({
					    controller: controller_name,
					    controllerAs: 'modal',
					    templateUrl: templateUrl
				  	});
			return	curr_modal;
			}
		};
});