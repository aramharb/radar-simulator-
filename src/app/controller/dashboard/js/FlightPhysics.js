// Converts knots → meters/sec
function knotsToMs(knots) {
  return knots * 0.514444;
}

export default class FlightPhysics {
  constructor(perf) {
    this.minLevel = perf.MINLEVEL;
    this.maxLevel = perf.MAXLEVEL;

    this.climbRate = perf.CLIMBINGRATE; // ft/min or m/min (tell me)
    this.descentRate = perf.DESCENTRATE;

    this.climbSpeed = knotsToMs(perf.CLIMBINGSPEED);
    this.descentSpeed = knotsToMs(perf.DESCENTSPEED);
    this.stallingSpeed = knotsToMs(perf.STALLINGSPEED);
    this.cruiseSpeed = knotsToMs(perf.CRUISINGSPEED);
    this.maxSpeed = knotsToMs(perf.MAXSPEED);
  }

  // Determine the correct target speed depending on altitude
  getTargetSpeed(currentAlt, targetAlt) {
    if (currentAlt < targetAlt - 50) {
      // climbing
      return this.climbSpeed;
    }

    if (currentAlt > targetAlt + 50) {
      // descending
      return this.descentSpeed;
    }

    // cruising
    return this.cruiseSpeed;
  }

  // altitude change per second
  getVerticalSpeed(currentAlt, targetAlt) {
    if (currentAlt < targetAlt - 5) {
      return this.climbRate / 60; // ft/min → ft/sec
    }

    if (currentAlt > targetAlt + 5) {
      return -this.descentRate / 60;
    }

    return 0; // level flight
  }
}
