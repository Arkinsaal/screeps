

require('structurePrototypes');

var helperFunctions     = require('helperFunctions');
var dataStore           = require('dataStore');
var creepTasks          = require('creepTasks');
var GF                  = require('globalFunctions');



    function samePos(pos1, pos2) {
        var samePos = ((pos1.x==pos2.x) && (pos1.y==pos2.y) && (pos1.roomName==pos2.roomName));
        return samePos;
    };

Creep.prototype.harvesterJob = function() {
    if (this.carry.energy == 0) {
        this.memory.task = "harvestEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "storeEnergy";
    } else if (this.memory.task==undefined) {
        this.memory.task = "harvestEnergy";
    };

    if (this.memory.moveToOther!=undefined) {
        var targetPosition = Game.spawns[this.memory.moveToOther].pos;
        if (targetPosition.roomName != this.room.name) {
            creepTasks._moveToLongDistance(this, targetPosition);
        } else {
            this.memory.moveToOther = undefined;
        };
    } else {
        if (dataStore.screepCensus()[this.room.name] && dataStore.screepCensus()[this.room.name][this.memory.role]) var index = dataStore.screepCensus()[this.room.name][this.memory.role].indexOf(this);
        switch (this.memory.task) {
            case "harvestEnergy":
                var source = (index%2==0) ? 0 : 1;
                creepTasks._harvestEnergy(this, source);
                break;
            case "storeEnergy":
                var nearestLink = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_LINK }
                });
                creepTasks._storeInLink(this, nearestLink, function(creep) {
                    creepTasks._storeInSpawn(creep, function(creep) {
                        creepTasks._storeInExtensions(creep, function(creep) {
                            creepTasks._storeInStorage(creep, function() {
                                if (creep.room.name=='W7N5') {
                                    if (!samePos(creep.pos, Game.flags['dropEnergyHere'].pos)) {
                                        GF._moveTo(creep, Game.flags['dropEnergyHere']);
                                    } else {
                                        creep.dropEnergy();
                                    };
                                } else {
                                    creepTasks._upgradeController(creep);
                                }
                            });
                        });
                    });
                });
                break;
        };
    };
};

Creep.prototype.upgraderJob = function() {
    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "storeEnergy";
    } else if (this.memory.task==undefined) {
        this.memory.task = "getEnergy";
    };

    switch (this.memory.task) {
        case "getEnergy":
            if (this.room.name=='W7N5') {
                creepTasks._getDroppedEnergy(this);
            } else {
                creepTasks._getEnergyFromLink(this, 1, function(creep) {     
                    creepTasks._getEnergyFromStorage(creep, function(creep) {
                        creepTasks._harvestEnergy(creep, 0);
                    });  
                });
            }
            break;
        case "storeEnergy":
            creepTasks._upgradeController(this);
            break;
    };
};

Creep.prototype.builderJob = function() {
    var that = this;
    
    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "buildStructure";
    } else if (this.memory.task==undefined) {
        this.memory.task = "getEnergy";
    };
    
    switch (this.memory.task) {
        case "getEnergy":
            creepTasks._getEnergyFromStorage(this, function(creep) {
                creepTasks._harvestEnergy(creep, 0);
            });
            break;
        case "buildStructure":
            creepTasks._buildStructure(this, function(creep) {
                var lowest = Game.getObjectById(helperFunctions._getMostInNeedOfRepair(creep, 2));
                if (!lowest) lowest = Game.getObjectById(helperFunctions._getMostInNeedOfRepair(creep, 1));
                if (!lowest) lowest = Game.getObjectById(helperFunctions._getMostInNeedOfRepair(creep, 0));
                if (!lowest) return;
                creep.moveTo(lowest);
                creepTasks._repairStructure(creep, lowest.id, function() {
                    that.memory.target = helperFunctions._getMostInNeedOfRepair(that, 2);
                    return that.memory.target;
                });
                /*creepTasks._storeInSpawn(creep, function(creep) {
                    creepTasks._storeInExtensions(creep, creepTasks._storeInStorage)
                });
                creepTasks._upgradeController*/
            });
            break;
    };
};

Creep.prototype.repairerJob = function() {

    var that = this;

    if (dataStore.screepCensus()[this.room.name] && dataStore.screepCensus()[this.room.name][this.memory.role]) var index = dataStore.screepCensus()[this.room.name][this.memory.role].indexOf(this);

    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
        this.memory.target = null;
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "repairStructure";
        this.memory.target = helperFunctions._getMostInNeedOfRepair(this, index);
    } else if (this.memory.task==undefined) {
        this.memory.task = "getEnergy";
    };
    
    switch (this.memory.task) {
        case "getEnergy":
            creepTasks._getEnergyFromStorage(this, function(creep) {
                creepTasks._harvestEnergy(creep, 0);
            });
            break;
        case "repairStructure":
            var attempts = 0;
            if (this.memory.target == undefined || this.memory.target==null) this.memory.target = helperFunctions._getMostInNeedOfRepair(this, index);
            creepTasks._repairStructure(this, this.memory.target, function() {
                that.memory.target = helperFunctions._getMostInNeedOfRepair(that, index);
                attempts++;
                return that.memory.target;
            });
            break;
    };
    
};

Creep.prototype.distributerJob = function() {

    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "distributeEnergy";
    } else if (this.memory.task==undefined) {
        this.memory.task = "getEnergy";
    };

    switch (this.memory.task) {
        case "getEnergy":
            var linkRefs = (this.room.memory.links)?this.room.memory.links.split('-'):null;
            if (linkRefs) var links = [Game.getObjectById(linkRefs[0]), Game.getObjectById(linkRefs[1]), Game.getObjectById(linkRefs[2])];

            if (links && links[0] && links[2] && (links[0].energy>250 || links[2].energy > 250)) {
                var linkToGetFrom = (links[0].energy > links[2].energy) ? 0 : 2;
                creepTasks._getEnergyFromLink(this, linkToGetFrom, function(creep) {
                    //no fallback
                });
            } else {
                creepTasks._getEnergyFromStorage(this, function(creep) {
                    //no fallback
                });
            };
            break;
        case "distributeEnergy":
            creepTasks._storeInExtensions(this, function(creep) {
                creepTasks._storeInSpawn(creep, function(creep) {
                    creepTasks._storeInLink(creep, 2, function(creep) {
                        creepTasks._storeInStorage(creep)
                    });
                });
            });
            break;
    };
};

Creep.prototype.travelUpgraderJob = function() {

    function samePos(pos1, pos2) {
        var samePos = ((pos1.x==pos2.x) && (pos1.y==pos2.y) && (pos1.roomName==pos2.roomName));
        return samePos;
    };
    var targetHomeFlag = Game.flags['HomeFlag-123'];
    var targetHomeFlags = [
        Game.flags['HomeFlag-456'],
        Game.flags['HomeFlag-123']
    ];
    var harvestFlag = Game.flags['HarvestFlag'];

    var travelUpgraders = _.filter(Game.creeps, {memory: {role:'travelUpgrader'}});
    var index = travelUpgraders.indexOf(this);

    if (this.carry.energy == 0) {
        if (this.pos.roomName!=harvestFlag.pos.roomName) {
            this.memory.task = "movingAwayFromHome";
        } else {
            this.memory.task = "harvestEnergy";
        };
    } else if (this.carry.energy == this.carryCapacity) {
        if (this.pos.roomName!=targetHomeFlags[(index%2)].pos.roomName) {
            this.memory.task = "movingHome";
        } else {
            this.memory.task = "storeEnergy";
        };
    };
    
    switch (this.memory.task) {
        case "movingAwayFromHome":
            creepTasks._moveToLongDistance(this, harvestFlag);
            break;
        case "movingHome":
            creepTasks._moveToLongDistance(this, targetHomeFlags[(index%2)]);
            break;
        case "harvestEnergy":
            creepTasks._harvestEnergyExternal(this, index);
            break;
        case "storeEnergy":
            if (!samePos(this.pos,targetHomeFlags[(index%2)].pos)) {
                GF._moveTo(this, targetHomeFlags[(index%2)])
            } else {
                this.dropEnergy();
            };
            break;
    };
};

Creep.prototype.founderJob = function(){
    if (this.memory.targetRoom == undefined) return;

    if (dataStore.screepCensus()[this.room.name] && dataStore.screepCensus()[this.room.name][this.memory.role]) var index = dataStore.screepCensus()[this.room.name][this.memory.role].indexOf(this);

    if (this.room.name!=this.memory.targetRoom) {
        this.memory.task = 'moveToRoom';
    } else if (!this.room.controller || !this.room.controller.owner || this.room.controller.owner.username!='Arkinsaal') {
        this.memory.task = 'claimController'
    } else if (this.room.find(FIND_MY_SPAWNS).length==0 && this.memory.task == "claimController") {
        this.room.createConstructionSite(27, 17, STRUCTURE_SPAWN);
    } else {
        if (this.memory.task != "getEnergy" && this.memory.task!="buildStructure") this.memory.task = "getEnergy"; 
        if (this.carry.energy == 0) {
            this.memory.task = "getEnergy";
        } else if (this.carry.energy == this.carryCapacity) {
            this.memory.task = "buildStructure";
        };
    };

    switch (this.memory.task) {
        case 'moveToRoom':
            var RoomToFoundFlag = Game.flags['RoomToFound'];
            var moveToPos = new RoomPosition(25, 25, this.memory.targetRoom);
            if (RoomToFoundFlag) creepTasks._moveToLongDistance(this, moveToPos);
            break;
        case 'claimController':
            creepTasks._claimController(this);
            break;
        case "getEnergy":
            creepTasks._harvestEnergy(this, 0);
            break;
        case "buildStructure":
            creepTasks._storeInSpawn(this, function(creep) {
                creepTasks._storeInExtensions(creep, function(creep) {
                    creepTasks._buildStructure(creep, function(creep) {

                        if (!samePos(creep.pos, Game.flags['dropEnergyHere'].pos)) {
                            GF._moveTo(creep, Game.flags['dropEnergyHere']);
                        } else {
                            creep.dropEnergy();
                        };
                        // do nothing
                    });
                })
            });
            break;
    };
};

Creep.prototype.roomReserverJob = function() {
    if (this.pos.room!=roomName) {
        this.memory.task = 'moveToRoom';
    } else {
        if (this.carry.energy == 0) {
            this.memory.task = "getEnergy";
        } else if (this.carry.energy == this.carryCapacity) {
            this.memory.task = "reserveController";
        };
    }

    switch (this.memory.task) {
        case "moveToRoom":
            creepTasks._moveToLongDistance(this, targetSourceFlag.pos);
            break;
        case "getEnergy":
            creepTasks._harvestEnergy(creep, 0);
            break;
        case "reserveController":
            creepTasks._reserveController(this);
            break;
    };
};

Creep.prototype.collectorJob = function() {

    if (this.carry.energy == 0) {
        this.memory.task = "collect";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "storeEnergy";
    } else if (this.memory.task==undefined) {
        this.memory.task = "collect";
    };

    switch (this.memory.task) {
        case "collect":
            creepTasks._getDroppedEnergy(this, function() {
                // do nothing
            });
            break;
        case "storeEnergy":
            creepTasks._storeInSpawn(this, function(creep) {
                creepTasks._storeInExtensions(creep, function(creep) {
                    creepTasks._storeInStorage(creep, creepTasks._upgradeController);
                });
            });
            break;
    };
};

Creep.prototype.moverJob = function() {

    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "takeToOther";
    } else if (this.memory.task==undefined) {
        this.memory.task = "getEnergy";
    };

    switch (this.memory.task) {
        case "getEnergy":
            creepTasks._getEnergyFromOtherStorage(this, function(creep) {
                //no fallback
            });
            break;
        case "takeToOther":
            creepTasks._storeInOtherStorage(this, function(creep) {
                //no fallback
            });
            break;
    };
};

function compareArrays(baseline, compare) {
    for (var j = 0; j < compare.length; j++) {
        if (baseline.indexOf(compare[j]) == -1) {
            baseline.splice(baseline.indexOf(compare[j]), 1);
        }
    };
    return baseline;
};

Creep.prototype.remoteHarvesterJob = function() {

    //console.log(GF._findClosestOwnedRoom(this.pos));

    if (!this.memory.targetSite) {
        var remoteMiningOperations = [];
        _.forEach(Game.flags, function(flag) {
            if (flag.name.indexOf('remoteMining') != -1) remoteMiningOperations.push(flag.pos);
        });
        
        var remoteMiners = [];
        _.forEach(Game.creeps, function(thisCreep) {
            if (thisCreep.memory.role == 'remoteHarvester') remoteMiners.push(thisCreep.pos);
        });

        var missing = compareArrays(remoteMiningOperations, remoteMiners);

        this.memory.targetSite = missing[0];
    };

    function samePos(pos1, pos2) {
        var samePos = ((pos1.x==pos2.x) && (pos1.y==pos2.y) && (pos1.roomName==pos2.roomName));
        return samePos;
    };

    if (!samePos(this.pos, this.memory.targetSite)) {
        var pos = new RoomPosition(this.memory.targetSite.x, this.memory.targetSite.y, this.memory.targetSite.roomName);
        GF._moveTo(this, pos)
    } else {
        creepTasks._harvestNearest(this);
    };
    
};

Creep.prototype.remoteCollectorJob = function() {

    if (!this.memory.targetSite) {
        var remoteMiningCollections = [];
        _.forEach(Game.flags, function(flag) {
            if (flag.name.indexOf('remoteCollection') != -1) remoteMiningCollections.push(flag.pos);
        });
        
        var remoteCollectors = [];
        _.forEach(Game.creeps, function(thisCreep) {
            if (thisCreep.memory.role == 'remoteCollector') remoteCollectors.push(thisCreep.pos);
        });

        var missing = compareArrays(remoteMiningCollections, remoteCollectors);

        this.memory.targetSite = missing[0];
    };

    function samePos(pos1, pos2) {
        var samePos = ((pos1.x==pos2.x) && (pos1.y==pos2.y) && (pos1.roomName==pos2.roomName));
        return samePos;
    };

    if (!samePos(this.pos, this.memory.targetSite)) {
        this.memory.task = "moveToEnergy";
    } else {
        if (this.carry.energy<this.carryCapacity) {
            this.memory.task = "collectEnergy";
        } else {
            this.memory.task = "returnEnergy";
        };
    }

    switch(this.memory.task) {
        case "moveToEnergy":
            var pos = new RoomPosition(this.memory.targetSite.x, this.memory.targetSite.y, this.memory.targetSite.roomName);
            GF._moveTo(this, pos);
            break;
        case "collectEnergy":
            creepTasks._getDroppedEnergy(this);
            break;
        case "returnEnergy":
            creepTasks._getDroppedEnergy(this);
            break;
    }
    
};