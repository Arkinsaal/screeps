
RoomPosition.prototype._addConstructionSite = function() {
    var structures = this.lookFor('structure');
    var foundRoad = false;
    for (structure in structures) {
    	if (structure.type=='STRUCTURE_ROAD') foundRoad = true;
    };
    if (!foundRoad) {
    	//if (this.memory.votes==undefined) this.memory.votes=1;
    	//else this.memory.votes++;
    	//this.createConstructionSite(STRUCTURE_ROAD);
    };
};