
var dataStore = require('dataStore');
require('structurePrototypes');

var productionLines = {};

module.exports = {
    getNewGuid: function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    },
    estimatedTravelTime: function() {
        var estimate = 0;
        
        return estimate;
    },
    getProductionLine: function(room) {
        if (!productionLines[room]) productionLines[room] = [];
        return productionLines[room];
    },
    sortProductionLine: function(prodLine) {
        var prodLineNew = _.sortBy(prodLine, function(element){  
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
                "mover":           12
            };
            return rank[element];
        });
        return prodLineNew;
    },
    _getMostInNeedOfRepair: function(creep, index) {
        //var timeStart = Game.getUsedCpu();
        
        var lowest = null;
        var walls = null;

        var targets = [];
        switch (index) {
            case '0':
            case 0:
                targets = dataStore.getAllStructures(creep.room.name, STRUCTURE_ROAD);
                break;
            case '1':
            case 1:
                targets = dataStore.getAllStructures(creep.room.name, STRUCTURE_WALL);
                break;
            case '2':
            case 2:
                targets = dataStore.getAllStructures(creep.room.name, STRUCTURE_RAMPART);
                break;
            case '3':
            case 3:
                //targets = dataStore.getAllStructures(creep.room.name, STRUCTURE_WALL);
                break;
        };
        lowest = targets[0];
        var lowestChosen = false;
        _.forEach(targets, function(value) {
            if (value.hits < 2000) {
                lowest = value;
                lowestChosen = true;
            };
            if (!lowestChosen && value.hits && value.needsRepair() && (value.hits < (lowest.hits * 0.9))) {
                lowest = value;
            };
        });
        if (lowest) return lowest.id;
        else return null;
    },
    setMaxCounts: function(spawn, maxCounts) {
        var counts = [];

        if (maxCounts) {
            _.forEach(maxCounts, function(value, key) {
                counts.push(key + ':' + value);
            });

            spawn.memory.maxCounts = counts.join('-');
        };
    },
    getMaxCounts: function(spawn) {
        var grabCounts = spawn.memory.maxCounts.split('-');
        var counts = {};

        for (var i=0; i<grabCounts.length; i++) {
            var thisOne = grabCounts[i].split(':');
            counts[thisOne[0]] = thisOne[1];
        };

        return counts;
    },
    haveEnoughExtensions: function(room, type) {
        if (type=='rangers') return dataStore.getExtensions(room.name).length>4;
        else return true;
    }
}