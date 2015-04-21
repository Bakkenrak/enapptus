app.factory('httpResponseInterceptor',['$q','myUser',function($q,myUser){
  return {
    response: function(response){
      if(response.status===401){
        myUser.logoutUser();
      };
      return response;
      
    },
    responseError: function(response) {
      if(response.status===401){
        myUser.logoutUser();
      };
      return response;
    }
  }
}]);
