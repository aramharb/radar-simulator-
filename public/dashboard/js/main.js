import FlightPhysics from "./FlightPhysics.js";

async function loadPerformance(category) {
    const r = await fetch(`ajax/get_performance.php?category=${encodeURIComponent(category)}`);
    const data = await r.json();
    return data;
}

async function initAircraft() {

    const perf = await loadPerformance("A320"); // change category if needed
    const physics = new FlightPhysics(perf);

    window.activeAircraft = {
        altitude: 0,
        targetAltitude: 33000,
        physics
    };
}

initAircraft();
