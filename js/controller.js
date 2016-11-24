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
	function sortNumber(a,b) {
	    return a - b;
	}
	
	initializeMemory()
	$scope.malloc = function(process) {
		if (getProcessById(process.id) != null) {
			return 'Process ' + process.id + " already allocated";
		}
		// orderList();
		$scope.memory.pointList.sort(sortNumber);
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

	$scope.history = [];
	$scope.executeCommand = function(command) {

		if(command != null) {
			$scope.command = command;
		}

		$scope.history.push($scope.command)
		eval("$scope." + $scope.command);
		$scope.command = ""
	}

	$scope.clear = function() {
		$scope.history = []
	}

	$scope.clearAll = function() {
		$scope.processes = []

		$scope.memory = {
			spaces: [],
			pointList: [0]
		}
		initializeMemory();
	}

	$scope.inputKeyPress = function(event) {
		if (event.keyCode == 13) {
			$scope.executeCommand();
		}
	}
	var listCommandTest = [
		'malloc({id: 1, size: 79})',
		'malloc({id: 8, size: 15})',
		'malloc({id: 9, size: 25})',
		'malloc({id: 10, size: 18})',
		'deallocate(9)',
		'malloc({id: 11, size: 60})',
		'malloc({id: 12, size: 4})',
		'malloc({id: 13, size: 19})',
		'malloc({id: 14, size: 33})',
		'deallocate(11)',
		'malloc({id: 15, size: 119})',
		'malloc({id: 9, size: 25})',
		'malloc({id: 16, size: 17})',
	]
	var num;
	$scope.test = function() {
		num = 0;
		executeTest(num);
	}

	function executeTest(num) {
		if (listCommandTest[num] == null) {
			return;
		}  
		setTimeout(function() {
			$scope.executeCommand(listCommandTest[num]);
			$scope.$apply();
			num++;
			executeTest(num);
		}, 500);
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