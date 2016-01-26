
module.exports = {
    increaseMaxCount: function(room, type, amount) {
        if (!Memory.maxCounts[room]) Memory.maxCounts[room] = {};
        if (!Memory.maxCounts[room][type]) Memory.maxCounts[room][type] = 0;

        var increaseBy = parseInt(amount) || 1;
        Memory.maxCounts[room][type] += increaseBy;

        return Memory.maxCounts[room][type];
    },
    decreaseMaxCount: function(room, type, amount) {
        if (!Memory.maxCounts[room]) Memory.maxCounts[room] = {};
        if (!Memory.maxCounts[room][type]) Memory.maxCounts[room][type] = 0;

        var decreaseBy = parseInt(amount) || 1;
        Memory.maxCounts[room][type] += decreaseBy;

        return Memory.maxCounts[room][type];
    },
    setMaxCount: function(room, type, amount) {
        if (!Memory.maxCounts[room]) Memory.maxCounts[room] = {};
        if (!Memory.maxCounts[room][type]) Memory.maxCounts[room][type] = 0;

        Memory.maxCounts[room][type] = parseInt(amount);

        return Memory.maxCounts[room][type];
    }
}