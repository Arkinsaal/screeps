
require('structurePrototypes');

var helperFunctions     = require('helperFunctions');
var dataStore           = require('dataStore');
var creepTasks          = require('creepTasks');


Creep.prototype.harvestersJob_Default = function(index) {
    if (this.carry.energy == 0) {
        this.memory.task = "harvestEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "storeEnergy";
    };

    console.log(this.memory.moveToOther)

    if (this.memory.moveToOther!=undefined) {
        var targetPosition = Game.spawns[this.memory.moveToOther].pos;
        console.log(targetPosition.name, this.room.name)
        if (targetPosition.name != this.room.name) {
            creepTasks._moveToLongDistance(this, targetPosition);
        } else {
            this.memory.moveToOther = undefined;
        };
    } else {
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
                            creepTasks._storeInStorage(creep, creepTasks._upgradeController);
                        });
                    });
                });
                break;
        };
    }
};

Creep.prototype.upgradersJob_Default = function(index) {
    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "storeEnergy";
    };

    switch (this.memory.task) {
        case "getEnergy":
            creepTasks._getEnergyFromLink(this, 1, function(creep) {     
                creepTasks._getEnergyFromStorage(creep, function(creep) {
                    creepTasks._harvestEnergy(creep, 0);
                });  
            });
            break;
        case "storeEnergy":
            creepTasks._upgradeController(this);
            break;
    };
};

Creep.prototype.buildersJob_Default = function(index) {
    var that = this;
    
    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "buildStructure";
    };
    switch (this.memory.task) {
        case "getEnergy":
            creepTasks._getEnergyFromStorage(this, function(creep) {
                creepTasks._harvestEnergy(creep, 0);
            });
            break;
        case "buildStructure":
            creepTasks._buildStructure(this, function(creep) {
                var lowest = Game.getObjectById(helperFunctions._getMostInNeedOfRepair(creep, '0'));
                creep.moveTo(lowest);
                creepTasks._repairStructure(creep, lowest.id, function() {
                    that.memory.target = helperFunctions._getMostInNeedOfRepair(that, '0');
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

Creep.prototype.repairersJob_Default = function(index) {
    var that = this;
    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
        this.memory.target = null;
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "repairStructure";
        this.memory.target = helperFunctions._getMostInNeedOfRepair(this, index);
    };
    
    var timeStart = Game.getUsedCpu();
    
    switch (this.memory.task) {
        case "getEnergy":
            creepTasks._getEnergyFromStorage(this, function(creep) {
                creepTasks._harvestEnergy(creep, 0);
            });
            break;
        case "repairStructure":
        var attempts = 0;
            if (this.memory.target == undefined) this.memory.target = helperFunctions._getMostInNeedOfRepair(this, index);
            creepTasks._repairStructure(this, this.memory.target, function() {
                that.memory.target = helperFunctions._getMostInNeedOfRepair(that, index);
                attempts++;
                return that.memory.target;
            });
            break;
    };
    
};

Creep.prototype.distributersJob_Default = function(index) {

    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "distributeEnergy";
    };

    switch (this.memory.task) {
        case "getEnergy":
            var linkRefs = (this.room.memory.links)?this.room.memory.links.split('-'):null;
            if (linkRefs) var links = [Game.getObjectById(linkRefs[0]), Game.getObjectById(linkRefs[1]), Game.getObjectById(linkRefs[2])];

            if (links && links[0].energy>250 || links[2].energy > 250) {
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

Creep.prototype.travelUpgradersJob_Default = function(index) {

    /*function samePos(pos1, pos2) {
        var samePos = ((pos1.x==pos2.x) && (pos1.y==pos2.y) && (pos1.roomName==pos2.roomName));
        return samePos;
    };*/
   // var targetSourceFlag = Game.flags['SourceFlag-123'];
    var targetHomeFlag = Game.flags['HomeFlag-123'];

    var harvestFlag = Game.flags['HarvestFlag'];


    if (this.carry.energy == 0) {

        if (this.pos.roomName!=harvestFlag.pos.roomName) {
            this.memory.task = "movingAwayFromHome";
        } else {
            this.memory.task = "harvestEnergy";
        };

        //if (!samePos(this.pos,targetSourceFlag.pos) && this.memory.task != "harvestEnergy") this.memory.task = "movingAwayFromHome";
        //else this.memory.task = "harvestEnergy";
    } else if (this.carry.energy == this.carryCapacity) {


        if (this.pos.roomName!=targetHomeFlag.pos.roomName) {
            this.memory.task = "movingHome";
        } else {
            this.memory.task = "storeEnergy";
        };

        //if (!samePos(this.pos,targetHomeFlag.pos)) {
        //    if (this.memory.task == "harvestEnergy") this.memory.task = "movingHome";
        //} else this.memory.task = "storeEnergy";
    };
    
    switch (this.memory.task) {
        case "movingAwayFromHome":
            creepTasks._moveToLongDistance(this, harvestFlag);
            break;
        case "movingHome":
            creepTasks._moveToLongDistance(this, targetHomeFlag);
            break;
        case "harvestEnergy":
            creepTasks._harvestEnergyExternal(this);
            break;
        case "storeEnergy":
            if (!!samePos(this.pos,targetHomeFlag.pos)) {
                GF._moveTo(this, targetHomeFlag)
            } else {
                this.dropEnergy();
            };
            break;
    };
};

Creep.prototype.foundersJob_Default = function(index, roomName){
    if (this.memory.targetRoom == undefined) this.memory.targetRoom = roomName;
    if (this.room.name!=this.memory.targetRoom) {
        this.memory.task = 'moveToRoom';
    } else if (!this.room.controller || !this.room.controller.owner || this.room.controller.owner.username!='Arkinsaal') {
        this.memory.task = 'claimController'
    } else if (this.room.find(FIND_MY_SPAWNS).length==0 && this.memory.task == "claimController") {
        this.room.createConstructionSite(36, 27, STRUCTURE_SPAWN);
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
            if (RoomToFoundFlag) creepTasks._moveToLongDistance(this, RoomToFoundFlag.pos);
            break
        case 'claimController':
            creepTasks._claimController(this);
            break;
        case "getEnergy":
            creepTasks._harvestEnergy(this, 0);
            break;
        case "buildStructure":
            if (index==0) {
                creepTasks._upgradeController(this);
            } else {
                creepTasks._storeInSpawn(this, function(creep) {
                    creepTasks._storeInExtensions(creep, function(creep) {
                        creepTasks._buildStructure(creep, function(creep) {
                            // do nothing
                        });
                    })
                });
            }
            break;
    };
};

Creep.prototype.roomReserversJob_Default = function() {
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

Creep.prototype.collectorsJob_Default = function() {

    if (this.carry.energy == 0) {
        this.memory.task = "collect";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "storeEnergy";
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

Creep.prototype.moversJob_Default = function() {

    if (this.carry.energy == 0) {
        this.memory.task = "getEnergy";
    } else if (this.carry.energy == this.carryCapacity) {
        this.memory.task = "takeToOther";
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