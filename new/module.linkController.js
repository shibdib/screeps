/**
 * Created by Bob on 6/6/2017.
 */

const profiler = require('screeps-profiler');

function linkControl() {
    for (let link of _.values(Game.structures)) {
        if (link.structureType === STRUCTURE_LINK && link.id !== link.room.memory.controllerLink && link.id !== link.room.memory.storageLink && link.cooldown === 0) {
            let energyPercentage = link.room.energyAvailable / link.room.energyCapacityAvailable;
            if (link.pos.findInRange(FIND_STRUCTURES, 3, {filter: (s) => s.structureType === STRUCTURE_STORAGE}).length > 0 && !Game.getObjectById(link.room.memory.storageLink)) {
                link.room.memory.storageLink = link.id;
                return;
            }
            if (link.pos.findInRange(FIND_STRUCTURES, 3, {filter: (s) => s.structureType === STRUCTURE_CONTROLLER}).length > 0 && !Game.getObjectById(link.room.memory.controllerLink)) {
                link.room.memory.controllerLink = link.id;
                return;
            }
            if ((Game.getObjectById(link.room.memory.storageLink) || Game.getObjectById(link.room.memory.controllerLink)) && link.energy > 100) {
                let storageLink = Game.getObjectById(link.room.memory.storageLink);
                if (!storageLink) link.room.memory.storageLink = undefined;
                let controllerLink = Game.getObjectById(link.room.memory.controllerLink);
                if (!controllerLink) link.room.memory.storageLink = undefined;
                if (storageLink && storageLink.energy < 700 && ((controllerLink && controllerLink.energy > 250) || (energyPercentage < 0.5))) {
                    link.transferEnergy(storageLink);
                } else if (controllerLink && controllerLink.energy < 250) {
                    link.transferEnergy(controllerLink);
                } else if (storageLink && storageLink.energy < 700) {
                    link.transferEnergy(storageLink);
                } else if (controllerLink && controllerLink.energy < 700) {
                    link.transferEnergy(controllerLink);
                }
            }
        }
    }
}

module.exports.linkControl = profiler.registerFN(linkControl, 'linkControl');