
Room.prototype.handleLinks = function() {
    var linkRefs = (this.memory.links)?this.memory.links.split('-'):null;
    if (linkRefs) {
        var links = [Game.getObjectById(linkRefs[0]), Game.getObjectById(linkRefs[1]), Game.getObjectById(linkRefs[2]), Game.getObjectById(linkRefs[3])];

        /*var sortedLinks = _.sortBy(links, function(link) {
            if (link) return link.energy;
        });*/

        if (links[0] && links[0].energy > 250) links[0].transferEnergy(links[1]);
        if (links[2] && links[2].energy > 250) links[2].transferEnergy(links[1]);

        if (links[3] && links[3].energy > 250) links[3].transferEnergy(links[0]);

    };
};