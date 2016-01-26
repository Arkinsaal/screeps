

screepCensus = function() {

	var Census = {};
	var Creeps = Game.creeps;
	for (creep in Creeps) {
		var thisCreep = Creeps[creep];

		// add each creep to its role group within its room
		//console.log(thisCreep.memory.roomName, thisCreep.memory.role)
		if (!Census[thisCreep.memory.roomName]) Census[thisCreep.memory.roomName] = {};
		if (!Census[thisCreep.memory.roomName][thisCreep.memory.role]) Census[thisCreep.memory.roomName][thisCreep.memory.role] = [];
		Census[thisCreep.memory.roomName][thisCreep.memory.role].push(thisCreep);
	};

	return Census;
};
