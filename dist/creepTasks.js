
var GF					= require('globalFunctions');
var dataStore 			= require('dataStore');

module.exports = {
	_getEnergyFromStorage: function(creep, fallback) {
	    var storage = creep.room.storage;
	    if (!storage || storage.store.energy==0) fallback(creep);
	    else {
	    	if (storage.transferEnergy(creep)!=0) {
	    		GF._moveTo(creep, storage);
	    	} else {
	    		creep.memory.path = null;
	    	};
	    };
	},
	_getEnergyFromLink: function(creep, link, fallback) {
	    var linkRefs = (creep.room.memory.links)?creep.room.memory.links.split('-'):null;
	    if (linkRefs) {
		    var links = [Game.getObjectById(linkRefs[0]), Game.getObjectById(linkRefs[1]), Game.getObjectById(linkRefs[2])];
		    if (links[link] && links[link].energy) {
		    	if (links[link].transferEnergy(creep)!=0) {
		    		GF._moveTo(creep, links[link]);
		    	} else {
	    			creep.memory.path = null;
		    	};
		    } else {
		    	GF._callForEnergy(creep.room);
		    	fallback(creep);
		    };
	    } else {
	    	fallback(creep);
	    };
	},
	_storeInExtensions: function(creep, fallback) {
		if (!creep.memory.target) {
		    //var extensions = dataStore.getExtensions(creep.room.name);
		    var closestExtension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
		    	filter: function(object) {
		        	return (object.energy<object.energyCapacity && object.structureType=='extension')
		    	}
		    });
        	if (closestExtension) creep.memory.target = closestExtension.id;
		};
	    if (creep.memory.target) {
	    	var targetExtension = Game.getObjectById(creep.memory.target);
	    	var transferResult = creep.transferEnergy(targetExtension);
	    	if (transferResult==0 || transferResult==-8) {
	    		creep.memory.target = null;
	    		creep.memory.path = null;
	    	} else {
	    		GF._moveTo(creep, targetExtension);
	    	};
	    } else {
	    	if (fallback) fallback(creep);
	    };
	},
	_harvestEnergy: function(creep, source) {
	    var sources = creep.room.find(FIND_SOURCES);
        if (sources[0].energy==0) source = 1;

    	if (creep.harvest(sources[source])!=0) {
    		GF._moveTo(creep, sources[source]);
    	} else {
    		creep.memory.path = null;
    	};
	},
	_storeInStorage: function(creep, fallback) {
	    var storage = creep.room.storage;
	    if (storage) {
	    	if (creep.transferEnergy(storage)!=0) {
	    		GF._moveTo(creep, storage);
	    	} else {
	    		creep.memory.path = null;
	    	};
		} else {
	    	if (fallback) fallback(creep);
		};
	},

	_storeInSpawn: function(creep, fallback) {
        var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        if (!spawn && fallback) {
        	fallback(creep);
        	return;
    	};
		if (spawn.energy < spawn.energyCapacity) {
	    	if (creep.transferEnergy(spawn)!=0) {
	    		GF._moveTo(creep, spawn);
	    	} else {
	    		creep.memory.path = null;
	    	};
		} else {
	    	if (fallback) fallback(creep);
		};
	},
	_storeInLink: function(creep, link, fallback) {
	    var linkRefs = (creep.room.memory.links)?creep.room.memory.links.split('-'):null;
	    if (linkRefs) {
		    //var links = [Game.getObjectById(linkRefs[0]), Game.getObjectById(linkRefs[1]), Game.getObjectById(linkRefs[2])];
		    var diffNeeded = (creep.memory.role=='distributer') ? 1 : link.energyCapacity;
		    if (link.energy<diffNeeded) {
		    	if (creep.transferEnergy(link)!=0) {
		    		GF._moveTo(creep, link);
		    	} else {
		    		creep.memory.path = null;
		    	};
		    } else {
		        fallback(creep);
		    };
	    } else {
	        fallback(creep);
	    };
	},
	_buildStructure: function(creep, fallback) {
	    var targets = dataStore.getConstructionSites(creep.room.name);
	    if (targets.length) {
	    	if (creep.build(targets[0])!=0) {
	    		GF._moveTo(creep, targets[0]);
	    	} else {
	    		creep.memory.path = null;
	    	};
	    } else {
	    	if (fallback) fallback(creep);
	    };
	},
	_repairStructure: function(creep, id, getNext) {
		//var timeStart = Game.getUsedCpu();
		if (!id) return;
	    var lowest = Game.getObjectById(id);
	    if (lowest.hits==lowest.hitsMax) lowest = Game.getObjectById(getNext());
	    else {
	    	if (creep.repair(lowest)!=0) {
	    		GF._moveTo(creep, lowest);
	    	} else {
	    		creep.memory.path = null;
	    	};
	    };
	    //console.log('repair structure: ', Game.getUsedCpu()-timeStart);
	},
	_upgradeController: function(creep) {
		//var timeStart = Game.getUsedCpu();
	    var ctrl = creep.room.controller;
	    if (creep.upgradeController(ctrl)!=0) {
	    	GF._moveTo(creep, ctrl);
	    } else {
	    	creep.memory.path = null;
	    };
	    //console.log('Upgrade ctrl: ', Game.getUsedCpu()-timeStart);
	},
	_claimController: function(creep) {
	    var ctrl = creep.room.controller;
	    if (creep.claimController(ctrl)!=0) {
	    	GF._moveTo(creep, ctrl);
	    } else {
	    	creep.memory.path = null;
	    };
	},
	_unclaimController: function(creep) {
	    var ctrl = creep.room.controller;
	    if (creep.unclaimController(ctrl)!=0) {
	    	GF._moveTo(creep, ctrl);
	    } else {
	    	creep.memory.path = null;
	    };
	},
	_reserveController: function(creep) {
	    var ctrl = creep.room.controller;
	    if (creep.reserveController(ctrl)!=0) {
	    	GF._moveTo(creep, ctrl);
	    } else {
	    	creep.memory.path = null;
	    };
	},
	_harvestEnergyExternal: function(creep, index) {
		var sourceToUse = (index%2);
		var source = creep.room.find(FIND_SOURCES);
    	if (creep.harvest(source[sourceToUse])!=0) {
    		GF._moveTo(creep, source[sourceToUse]);
    	} else {
    		creep.memory.path = null;
    	};
	},
	_upgradeControllerFromExternal: function(creep) {
	    var ctrl = creep.room.controller;
    	if (creep.upgradeController(ctrl)!=0) {
    		GF._moveTo(creep, ctrl);
    	} else {
    		creep.memory.path = null;
    	};
	},
	_getDroppedEnergy: function(creep) {
		var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        if (energy) {
	    	if (creep.pickup(energy)!=0) {
	    		GF._moveTo(creep, energy);
	    	} else {
	    		creep.memory.path = null;
	    	};
        };
	},
	_getEnergyFromOtherStorage: function(creep) {
	    var storage = Game.getObjectById('55e67f0822474f79098d9935');
	    if (!storage) fallback(creep);
	    else {
	    	if (storage.transferEnergy(creep)!=0) {
	    		GF._moveTo(creep, storage);
	    	} else {
	    		creep.memory.path = null;
	    	};
	    };
	},
	_storeInOtherStorage: function(creep) {
	    var storage = Game.getObjectById('55f6b677acb150ea461df56e');
	    if (storage) {
	    	if (creep.transferEnergy(storage)!=0) {
	    		GF._moveTo(creep, storage);
	    	} else {
	    		creep.memory.path = null;
	    	};
		} else {
	    	if (fallback) fallback(creep);
		};
	},
	_moveToLongDistance: function(creep, targetRoomPos) {
		GF._moveTo(creep, targetRoomPos, 500, 1000);
	},
	_harvestNearest: function(creep) {
	    var source = creep.pos.findClosestByRange(FIND_SOURCES);

    	if (creep.harvest(source)!=0) {
    		GF._moveTo(creep, source);
    	} else {
    		creep.memory.path = null;
    	};
	}
};