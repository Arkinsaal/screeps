
require('roomAnalysis');

var dataStore           = require('dataStore');
var creepCombatTasks    = require('creepCombatTasks');

var lookoutPosts = {
    W19N1: [{x:47, y:17}, {x:31, y:40}, {x:30, y:40}, {x:47, y:18}, {x:26, y:40}, {x:47, y:19}, {x:27, y:40}],
    W18N1: [{x:28, y:2}, {x:31, y:2}, {x:34, y:2}]
};
var combatZones = [{top: 0, left: 0, bottom: 49, right: 49}];

Creep.prototype.fightClosest = function() {
    var enemies = this.room.find(FIND_HOSTILE_CREEPS);
    if (enemies.length) {
        this.moveTo(enemies[0]);
        this.attack(enemies[0]);
    };
};

Creep.prototype.rangersJob_PassThrough = function(targetRoom) {
    var goTo = null;
    if (targetRoom) goTo = new RoomPosition(targetRoom.x, targetRoom.y, targetRoom.name);
    else goTo = Game.getObjectById('55df78923d0aea6af9795560');
    this.moveTo(goTo);
};

Creep.prototype.rangersJob_Default = function(index, targetRoom, rangers) {
    //var timeStart = Game.getUsedCpu();
    var that = this;
    var enemies = dataStore.getHostilesInRoom(this.room.name);
    var structures = dataStore.getHostileStructuresInRoom(this.room.name);

    if (!targetRoom || !this.memory.task) this.memory.task = 'baseDefense';
    
    //this.memory.task = 'attack';

    switch (this.memory.task) {
        case 'attack':
            if (this.room.name!=targetRoom.name) {
                var goTo = new RoomPosition(targetRoom.x, targetRoom.y, targetRoom.name);
                this.moveTo(goTo);
            } else {
                if (enemies.length) {
                    creepCombatTasks._attackUnits(this, function() {
                        creepCombatTasks._attackNearestWall(that, that.room.name);
                    });
                } else if (structures.length>1) {
                    creepCombatTasks._attackStructures(this, structures);
                } else {
                    creepCombatTasks._attackNearestWall(that, that.room.name);
                };
            };
            break;
        case 'baseDefense':
            if (enemies.length) {
                creepCombatTasks._attackUnits(this, null);
            } else {
                if (this.room.name=='W19N1') this.moveTo(Game.getObjectById('55df78923d0aea6af9795560'));
                if (this.room.name=='W18N1') this.moveTo(Game.getObjectById('55e2e02c3d0aea6af9758e92'));
            };
            break;
    };
    //console.log('do ranger things: ', Game.getUsedCpu()-timeStart);
};

Creep.prototype.guardsJob_Default = function() {
    //var timeStart = Game.getUsedCpu();
    var that = this;
    var atMyPost = false;
    var emptyPosts = [];
    _.forEach(lookoutPosts[this.room.name], function(pos) {
        var targets = that.room.getPositionAt(pos.x, pos.y).lookFor('creep');
        if (targets.length==0) emptyPosts.push(pos);
        else if (targets[0].pos.x == that.pos.x && targets[0].pos.y == that.pos.y) atMyPost = true;
    });
    
    if (!atMyPost) {
        if (emptyPosts[0]) this.moveTo(emptyPosts[0].x, emptyPosts[0].y);
        else this.moveTo(40, 30);
    } else {
        //this.rangedMassAttack();
        creepCombatTasks._guardSpot(this)
    };
    //console.log('Guard things: ', Game.getUsedCpu()-timeStart);
};

Creep.prototype.scoutsJob_Default = function(index, targetRoom) {

    /*if (Game.time%100==0) {
        this.memory.task = 'gatherInfo';
    };*/

    var pos = new RoomPosition(30, 5, 'W18N1');

    this.moveTo(pos);
    this.claimController(Game.getObjectById('55c34a6c5be41a0a6e80cab5'));

    /*var atMyTarget = false;
    var goTo = null;
    switch (this.memory.task) {
        case 'gatherInfo':
            if (!targetRoom) return;
            goTo = new RoomPosition(targetRoom.x, targetRoom.y, targetRoom.name);
            if (this.pos != goTo) {
                if (this.fatigue==0) this.moveTo(goTo);
            } else {
                var analysis = this.room.analyse();
                this.memory.task = 'retreat';
            };
            break;
        case 'retreat':
            goTo = Game.getObjectById('55df78923d0aea6af9795560');
            break;
    };*/
};


Creep.prototype.warriorsJob_Default = function(index, targetRoom, rangers) {
    //var timeStart = Game.getUsedCpu();
    var that = this;
    var enemies = dataStore.getHostilesInRoom(this.room.name);
    var structures = dataStore.getHostileStructuresInRoom(this.room.name);

    if (!targetRoom || !this.memory.task) this.memory.task = 'baseDefense';
    
    //this.memory.task = 'attack';

    switch (this.memory.task) {
        case 'attack':
            if (this.room.name!=targetRoom.name) {
                var goTo = new RoomPosition(targetRoom.x, targetRoom.y, targetRoom.name);
                this.moveTo(goTo);
            } else {
                if (enemies.length) {
                    creepCombatTasks._attackUnits(this, function() {
                        creepCombatTasks._attackNearestWall(that, that.room.name);
                    });
                } else if (structures.length>1) {
                    creepCombatTasks._attackStructures(this, structures);
                } else {
                    creepCombatTasks._attackNearestWall(that, that.room.name);
                };
            };
            break;
        case 'baseDefense':
            if (enemies.length) {
                creepCombatTasks._attackUnits(this, null);
            } else {
                if (this.room.name=='W19N1') this.moveTo(Game.getObjectById('55df78923d0aea6af9795560'));
                if (this.room.name=='W18N1') this.moveTo(Game.getObjectById('55e2e02c3d0aea6af9758e92'));
            };
            break;
    };
    //console.log('do ranger things: ', Game.getUsedCpu()-timeStart);
};

