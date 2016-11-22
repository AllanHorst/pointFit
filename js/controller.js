angular.module('worstFitApp', [])

.controller('appController',  function($scope) {

	$scope.memory = {
		spaces: [],
		malloc: malloc,
		deallocate: deallocate,
		pointList: [0]
	}

	function malloc(process) {
		orderList();
		for (var i = 0; $scope.memory.pointList.length; i++) {
			var num = $scope.memory.pointList[i]

			var count = 0;
			var hasSpace = false;

			for (var j = 0; j < $scope.memory.spaces.length; j++) {
				var space = $scope.memory.spaces[j];

				if (space.status == 'USED') {
					break;
				}
				count++;
				if (count == process.size) {
					hasSpace = true;
					break;
				}
			}

			if (hasSpace) {
				allocate(process, num);
				break;
			}
		}
	}

	function allocate(process, num) {
		var count = process.size
		for (var i = num; i < $scope.memory.spaces.length; i++) {
			var space = $scope.memory.spaces[i]
			space.status = 'USED';
			space.processId = process.id;
			count--;
			if (count == 0) {
				break;
			}
		}
	}

	function deallocate(process) {
		
	}

	function orderList() {
		Array.min = function(list) {
			return Math.min.apply(Math, list);
		}
		Array.min($scope.memory.pointList);
	}



})