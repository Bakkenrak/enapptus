app.controller('testCtrl', function($scope, $http){
	$scope.type_options =[
	{
		title: 'Radiobutton',
		id:0
	},
		{
		title: 'Dropdown',
		id:1
	},
		{
		title: 'Email',
		id:2
	},
		{
		title: 'Textzeile',
		id:3
	}];
	$scope.selected_Field = {};
	$scope.form_fields = [
		{
			id: 'first name',
			title:'Vorname' ,
			placeholder: 'bitte Vorname eingeben',
			type: 'Textzeile'
		},
		{
			id: 'age',
			title:'Alter' ,
			placeholder: 'bitte Alter angeben',
			type: 'Radiobutton',
			options : ['asda', 'asdasd']
		},
		{
			id: 'college',
			title:'Welche Hochschule' ,
			placeholder: ['WWU', 'FH'],
			type: 'Dropdown',
			options : ['sdfdsf', 'asdsdfasd']
		}
	];
	$scope.selectField = function(index){
		console.log(typeof index);
		$scope.selected_field = $scope.form_fields[index];
		console.log($scope.selected_field);
	}
	$scope.deleteFormField = function(form_id){

	};
});
