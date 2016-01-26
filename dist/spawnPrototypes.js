
// WORK             = 100
// CARRY            = 50
// MOVE             = 50
// TOUCH            = 10
// RANGED_ATTACK    = 150

var helperFunctions = require('helperFunctions');

var defaultCreep = [WORK, CARRY, CARRY, CARRY, MOVE];

var creepDefinitions = {
    W19N1: {
        default:    [WORK, CARRY, CARRY, CARRY, MOVE],
        harvester: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],    // 900
        upgrader:  [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],                         // 800
        repairer:  [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],                                   // 500
        builder:   [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],    // 900
        distributer:[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],        // 600
        guard:     [MOVE, RANGED_ATTACK, RANGED_ATTACK],                                                   // 350
        ranger:    [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], // 800
        warrior:   [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], // lots
        scout:     [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],                                                   // 300
        travelUpgrader:[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],// 900
        remoteHarvester:[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        remoteCollector:[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        founder:   [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK],                       // 600
        collector: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], // 800
        mover:     [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]  // 800
    },
    W18N1: {
        default:    [WORK, CARRY, CARRY, CARRY, MOVE],                                                      // 300
        harvester: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],    // 900
        upgrader:  [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],                         // 800
        repairer:  [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],                                   // 300
        builder:   [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],                                   // 300
        distributer:[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],        // 600
        guard:     [MOVE, RANGED_ATTACK, RANGED_ATTACK],                                                   // 350
        ranger:    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], // 1200
        warrior:   [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], // lots
        scout:     [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],                                                   // 300
        travelUpgrader:[WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],// 900
        founder:   [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK],                       // 600
        collector: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], // 800
        mover:     [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]  // 800
    },
    W17N2: {
        default:    [WORK, CARRY, CARRY, CARRY, MOVE],                                                      // 300
        harvester: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],    // 700
        upgrader:  [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],                                     // 500
        repairer:  [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],                                   // 300
        builder:   [WORK, CARRY, CARRY, CARRY, MOVE],                                   // 300
        distributer:[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],        // 600
        guard:     [WORK, CARRY, CARRY, CARRY, MOVE],                                                   // 350
        ranger:    [WORK, CARRY, CARRY, CARRY, MOVE], // 800
        scout:     [WORK, CARRY, CARRY, CARRY, MOVE],                                                   // 300
        travelUpgrader:[WORK, CARRY, CARRY, CARRY, MOVE],// 900
        remoteHarvester:[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        remoteCollector:[CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        founder:   [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK],                       // 600
        collector: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] // 800
    },
    W7N5: {
        default:    [WORK, CARRY, CARRY, CARRY, MOVE],                                                      // 300
        harvester: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],    // 700
        upgrader:  [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],                                     // 500
        repairer:  [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],                                   // 300
        builder:   [WORK, CARRY, CARRY, CARRY, MOVE],                                   // 300
        distributer:[WORK, CARRY, CARRY, CARRY, MOVE],        // 600
        guard:     [WORK, CARRY, CARRY, CARRY, MOVE],                                                   // 350
        ranger:    [WORK, CARRY, CARRY, CARRY, MOVE], // 800
        scout:     [WORK, CARRY, CARRY, CARRY, MOVE],                                                   // 300
        travelUpgrader:[WORK, CARRY, CARRY, CARRY, MOVE],// 900
        founder:   [WORK, CARRY, CARRY, CARRY, MOVE],                       // 600
        collector: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] // 800
    }
};

function getAvailableEnergy() {
    var energy = 0;
    energy += Game.spawns.Spawn1.energy;
    var spwn1 = Game.spawns.Spawn1;
    var extensions = spwn1.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    _.forEach(extensions, function(val) {
        energy+= val.energy;
    });
    return energy;
};

Spawn.prototype.createNextUnit = function(unit, roomName, destinationRoom) {
    var owningRoom = destinationRoom || roomName;

    if (this.canCreateCreep(creepDefinitions[roomName][unit]) == OK) {
        var memory = {role: unit, roomName: owningRoom};
        if (unit=='travelUpgrader') memory.traveller = true;
        if (unit=='founder') memory.newRoom = true;
        this.createCreep( creepDefinitions[roomName][unit], (unit + ' - ' + helperFunctions.getNewGuid()), memory);
    };

};
/*
Spawn.prototype.createNextUnit = function(unit) {

    var owningRoom = unit.owningRoom || unit.spawningRoom;

    if (this.canCreateCreep(creepDefinitions[unit.spawningRoom][unit.type]) == OK) {
        var memory = {role: unit.type, roomName: owningRoom};
        if (unit.type=='travelUpgrader') memory.traveller = true;
        this.createCreep( creepDefinitions[unit.spawningRoom][unit.type], (unit.type + ' - ' + helperFunctions.getNewGuid()), memory);
        return true;
    };
    return false;

};
*/
