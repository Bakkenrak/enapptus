app.controller('modalCtrl', function($scope, $http, FormField){
	console.log('test');
	console.log(FormField);
	$scope.new_option = {};
	$scope.save =function(){
		console.log($scope.selected_field);
		FormField.save($scope.selected_field)
		.success(function(result){
			console.log(result);
		});
	}

	$scope.selectOption = function(){
		switch($scope.selected_type.title.toLowerCase()){
			case 'textzeile':
				$scope.selected_field.options = '';
				console.log('selected textzeile');
				break;
			case 'dropdown':
				break;
			case 'radiobutton':
				break;
			default:
				console.log('no type selected');
		}
	}
	
	$scope.addOption = function(option_name){
		console.log(option_name);
		var value = $scope.new_option[option_name];
		if(typeof  value !== 'undefined'){
			$scope.selected_field.options.push(value);
			$scope.new_option[option_name] = undefined;
		}else{
			console.log('no option found');
		}
		
	}

	$scope.deleteOption = function(index){
		console.log(index);
		if(typeof index === 'undefined'){
			$scope.selected_field.options = undefined;
		}else{
			$scope.selected_field.options.splice(index, 1);
		}
	}
})
.factory('FormField', function($http){
	return {
		save : function(data){
			return $http({
				method:'POST',
				url: './resources/form_in.php',
				data: data,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		}
	}
});