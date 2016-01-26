
Structure.prototype.needsRepair = function() {
    switch (this.structureType) {
        case 'constructedWall':
            return (this.hits<this.hitsMax && this.hits<1000000);
            break;
        case 'rampart':
            return (this.hits<this.hitsMax && this.hits<30000000);
            break;
        case 'road':
            return (this.hits<this.hitsMax);
            break;
    };
}