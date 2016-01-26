
var dataStore 			= require('dataStore');

module.exports = {
	_attackNearestWall: function(creep) {
		var targetWall = dataStore.getTargetWall(creep);
        if (targetWall) {
	        if (!creep.pos.inRangeTo(targetWall.pos, 3)) creep.moveTo(targetWall);
	        creep.rangedAttack(targetWall);
        };
	},
	_attackUnits: function(creep, cantReach) {
	    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

	    var type = (this.getActiveBodyparts(ATTACK) > 0) ? 'melee' : 'ranged';

	    if (targets.length == 0) {
	        var closestTarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	        if (closestTarget!=null) {
	            creep.moveTo(closestTarget);
	            if (type=='ranged') {
	            	creep.rangedAttack(closestTarget);
	            } else {
	            	creep.attack(closestTarget);
	            };
	        } else {
            	if (cantReach) cantReach();
	        };
	    } else if (targets.length == 1) {
            if (type=='ranged') {
	        	creep.rangedAttack(targets[0]);
            } else {
	        	var closestTarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            	creep.attack(closestTarget);
            };
	    } else {
            if (type=='ranged') {
	        	creep.rangedMassAttack();
            } else {
	        	var closestTarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            	creep.attack(closestTarget);
            };
	    };
	},
	_attackUnitsMelee: function(creep, cantReach) {
	    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

	    if (targets.length == 0) {
	        var closestTarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	        if (closestTarget!=null) {
	            creep.moveTo(closestTarget)
	            creep.attack(closestTarget);
	        } else {
            	if (cantReach) cantReach();
	        };
	    } else {
	        creep.rangedAttack(targets[0]);
	    };
	},
	_guardSpot: function(creep) {
	    var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
	    if (targets.length == 0) {
	    	// do nothing
	    } else if (targets.length == 1) {
	        creep.rangedAttack(targets[0]);
	    } else {
	        creep.rangedMassAttack();
	    };
	},
	_attackStructures: function(creep, structures) {
		var target = structures[structures.length - 1];
	    creep.moveTo(target);
	    creep.rangedAttack(target);
	}
}
