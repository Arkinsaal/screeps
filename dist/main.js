
require('spawnPrototypes');
require('creepJobPrototypes');
require('creepCombatPrototypes');
require('roomPrototypes');
require('roomPositionPrototypes');
require('workerJobs');
require('combatJobs');

var helperFunctions     = require('helperFunctions');
var dataStore           = require('dataStore');
var creepCensus         = require('creepCensus');
var helperFunctions     = require('helperFunctions');
var memoryPrototypes    = require('memoryPrototypes');
var creepTasks          = require('creepTasks');

if (Game.time%500==0) {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    };
};

//var wholeApp = Game.getUsedCpu();

var myRooms = ['W19N1', 'W18N1', 'W17N2'];
var roomsToAttack = [];

var travelUpgraders = _.filter(Game.creeps, {memory: {role:'travelUpgrader'}});

if (travelUpgraders.length<4) {
    Game.spawns.Spawn2.createCreep( [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], ('Travel Upgrader - ' + helperFunctions.getNewGuid()), {role: 'travelUpgrader', traveller: true});
};

var founderPath = ['W18N0', 'W10N0', 'W10N18', 'W8N18', 'W8N19'];
var founderPath2 = ['W18N0', 'W10N0', 'W10N4', 'W7N4', 'W6N5', 'W7N5'];

var screepCensus = creepCensus.screepCensus();
var maxCounts = Memory.maxCounts;

_.forEach(Game.creeps, function(thisCreep) {

    if (thisCreep.memory.role == 'founder' || thisCreep.memory.role =='warrior') {
    	if (thisCreep.memory.pathStage==undefined) thisCreep.memory.pathStage = 0;
        if (thisCreep.memory.newRoom===true) {
            if (thisCreep.memory.targetRoom != founderPath2[founderPath2.length-1] && thisCreep.pos.roomName == founderPath2[thisCreep.memory.pathStage]) thisCreep.memory.pathStage++;
            thisCreep.memory.targetRoom = founderPath2[thisCreep.memory.pathStage];
        } else {
            if (thisCreep.memory.targetRoom != founderPath[founderPath.length-1] && thisCreep.pos.roomName == founderPath[thisCreep.memory.pathStage]) thisCreep.memory.pathStage++;
            thisCreep.memory.targetRoom = founderPath[thisCreep.memory.pathStage];
        };
    };

    if (thisCreep.memory.role==undefined) {
        Game.notify(thisCreep.name + ' has undefined for their role...sigh');
        thisCreep.memory.role = thisCreep.name.split(' - ')[0];
    };
    if (!thisCreep.spawning) {
        
        if (thisCreep[thisCreep.memory.role + 'Job']) thisCreep[thisCreep.memory.role + 'Job']();

        /*if (!thisCreep.memory.traveller && thisCreep.memory.roomName != thisCreep.room.name) {
            var targetSpot = new RoomPosition(25,25, thisCreep.memory.roomName);
            //creepTasks._moveToLongDistance(thisCreep, targetSpot);
        } else {
        };*/
    };
});

_.forEach(maxCounts, function(room, roomName) {
    var productionLine = [];
    _.forEach(room, function(creeps, creepType) {
        if (!screepCensus[roomName]) screepCensus[roomName] = {};

        if (creepType==0) console.log(creeps)

        var creepList = screepCensus[roomName][creepType.slice(0, -1)];
        if ((creeps>0 && !creepList) || (creepList && creeps>creepList.length)) {
            if (creepType.slice(0, -1)!=undefined) productionLine.push(creepType.slice(0, -1));

            //var roomToSpawnIn = (roomName=='W17N2') ? 'W18N1' : roomName;

            //var creepNeeded = {type: creepType.slice(0, -1), spawningRoom: roomToSpawnIn, owningRoom: roomName};

            //if (_.findIndex(Memory.productionLine, creepNeeded)==-1) Memory.productionLine.push(creepNeeded);
            
        };
    });

    if (productionLine.length>1) {
        productionLine = helperFunctions.sortProductionLine(productionLine);
    };

    if (productionLine[0]) {
        var roomSpawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);
        var roomSpawn = roomSpawns[0];
        if (productionLine[0]==undefined) Game.notify('trying to spawn undefined');
        if (roomSpawn) roomSpawn.createNextUnit(productionLine[0], roomName);
    };

});

function sortProductionLine(productionLine) {

    var prodLineNew = _.sortBy(productionLine, function(element){  
        var rank = {
            "distributer":     1,
            "harvester" :      2,
            "guard" :          3,
            "repairer" :       4,
            "ranger":          5,
            "builder" :        6,
            "upgrader" :       7,
            "travelUpgrader":  8,
            "scout":           9,
            "founder":         10,
            "collector":       11,
            "mover":           12,
            "warrior":         13
        };
        return rank[element.type];
    });
    return prodLineNew;
};

/*Memory.productionLine = sortProductionLine(Memory.productionLine);

var prodLine = Memory.productionLine;


_.forEach(Game.spawns, function(spawn) {
    if (spawn.spawning) return;

    var unit = _.find(prodLine, {spawningRoom: spawn.room.name});

    if (unit && spawn.createNextUnit(unit)==0) {
        prodLine.splice(prodLine.indexOf(unit), 1);
    };

});*/

_.forEach(myRooms, function(roomName) {
    var room = Game.rooms[roomName];
    if (!room) return;

    room.handleLinks();
    //var roomAnalysis = room.analyse();

    //if (roomName!='W17N3') memoryPrototypes.setMaxCount(roomName, 'rangers', (roomAnalysis.analysedEnemies.length*2));
});


//console.log('Whole app: ', Game.getUsedCpu()-wholeApp);