
var creepCensus         = require('creepCensus');

var rooms = {};

var data = {};

module.exports = {
	getExtensions: function(room) {
		var response = null;
		if (!rooms[room]) rooms[room] = {};
		if (rooms[room].extensions) response = rooms[room].extensions;
		else {
	        rooms[room].extensions = Game.rooms[room].find(FIND_MY_STRUCTURES, {
	            filter: { structureType: STRUCTURE_EXTENSION }
	        });
	        response = rooms[room].extensions;
		};
		return response;
	},
	getConstructionSites: function(room) {
		var response = null;
		if (!rooms[room]) rooms[room] = {};
		if (rooms[room].constructionSites) response = rooms[room].constructionSites;
		else {
	        rooms[room].constructionSites = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
	        response = rooms[room].constructionSites;
		};
		return response;
	},
	getAllStructures: function(room, type) {
		var response = null;
		if (!rooms[room]) rooms[room] = {};
		if (rooms[room][type.toString()]) response = rooms[room][type.toString()];
		else {
            rooms[room][type.toString()] = Game.rooms[room].find(FIND_STRUCTURES, {
                filter: { structureType: type }
            });
	        response = rooms[room][type.toString()];
		};
		return response;
	},
	getTargetsInArea: function(room, type, area) {
		var response = null;
		if (!rooms[room]) rooms[room] = {};
		if (rooms[room][(type + '_' + area)]) response = rooms[room][(type + '_' + area)];
		else {
			var targets = [];
			var aA = area.split('-');
	        var look = Game.rooms[room].lookForAtArea(type, aA[0], aA[1], aA[2], aA[3]);
	        _.forEach(look, function(pos) {
	            _.forEach(pos, function(item) {
	                _.forEach(item, function(target) {
	                    targets.push(target)
	                })
	            });
	        });
	        rooms[room][(type + '_' + area)] = targets;
	        response = rooms[room][(type + '_' + area)];
		};
        return response;
	},
	getHostilesInRoom: function(room) {
		var response = null;
		if (!rooms[room]) rooms[room] = {};
		if (rooms[room].hostiles) response = rooms[room].hostiles;
		else {
            rooms[room].hostiles = Game.rooms[room].find(FIND_HOSTILE_CREEPS);
	        response = rooms[room].hostiles;
		};
		return response;
	},
	getHostileStructuresInRoom: function(room) {
		var response = null;
		if (!rooms[room]) rooms[room] = {};
		if (rooms[room].hostileStructures) response = rooms[room].hostileStructures;
		else {
            rooms[room].hostileStructures = Game.rooms[room].find(FIND_HOSTILE_STRUCTURES);
	        response = rooms[room].hostileStructures;
		};
		return response;
	},
	getTargetWall: function(creep, room) {
		var response = null;
		if (!rooms[room]) rooms[room] = {};
		if (rooms[room].targetWall) response = rooms[room].targetWall;
		else {
            rooms[room].targetWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	            filter: { structureType: STRUCTURE_WALL }
	        });
	        response = rooms[room].targetWall;
		};
		return response;
	},
	creepCensus: function(room) {
		var response = null;
		if (!rooms[room]) rooms[room] = {};
		if (rooms[room].creepCensus) response = rooms[room].creepCensus;
		else {
            rooms[room].creepCensus = creepCensus.getCreepsTally(room);
	        response = rooms[room].creepCensus;
		};
		return response;
	},
	screepCensus: function(room) {
		var response = null;
		if (!data.screepCensus) data.screepCensus = creepCensus.screepCensus();
		return data.screepCensus;
	}
};