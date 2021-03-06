/*
 * Copyright (c) 2020.
 * Github - Shibdib
 * Name - Bob Sardinia
 * Project - Overlord-Bot (Screeps)
 */

let highCommand = require('military.highCommand');
Creep.prototype.harass = function () {
    // Attack in range
    this.attackInRange();
    // Handle healing
    this.healInRange();
    // Handle flee
    if (this.memory.runCooldown || (!this.getActiveBodyparts(RANGED_ATTACK) && !this.getActiveBodyparts(ATTACK))) return this.fleeHome(true);
    // Handle combat
    if ((this.room.hostileCreeps.length || this.room.hostileStructures.length) && this.canIWin(50) && this.handleMilitaryCreep()) return;
    // Set heal partner
    if (!this.memory.squadLeader || !Game.getObjectById(this.memory.squadLeader)) {
        let squadLeader = _.filter(Game.creeps, (c) => c.memory && c.memory.squadLeader === c.id && c.memory.operation === 'harass' && c.memory.destination === this.memory.destination && !c.memory.buddyAssigned)[0];
        if (!squadLeader && this.memory.role === 'longbow') this.memory.squadLeader = this.id; else if (squadLeader) {
            this.memory.squadLeader = squadLeader.id;
            return;
        }
    } else if (this.memory.squadLeader && this.memory.squadLeader !== this.id) return;
    let partner = _.filter(Game.creeps, (c) => c.my && c.memory.squadLeader === this.id && c.id !== this.id)[0];
    if (partner) {
        // Move
        partner.shibMove(this, {range: 0});
    }
    if (this.room.name === this.memory.destination || !this.memory.destination) {
        this.say(['Contact', MY_USERNAME, 'For', 'A', 'Diplomatic', 'Resolution'][Game.time % 6], true);
        highCommand.generateThreat(this);
        highCommand.operationSustainability(this.room);
        if (!this.room.hostileCreeps.length && !this.room.hostileStructures.length) {
            this.scorchedEarth();
            if (!this.shibKite()) this.findDefensivePosition();
        }
        let armedEnemies = _.filter(this.room.hostileCreeps, (c) => (c.getActiveBodyparts(ATTACK) || c.getActiveBodyparts(RANGED_ATTACK)) && !_.includes(FRIENDLIES, c.owner.username));
        if (armedEnemies.length) Memory.targetRooms[this.memory.destination].level = 2; else {
            if (this.room.controller && (this.room.controller.owner || this.room.controller.reservation)) Memory.targetRooms[this.memory.destination].claimAttacker = true;
        }
    } else
        // Move if needed
    if (this.memory.destination && this.room.name !== this.memory.destination) return this.shibMove(new RoomPosition(25, 25, this.memory.destination), {range: 22});
};