angular.module('worstFitApp', [])

.controller('appController',  function($scope) {

	const TOTAL_SPACES = 379;

	$scope.processes = []

	$scope.memory = {
		spaces: [],
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
	$scope.malloc = function(process) {
		if (getProcessById(process.id) != null) {
			return 'Process ' + process.id + " already allocated";
		}
		// orderList();
		$scope.memory.pointList.sort();
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
				num++;
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
		process.color = getRandomColor();
		for (var i = num; i < $scope.memory.spaces.length; i++) {
			var space = $scope.memory.spaces[i]
			space.status = 'USED';
			space.processId = process.id;
			space.color = process.color;
			count--;
			if (count == 0) {
				// Find if after this point is free to be used by other processes
				if ($scope.memory.spaces[i + 1].status == 'FREE') {
					$scope.memory.pointList[point] = i+1;
				} else {
					$scope.memory.pointList.splice(point, 1);
				}
				break;
			}
		}

		$scope.processes.push(process);
	}

	function getProcessById(id, deleteProcess) {
		for (var i = 0; i < $scope.processes.length; i++) {
			if ($scope.processes[i].id == id) {
				if (deleteProcess) {
					$scope.processes.splice(i, 1);
					return null;
				} else {
					return $scope.processes[i];
				}
			}
		}
		return null;
	}

	$scope.deallocate = function(processId) {
		var foundProcess = false;
		var startedAt;
		for (var i = 0; i < $scope.memory.spaces.length; i++) {
			var space = $scope.memory.spaces[i];

			if (processId == space.processId) {
				if (!foundProcess) {
					startedAt = i;
					foundProcess = true;
				}
				space.processId = undefined;
				space.status = 'FREE';
			} else if (processId != space.processId && foundProcess) {
				createPoint(startedAt, i);
				break;
			}
		}
		getProcessById(processId, true);
	}

	function createPoint(startedAt, finshedAt) {
		var foundPoint = false;
		for (var i = 0; i < $scope.memory.pointList.length; i++) {
			var point = $scope.memory.pointList[i];

			// Find if the point starts after the end of the memory space that was allocated
			if(point == finshedAt) {
				$scope.memory.pointList[i] = startedAt;
				foundPoint = true;
				break;
			}
		}

		if (!foundPoint) {
			$scope.memory.pointList.push(startedAt);
		}
	}

	function orderList() {
		Array.min = function(list) {
			return Math.min.apply(Math, list);
		}
		Array.min($scope.memory.pointList);
	}

	// $scope.command = 'memory.malloc({id: 1, size: 15})';
	$scope.malloc({id: 1, size: 15})
	$scope.malloc({id: 2, size: 15})
	$scope.executeCommand = function() {
		aler('so loko')
		// eval("$scope." + $scope.command);
	}

	function getRandomColor() {
	    var letters = '0123456789ABCDEF';
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}
})