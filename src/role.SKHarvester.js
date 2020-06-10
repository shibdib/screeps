/*
 * Copyright (c) 2020.
 * Github - Shibdib
 * Name - Bob Sardinia
 * Project - Overlord-Bot (Screeps)
 */

/**
 * Created by Bob on 7/12/2017.
 */

module.exports.role = function (creep) {
    if (creep.shibKite() || creep.fleeHome()) return true;
    if (creep.room.name === creep.memory.destination) {
        //If source is set mine
        if (!creep.memory.source && !creep.findSource()) creep.findMineral();
        let source = Game.getObjectById(creep.memory.source);
        // handle safe SK movement
        let lair = creep.pos.findInRange(creep.room.structures, 5, {filter: (s) => s.structureType === STRUCTURE_KEEPER_LAIR})[0];
        let SK = creep.pos.findInRange(creep.room.creeps, 5, {filter: (c) => c.owner.username === 'Source Keeper'})[0];
        if (SK) return creep.shibKite(6); else if (lair && lair.ticksToSpawn <= 10) return creep.flee(lair, 7);
        // Handle healing
        switch (creep.harvest(source)) {
            case ERR_NOT_IN_RANGE:
                creep.shibMove(source);
                break;
            case OK:
                Memory.roomCache[creep.room.name].mined = Game.time;
                break;
        }
    } else creep.shibMove(new RoomPosition(25, 25, creep.memory.destination), {range: 23});
};