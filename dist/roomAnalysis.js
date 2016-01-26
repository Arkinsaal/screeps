
var dataStore           = require('dataStore');

Creep.prototype.analyse = function() {
    var enemyAnalysis = {
        partCounts: {
            'RANGED_ATTACK': 0,
            'MELEE': 0,
            'HEAL': 0,
            'MOVE': 0,
            'TOUGH': 0
        },
        probableFunction: null,
        priority: 0
    };
    for (var i=0; i< this.body.length; i++) {
        partCounts[this.body[i]]++;
    };
    
    if (enemyAnalysis.partCounts['HEAL']>0) enemyAnalysis.priority = 0;
    
    if (enemyAnalysis,partCounts['MELEE'] > enemyAnalysis.partCounts['RANGED_ATTACK']) {
        enemyAnalysis.probableFunction = 'fighter';
    } else {
        enemyAnalysis.probableFunction = 'ranger';
    };
    
    return enemyAnalysis;
};

Room.prototype.analyse = function() {
    var roomCombatAnalysis = {
        analysedEnemies: []
    };
    var enemiesInRoom = dataStore.getHostilesInRoom(this.name);

    _.forEach(enemiesInRoom, function(enemy) {
        roomCombatAnalysis.analysedEnemies.push(enemy.analyse());
    });
    
    return roomCombatAnalysis;
};





