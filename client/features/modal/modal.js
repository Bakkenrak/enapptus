app.controller('modalCtrl', function($scope, $http, FormField){
	$scope.type_options = [ 'Radiobutton', 'Dropdown', 'Email', 'Textzeile'];
	$scope.new_option = '';
	$scope.save =function(){
		console.log($scope.selected_field);
		FormField.save($scope.selected_field)
		.success(function(result){
			console.log(result);
		});
	}

	$scope.selectOption = function(){
		$scope.new_option = '';
		$scope.selected_field.options = [];
	}
	
	$scope.addOption = function(){
		$scope.selected_field.options.push($scope.new_option);
		$scope.new_option = '';
	}

	$scope.deleteOption = function(index){
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