angular.module('worstFitApp', [])

.controller('appController',  function($scope) {

	const TOTAL_SPACES = 100;

	$scope.memory = {
		spaces: [],
		malloc: malloc,
		deallocate: deallocate,
		pointList: [0]
	}

	function initializeMemory() {
		for (var i = 0; i < TOTAL_SPACES; i++) {
			$scope.memory.spaces.push({
				status: 'FREE'
			})
		}
	}
	initializeMemory()
	function malloc(process) {
		orderList();
		for (var i = 0; $scope.memory.pointList.length; i++) {
			var num = $scope.memory.pointList[i]

			var count = 0;
			var hasSpace = false;
			var keep = true;

			while (keep) {
				var space = $scope.memory.spaces[num];

				if (space.status == 'USED') {
					keep = false;
					continue;
				}
				count++;
				if (count == process.size) {
					hasSpace = true;
					keep = false;
					continue;
				}
			}

			if (hasSpace) {
				allocate(process, i);
				break;
			}
		}
	}

	function allocate(process, point) {
		var num = $scope.memory.pointList[point];
		var count = process.size
		
		for (var i = num; i < $scope.memory.spaces.length; i++) {
			var space = $scope.memory.spaces[i]
			space.status = 'USED';
			space.processId = process.id;
			count--;
			if (count == 0) {
				// Verifica se a partir deste ponto está livre a 
				// memória para ser utilizada por outros processos
				if ($scope.memory.spaces[i + 1].status == 'FREE') {
					$scope.memory.pointList[point] = i+1;
				} else {
					$scope.memory.pointList.splice(point, 1);
				}
				break;
			}
		}
	}

	function deallocate(process) {
		for (var i = 0; i < $scope.memory.spaces.length; i++) {
			var space = $scope.memory.spaces[i];

			if (process.id == space.processId) {
				
			}
		}
	}

	function orderList() {
		Array.min = function(list) {
			return Math.min.apply(Math, list);
		}
		Array.min($scope.memory.pointList);
	}

	$scope.command = 'memory.malloc({id: 1, size: 15})';

	$scope.executeCommand = function() {
		eval("$scope." + $scope.command);
	}


})