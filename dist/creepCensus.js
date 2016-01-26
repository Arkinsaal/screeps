
module.exports = {
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
    },
    getCreepsTally: function(room) {
        var creepsHolder = {
            harvesters: [],
            upgraders: [],
            builders: [],
            repairers: [],
            guards: [],
            rangers: [],
            scouts: [],
            distributers: [],
            travelUpgraders: [],
            founders: [],
            collectors: [],
            movers: [],
            warriors: [],
            remoteHarvesters: []
        };
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.room.name==room) {
                if (!creepsHolder[creep.memory.role + 's']) creepsHolder[creep.memory.role + 's'] = [];
                creepsHolder[creep.memory.role + 's'].push(creep);
            };
        };
        return creepsHolder;
    },
    analyseProductionLine: function(room, productionLine) {
        var analysis = {
            harvesters: 0,
            upgraders: 0,
            builders: 0,
            repairers: 0,
            guards: 0,
            rangers: 0,
            scouts: 0,
            distributers: 0,
            travelUpgraders: 0,
            founders: 0,
            collectors: 0,
            movers: 0,
            warriors: 0,
            remoteHarvesters: 0
        };
        for (var type in productionLine) {
            if (!analysis[type+'s']) analysis[type+'s'] = 0;
            analysis[type+'s']++;
        };
        return analysis;
    }
}
