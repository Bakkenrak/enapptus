app.factory('voteApiFactory', function($http){
	return {
		saveQuestion : function(question){
			console.log(question);
			return $http({
				data: question,
				method: 'POST', 
				url: 'api/question/save',
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		}, 
		deleteQuestion: function(data){
			return $http({
				data:data,
				method: 'DELETE',
				url: 'api/question/'+data.qId,
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		},
		saveVote : function(vote){
			console.log(vote);
			return $http({
				data: vote,
				method: 'POST', 
				url: 'api/vote/save',
				headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
			});
		} 	
	}
});