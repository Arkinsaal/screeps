
var dataStore           = require('dataStore');

function getGlobalCoords(roomName) {
	var splitRoom = roomName.split('');

	var index = null;

	var result = {};

	for (var i = 0; i < splitRoom.length; i++) {
		var isNumber = parseInt(splitRoom[i]);
		if (!isNumber) {
			index = splitRoom[i];
			result[index] = '';
		} else {
			result[index] += splitRoom[i];
		};
	};
	return result;
};

module.exports = {
	_callForEnergy: function(room) {
	    var linkRefs = (room.memory.links)?room.memory.links.split('-'):null;
		if (linkRefs) {
		    var links = [Game.getObjectById(linkRefs[0]), Game.getObjectById(linkRefs[1])];
	        if (links[0]) links[0].transferEnergy(links[1]);
	        this.wipeUnitsPaths(room.name, 'upgraders');
		};
	},
	_moveTo: function(creep, target, maxOps, weight) {

		var maxOperations 	= maxOps || 50,
			heuristicWeight	= weight || 1;

		function samePos(pos1, pos2) {
			if (!pos1 || !pos2) return;
	        var samePos = ((pos1.x==pos2.x) && (pos1.y==pos2.y) && (pos1.roomName==pos2.roomName));
	        return samePos;
	    };

	    //creep.pos._addConstructionSite(creep);

	    if (!creep.memory) return;

		if(!creep.memory.path || !creep.memory.lastPos || creep.pos.roomName!=creep.memory.lastPos.roomName) {
		    creep.memory.path = creep.pos.findPathTo(target, {maxOps: maxOperations, heuristicWeight: heuristicWeight});
		};
		if (creep.fatigue==0) {
			creep.moveByPath(creep.memory.path);
			if (samePos(creep.memory.lastPos, {x:creep.pos.x, y:creep.pos.y, roomName:creep.pos.roomName})) {
				// if creep cant move, allow sub-optimal path
				var path = creep.pos.findPathTo(target, {maxOps: 5000, heuristicWeight: 1000});
		    	creep.memory.path = path;
			};
			creep.memory.lastPos = {x:creep.pos.x, y:creep.pos.y, roomName:creep.pos.roomName};
		};
	},
	_findClosestOwnedRoom: function(pos) {
		var spawns = Game.spawns;

		var currentRoom = getGlobalCoords(pos.roomName);

		var shortest = 100000000;
		var closestRoom = null;

		_.forEach(spawns, function(spawn) {
			if (spawn.pos.roomName==pos.roomName) return;
			var roomSplit = getGlobalCoords(spawn.pos.roomName);

			var hDiff = Math.abs(roomSplit.W - currentRoom.W);
			var vDiff = Math.abs(roomSplit.N - currentRoom.N);

			var range = Math.sqrt((hDiff*hDiff) + (vDiff*vDiff));

			if (range<shortest) {
				shortest = range;
				closestRoom = 'W' + roomSplit.W + 'N' + roomSplit.N;
			};
		});
		return closestRoom;
	},
	wipeUnitsPaths: function(roomName, type) {
    	var creepsHolder = dataStore.creepCensus(roomName);

    	for (var i=0; i< creepsHolder[type].length; i++) {
    		creepsHolder[type][i].memory.path = null;
    	};
	},
	screepCensus: function() {

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
	}
}