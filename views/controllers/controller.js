var myApp = angular.module('myApp', ['infinite-scroll']);

myApp.controller('AppCtrl', function($scope, $http) {
	$scope.index = 0;
	$scope.postIds = [];
	$scope.rows = [];
	$scope.isBusy = false;
	$scope.isInit = true;
	$scope.noPosts = false;

	// Available select option for sorting, with corresponding value
	$scope.sortOptions = [
		{name:"Creation Time", value:"created_time"},
		{name:"Like", value:"likes"},
		{name:"Comments", value:"comments"}
	];

	// The client side run the following at the beginning 
  	// Init the posts by sending http get request to get the default created_time sorted id list
  	$http.get('/posts/load/created_time').then(
	  	function(res){
	  		// Store the id list in scope
			$scope.postIds = res.data;
			// Call function to init the first 9 posts
			getDetails($http,$scope,true);
		}, 
		function(res){
			alert("Error during get posts");
		}
	);

  	// Call the function when sort option changed
  	$scope.sortPosts = function(){
  		// Re-initalize the list
  		$scope.isInit = true;
  		// Empty all the current post list contents
  		$scope.postIds = [];
  		$scope.rows = [];
  		$scope.index = 0;

  		// Create GET request to get the new sorted postId list according to user selected option
	  	$http.get('/posts/load/'+$scope.sortedBy.value).then(
	  		function(res){
	  			// Set the postIds to new sorted id list according to user selected sort option
				$scope.postIds = res.data;
				// Call function to init the first 9 posts
				getDetails($http,$scope,true);
			}, 
			function(res){
				alert("Error during get posts");
			}
		);
  	};

  	// Call loadMore function when user scroll to the bottom
  	$scope.loadMore = function() {
  		// Return if initalizing
  		if($scope.isInit) return;
  		// Return if loadMore function is still running
  		if($scope.isBusy) return;

  		// If there still have posts not loaded
  		if($scope.index < $scope.postIds.length){
	  		// Set isBusy for indicate the loadMore function is running
	  		$scope.isBusy = true;
	  		// Get the next 9 posts details
	  		getDetails($http, $scope, false);
	  	}
	  	else {
	  		$scope.noPosts = true;
	  	}
	};
});

// Function to get 9 posts details and store data in $scope
function getDetails($http,$scope,isInit){
	// Get the first 9 photos from the server by POST request
	$http.post('posts/details', $scope.postIds.slice($scope.index, $scope.index+9)).then(
		function(res1){
			// Update the index cursor for next fetching 
			$scope.index = $scope.index + 10;
		  	// Slice the 9 posts into 3 arrays (each represent 1 row in the view)
		  	var newRow = chunk(detailsFormater(res1.data), 3)
		  	// Push the new 3 rows into scope.rows array for update VIEW
	  		$scope.rows.push(newRow[0]);
	  		$scope.rows.push(newRow[1]);
	  		$scope.rows.push(newRow[2]);

		  	// Change state after the above done
		  	// if it is Init 
		  	if(isInit)
		  		// set init done
		  		$scope.isInit = false;
		  	else
		  		//else set not busy
		  		$scope.isBusy = false;
		}, 
		function(res1){
			console.log("Error during get posts details");
		}
	);
}


// -------- HELPER FUNCTIONS --------

// Helper function to slice the array to n sized chunks
// It used for show 3 posts in 1 row  
function chunk(arr, size) {
	var newArr = [];
	for (var i=0; i<arr.length; i+=size) {
	  newArr.push(arr.slice(i, i+size));
	}
	return newArr;
}

// Helper function to re-format the multiple HMGETALL response array
function detailsFormater(arr){
	var newArr = [];
	for (var i=0; i<arr.length; i++){
    	newArr.push(arr[i][1]);
  	}
  	return newArr;
}

