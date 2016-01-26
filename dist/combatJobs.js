
require('roomAnalysis');

var dataStore           = require('dataStore');
var creepTasks          = require('creepTasks');
var creepCombatTasks    = require('creepCombatTasks');

var lookoutPosts = {
    W19N1: [{x:47, y:17}, {x:31, y:40}, {x:30, y:40}, {x:47, y:18}, {x:26, y:40}, {x:47, y:19}, {x:27, y:40}],
    W18N1: [{x:28, y:2}, {x:31, y:2}, {x:34, y:2}]
};

Creep.prototype.rangerJob = function() {
    var that = this;
    var enemies = dataStore.getHostilesInRoom(this.room.name);
    var structures = dataStore.getHostileStructuresInRoom(this.room.name);
    var targetRoom = this.memory.targetRoom;

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
};

Creep.prototype.guardJob = function() {
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

Creep.prototype.scoutJob = function() {

};


Creep.prototype.warriorJob = function() {
    var that = this;
    var targetRoom = this.memory.targetRoom;

    if (!targetRoom || !this.memory.task) this.memory.task = 'baseDefense';

    if (this.room.name!=targetRoom) {
        this.memory.task = 'moveToRoom';
    } else if (this.room.name==targetRoom) {
        this.memory.task = 'attack'
    }

    switch (this.memory.task) {
        case 'moveToRoom':
            var moveToPos = new RoomPosition(25, 25, this.memory.targetRoom);
            creepTasks._moveToLongDistance(this, moveToPos);
            break
        case 'attack':
            var enemies = dataStore.getHostilesInRoom(this.room.name);
            var structures = dataStore.getHostileStructuresInRoom(this.room.name);
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
};

