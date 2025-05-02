# BEGIN MODULE: /modules/leroyObserver.js [by ARCHITECT #2]

/**
 * Leroy Observer
 * This module checks if an incoming character, world, or archetype has already been seen in the system.
 * If repeated: returns "familiar"
 * If new info is found: returns "new data"
 * If new entity: returns "new entity"
 */

const knownRoster = require('../docs/roster_index.json'); // Simulated parsed JSON for real use

function checkEntity(entityType, entityName, details = {}) {
  const lowerName = entityName.toLowerCase();

  if (!knownRoster[entityType]) {
    return { status: 'unknown type' };
  }

  const match = knownRoster[entityType].find(e => e.name.toLowerCase() === lowerName);

  if (match) {
    // Check for new data in details
    const newKeys = [];
    for (const key in details) {
      if (!match[key] || match[key] !== details[key]) {
        newKeys.push(key);
      }
    }

    return {
      status: newKeys.length ? 'new data' : 'familiar',
      newKeys,
      match
    };
  }

  return { status: 'new entity', newKeys: Object.keys(details), proposedEntry: details };
}

module.exports = {
  checkEntity
};
# END MODULE
