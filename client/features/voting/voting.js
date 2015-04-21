app.controller('votingCtrl', function($scope, types, formApiFactory, applicationApiFactory, voteApiFactory, myUser, toaster){
	/**************************************************************

							Function Declarations


	***************************************************************/

	$scope.toggleApplication = function(direction){
		switch(direction.toLowerCase()){
			case 'next':
				$scope.applicant_pointer++;
				break;
			case 'last':
				$scope.applicant_pointer--;
				break;
		}
		$scope.selected_application = $scope.applications[$scope.applicant_pointer];
	};


	/**************************************************************

							Scope Init


	***************************************************************/
	
	var Applicant = function(props){
		this.own_vote = props.ownVote === null ? null : props.ownVote.value;
		this.aId = props.aId ? props.aId : -1;
		this.attr = props;
		return this;
	};

	$scope.form_fields = [];
	$scope.this_user = myUser.getUser();

	formApiFactory.index().success(function(data){
		$scope.form_fields = data;
		console.log('form_fields', data);
	});

	/**
	 * scope object reference for displaying the current selected application
	 * @type {Object}
	 */
	$scope.selected_application = {};

	/**
	 * container for all applicants (with name, id, answers etc)
	 * @type {Array}
	 */
	$scope.applications = [];

	/**
	 * helper variable for iterating over applicants
	 * @type {Number}
	 */
	$scope.applicant_pointer = 0;

	applicationApiFactory.index().success(function(data){
		console.log(data);
		angular.forEach(data, function(elm){
			$scope.applications.push(new Applicant(elm));
		});
		$scope.selected_application = $scope.applications[$scope.applicant_pointer];
		console.log('applications', $scope.applications);	
	});

	Applicant.prototype.saveVote = function(votestring){
		var instance = this;
		voteApiFactory.saveVote({
			aId: instance.aId,
			mId: myUser.getUser().mId,
			value: votestring 
		}).success(function(res, status){
			if(status === 200){
				instance.own_vote = votestring;
				toaster.pop('success', 'Abstimmung erfolgreich.');
			}else{
				toaster.pop('error', 'Abstimmung fehlgeschlagen.');
			}
		});
	};
	Applicant.prototype.delete = function(){
		console.log('delete', this);
	};
	Applicant.prototype.addQuestion = function(question){
		var instance = this;
		voteApiFactory.saveQuestion({
			qId : 0,
			aId : instance.aId,
			mId : myUser.getUser().mId,
			value : question
		}).success(function(res, status){
			if(status === 200){
				instance.attr.questions.push({
					aId: res.aId,
					qId: res.qId,
					mId: res.mId,
					value: res.value
				});
				toaster.pop("success", 'Frage erfolgreich hinzugefügt');
				$scope.new_question = '';
			}else{
				toaster.pop('error', 'Frage nicht gespeichert');
			}
		});
	}

	Applicant.prototype.deleteQuestion = function(question_index){
		var instance = this;
		voteApiFactory.deleteQuestion({
			aId: instance.aId,
			mId: myUser.getUser().mId,
			qId: instance.attr.questions[question_index].qId
		}).success(function(res,status){
			if(status === 200){
				instance.attr.questions.splice(question_index, 1);
				toaster.pop('success', 'Frage erfolgreich gelöscht');
			}else{
				toaster.pop('error', res.error);
			}
		});
	}


});