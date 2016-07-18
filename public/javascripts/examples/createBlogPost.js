var app = angular.module('CreatePost',[]);

app.controller('BlogPost',BlogPost);

BlogPost.$inject = ['$scope','$log','$http'];

function BlogPost($scope,$log,$http) {

	$scope.pastEntry = undefined;

	$scope.title = '';
	$scope.showTitle = true;
	$scope.par = '';
	$scope.currentEntry = '';
	$scope.parStyle = '';
	$scope.paragraphs = [];
	$scope.isSubmit = true;
	$scope.allEntries = [];
	var entryNumber = 0;
	var editIndex = -1;
	$scope.entries = [];
	$scope.submitTitle = function() {
		var title = $scope.title
		$http({
			method: 'POST',
			data: {
				title: title
			},
			url: 'http://localhost:3000/examples/create/title'
		}).success(function(data) {
			entryNumber = data.number;
			$scope.showTitle = false;
		}).error(function(data) {
			console.log(data);
		})
	}

	$scope.submitParagraph = function() {
		var par = $scope.par;
		var parStyle = $scope.parStyle;
		if (entryNumber != 0) {
			$http({
				method: 'POST',
				data: {
					par: par,
					parStyle: parStyle,
					entryNumber: entryNumber
				},
				url: 'http://localhost:3000/examples/create/appendParagraph'
			}).success(function(data) {
				if (data == 'success') {
					$scope.paragraphs.push({
						parStyle: parStyle,
						par: par
					});

					$scope.par = '';
					$scope.parStyle = '';
				}
			}).error(function(data) {
				console.log(data);
			});
		} else {
			alert('must submit paragraph title');
		}
	}

	$scope.selectParagraph = function(index) {
		$scope.par = $scope.paragraphs[index].par
		$scope.parStyle = $scope.paragraphs[index].parStyle
		$scope.isSubmit = false;
		editIndex = index;
	}

	$scope.deleteParagraph = function() {
		var par = $scope.paragraphs[editIndex].par;
		var url = 'http://localhost:3000/examples/create/appendParagraph/?number='+entryNumber+'&par=' + par;
		$http({
			method: 'DELETE',
			url: url
		}).success(function(data) {
			if (data == 'success') {
				$scope.paragraphs.splice(editIndex, 1);
				$scope.reset();
			}
		});
	}


	$scope.editParagraph = function() {
		var par = $scope.par;
		var parStyle = $scope.parStyle;
		
		$http({
			method: 'PATCH',
			data: {
				par: par,
				parStyle: parStyle,
				entryNumber: entryNumber,
				paragraphNumber: editIndex
			},
			url: 'http://localhost:3000/examples/create/appendParagraph'
		}).success(function(data) {
			if (data == 'success') {
				$scope.paragraphs[editIndex].parStyle =  parStyle;
				$scope.paragraphs[editIndex].par = par;
				$scope.reset();
			}
		}).error(function(error) {
			console.log(error);
		});
	}

	$scope.reset = function() {
		$scope.par = '';
		$scope.parStyle = '';
		$scope.isSubmit = true;
	};

	$scope.fetchEntries = function () {
		$http({
			method: 'POST',
			url: 'http://localhost:3000/examples/fetchAll'
		}).success(function(data) {
			console.log(data);
			$scope.allEntries = data;
		}).error(function(error) {
			console.log(error)
		})
	}

	$scope.switchEntry = function () {
		if ($scope.pastEntry) {
			var number = $scope.allEntries[$scope.pastEntry].number;
			$http({
				method:'POST',
				url: 'http://localhost:3000/examples/fetchEntry',
				data: {
					number: number
				}
			}).success(function(data) {
				$scope.pastEntry = undefined;
				$scope.title = data.title;
				$scope.showTitle = false;
				$scope.par = '';
				$scope.currentEntry = number;
				entryNumber = number;
				$scope.parStyle = '';
				$scope.paragraphs = data.content;
				$scope.isSubmit = true;
			});
		}
	}

	$scope.deleteEntry = function () {
		if ($scope.pastEntry) {
			if (window.confirm('You sure?')) {
				$http({
					method: 'POST',
					url: 'http://localhost:3000/examples/deleteEntry',
					data: {
						number: $scope.allEntries[$scope.pastEntry].number
					}
				}).success(function(data) {
					if (data == 'success') {
						$scope.allEntries.splice($scope.pastEntry, 1);
						$scope.pastEntry = undefined;
					}
				});
			}
		}
	}
}

angular.bootstrap($('#create-blog')[0],['CreatePost']);