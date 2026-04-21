// js/FlightAnimator.js// GLOBAL NAVPOINT LAYER
let pointsLayer = L.layerGroup();
let pointsVisible = false;
let previewLine = null;
let allRoutes = [];

const triangleIcon = L.icon({
  iconUrl: "images/triangle.png", // <-- change path if needed
  iconSize: [10, 10], // size of the triangle
  iconAnchor: [8, 8], // center the icon
  popupAnchor: [0, -8],
});

class FlightAnimator {
  /**
   * coords: array of [lat,lng] arrays or {lat,lng} or {latitude,longitude}
   * speedKmh: initial speed in km/h
   * icon: Leaflet icon
   */
  constructor(map, coords, speedKt = 135, perf = null, icon = null, fltId) {
    this.map = map;
    this.rawCoords = coords || [];
    this.coords = this.normalizeCoords(this.rawCoords);
    // Save original final destination
    this.originalEnd = this.coords[this.coords.length - 1];

    this.speed = speedKt;
    this.icon = icon;
    this.targetSpeed = speedKt; // speed we want to reach gradually
    this.acceleration = 50;
    this.perf = perf; // km/h per second
    this.fltId = fltId;
    // safety for short/no routes
    if (!this.coords || this.coords.length === 0) {
      this.coords = [L.latLng(0, 0)];
    }

    this.marker = L.marker(this.coords[0], { icon: this.icon }).addTo(this.map);

    this.index = 0; // current segment index (between coords[index] and coords[index+1])
    this.progress = 0; // 0..1 within current segment
    this.running = false;
    this.lastTime = null;
    this._rafId = null;
    this.velocityLabel = L.marker(this.coords[0], {
      icon: L.divIcon({
        className: "velocity-label",
        html: `<div style="color:white; padding:2px 6px; font-size:12px;">
    ${this.speed.toFixed(0)} kt`,
      }),
      interactive: false,
    }).addTo(this.map);
  }
  // inside FlightAnimator class
  setNewPath(latlngArray) {
    // latlngArray is array of [lat, lng] pairs
    if (!Array.isArray(latlngArray) || latlngArray.length < 2) return;
    this.coords = latlngArray.map((p) => L.latLng(p[0], p[1]));
    this.index = 0;
    this.progress = 0;
    // update marker position immediately
    this.marker.setLatLng(this.coords[0]);
    if (this.velocityLabel) this.velocityLabel.setLatLng(this.coords[0]);
    // if you want to auto-start:
    // this.start();
  }
  // Change how fast speed changes (kt per second)
  setAcceleration(value) {
    value = Number(value);
    if (isNaN(value) || value <= 0) return;
    this.acceleration = value;
  }

  normalizeCoords(coords) {
    // convert different possible structures into L.latLng objects
    return coords.map((c) => {
      if (Array.isArray(c)) {
        return L.latLng(c[0], c[1]);
      } else if (c && typeof c.lat === "number" && typeof c.lng === "number") {
        return L.latLng(c.lat, c.lng);
      } else if (
        c &&
        (typeof c.latitude === "number" ||
          typeof c.lon === "number" ||
          typeof c.longitude === "number")
      ) {
        const lat = typeof c.latitude === "number" ? c.latitude : c.lat;
        const lng =
          typeof c.longitude === "number" ? c.longitude : c.lon || c.lng;
        return L.latLng(lat, lng);
      } else {
        // fallback — try reading [0],[1]
        return L.latLng(c[0], c[1]);
      }
    });
  }

  // convert km/h to m/s
  setSpeed(newSpeedKt) {
    if (typeof newSpeedKt !== "number" || isNaN(newSpeedKt)) return;
    this.targetSpeed = newSpeedKt;
  }

  get speedMs() {
    return this.speed * 0.514444;
  }

  isRunning() {
    return !!this.running;
  }

  start() {
    if (this.running) return;
    // If we already finished route, keep last point
    if (this.index >= this.coords.length - 1 && this.progress >= 1) {
      this.index = this.coords.length - 2;
      this.progress = 1;
    }
    this.running = true;
    this.lastTime = performance.now();
    // kick loop
    this._loop();
  }

  pause() {
    this.running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  stop() {
    this.pause();
    this.index = 0;
    this.progress = 0;
    this.marker.setLatLng(this.coords[0]);
  }

  remove() {
    this.pause();
    if (this.map && this.marker) this.map.removeLayer(this.marker);
  }

  // returns remaining distance in meters from current state to end
  remainingDistance() {
    let d = 0;
    if (!this.coords || this.coords.length < 2) return 0;
    // remaining on current segment
    const a = this.coords[this.index];
    const b = this.coords[this.index + 1];
    const segDist = a.distanceTo(b);
    d += segDist * (1 - this.progress);
    for (let i = this.index + 1; i < this.coords.length - 1; i++) {
      d += this.coords[i].distanceTo(this.coords[i + 1]);
    }
    return d;
  }

  // internal loop
  _loop() {
    if (!this.running) return;

    const now = performance.now();
    const dt = this.lastTime === null ? 0 : (now - this.lastTime) / 1000;
    this.lastTime = now;

    // Smooth acceleration
    if (this.speed !== this.targetSpeed) {
      const delta = this.acceleration * dt;
      if (this.speed < this.targetSpeed) {
        this.speed = Math.min(this.speed + delta, this.targetSpeed);
      } else {
        this.speed = Math.max(this.speed - delta, this.targetSpeed);
      }
    }

    let distToMove = dt * this.speedMs;

    // Auto-descent logic
    if (this.remainingDistance() < 5000) {
      this.targetSpeed = parseFloat(this.perf.DESCENTSPEED);
      this.targetLevel = parseFloat(this.perf.MINLEVEL);
    }

    // Walk through segments
    while (distToMove > 0 && this.index < this.coords.length - 1) {
      const a = this.coords[this.index];
      const b = this.coords[this.index + 1];
      const segDist = a.distanceTo(b);

      if (segDist <= 0.000001) {
        this.index++;
        this.progress = 0;
        continue;
      }

      const segRemaining = segDist * (1 - this.progress);

      if (distToMove < segRemaining - 1e-6) {
        this.progress += distToMove / segDist;
        distToMove = 0;
      } else {
        distToMove -= segRemaining;
        this.index++;
        this.progress = 0;
      }
    }

    // Reached end
    if (this.index >= this.coords.length - 1) {
      this.index = this.coords.length - 1;
      this.progress = 1;
      this.marker.setLatLng(this.coords[this.coords.length - 1]);
      this.running = false;
      if (this._rafId) cancelAnimationFrame(this._rafId);
      return;
    }

    // Interpolate new position
    const a = this.coords[this.index];
    const b = this.coords[this.index + 1];

    const lat = a.lat + (b.lat - a.lat) * this.progress;
    const lng = a.lng + (b.lng - a.lng) * this.progress;

    // UPDATE PLANE POSITION
    this.marker.setLatLng([lat, lng]);
    this.velocityLabel.setLatLng([lat, lng]);
    this.velocityLabel._icon.innerHTML = `<div style="color:white;padding:2px 6px;font-size:12px;">
    ${this.speed.toFixed(0)} kt
  </div>`;

    // 🚨 NOW CHECK ZONE → using NEW position
    checkPlaneZones(this.fltId);

    // Continue loop
    this._rafId = requestAnimationFrame(() => this._loop());
  }
}
function loadRoutes(fltId) {
  fetch("api.php?action=get_routes")
    .then((r) => r.json())
    .then((res) => {
      if (res.status !== "success") return;
      allRoutes = res.data;

      let select = document.getElementById(`route-select-${fltId}`);

      // Reset select
      select.innerHTML = `<option value="">-- Select Route --</option>`;

      // Add all routes
      res.data.forEach((rt) => {
        const opt = document.createElement("option");
        opt.value = rt.id;

        // full label
        opt.textContent = `${rt.name} (${rt.start} → ${rt.end})`;

        // Save routeName separately for preview
        opt.dataset.routename = rt.name;

        select.appendChild(opt);
      });

      // Remove old listeners
      const newSelect = select.cloneNode(true);
      select.replaceWith(newSelect);

      // Attach preview + apply
      newSelect.addEventListener("change", () => {
        previewRoute(fltId);
        const opt = newSelect.options[newSelect.selectedIndex];
        const routeName = opt.dataset.routename;

        if (!newSelect.value) {
          clearPreview();
          return;
        }

        // 1️⃣ PREVIEW
        previewRoute(routeName);

        // 2️⃣ APPLY ROUTE
        assignRouteToPlane(fltId);
      });
    });
}

function loadAllPoints() {
  fetch("api.php?action=get_points")
    .then((r) => r.json())
    .then((res) => {
      if (res.status !== "success") return;

      pointsLayer.clearLayers();

      res.data.forEach((pt) => {
        L.marker([pt.lat, pt.lng], { icon: triangleIcon })
          .addTo(pointsLayer)
          .bindPopup(pt.label);
      });

      console.log("Loaded", res.data.length, "points");
    });
}
function togglePoints() {
  if (pointsVisible) {
    map.removeLayer(pointsLayer);
    pointsVisible = false;
  } else {
    pointsLayer.addTo(map);
    pointsVisible = true;

    if (pointsLayer.getLayers().length === 0) {
      loadAllPoints(); // load only once
    }
  }
}

// called from your animation loop or using a small interval
function checkPlaneZones(fltId) {
  const animator = flights[fltId];
  if (!animator) return;

  const latlng = animator.marker.getLatLng();
  const pt = turf.point([latlng.lng, latlng.lat]);

  if (!chosenZoneFeature) return;

  let zone;

  if (chosenZoneFeature.geometry.type === "Polygon") {
    zone = turf.polygon(chosenZoneFeature.geometry.coordinates);
  } else if (chosenZoneFeature.geometry.type === "MultiPolygon") {
    zone = turf.multiPolygon(chosenZoneFeature.geometry.coordinates);
  } else {
    console.warn("Zone is not polygon");
    return;
  }

  const inside = turf.booleanPointInPolygon(pt, zone);

  if (inside && !animator._inZone) {
    animator._inZone = true;
    onPlaneEnterZone(fltId, chosenZoneFeature);
  } else if (!inside && animator._inZone) {
    animator._inZone = false;
  }
}
async function assignRouteToPlane(fltId) {
  const routeId = document.getElementById(`route-select-${fltId}`).value;
  if (!routeId) return;

  const animator = flights[fltId];
  if (!animator) return;

  // 1️⃣ Current position of plane
  const currentPos = animator.marker.getLatLng();

  // 2️⃣ Load all routes (already your logic)
  const routes = await fetch("api.php?action=get_routes").then((r) => r.json());
  if (routes.status !== "success") return;

  const selected = routes.data.find((r) => r.id == routeId);
  if (!selected) return;

  // group segments of same route name
  const segments = routes.data.filter((r) => r.name === selected.name);

  // find first segment: whose START is not the END of any other
  const firstSeg = segments.find(
    (s) => !segments.some((o) => o.end === s.start)
  );

  let ordered = [];
  let curr = firstSeg;

  while (curr) {
    ordered.push(curr);
    curr = segments.find((s) => s.start === curr.end);
  }

  // 3️⃣ Load all points
  const points = await fetch("api.php?action=get_points").then((r) => r.json());
  if (points.status !== "success") return;

  const allPts = points.data;

  // 4️⃣ Build new route path
  const newPath = [];

  // ➤ FIRST POINT = current plane position
  newPath.push([currentPos.lat, currentPos.lng]);

  // ➤ Add all route points
  for (const seg of ordered) {
    const pStart = allPts.find((p) => p.label === seg.start);
    if (pStart) newPath.push([pStart.lat, pStart.lng]);
  }

  // ➤ Add last endpoint
  const lastSeg = ordered[ordered.length - 1];
  const pLast = allPts.find((p) => p.label === lastSeg.end);
  if (pLast) newPath.push([pLast.lat, pLast.lng]);
  // 7️⃣ AFTER finishing new route → continue to ORIGINAL END
  if (animator.originalEnd) {
    newPath.push([
      animator.originalEnd.lat ?? animator.originalEnd[0],
      animator.originalEnd.lng ?? animator.originalEnd[1],
    ]);
  }

  // 5️⃣ Apply to animator
  animator.setNewPath(newPath);

  // 6️⃣ Update polyline
  if (polylines[fltId]) map.removeLayer(polylines[fltId]);
  polylines[fltId] = L.polyline(newPath, { color: "yellow" }).addTo(map);

  map.fitBounds(polylines[fltId].getBounds());

  alert(`Route ${selected.name} applied (smooth transition)`);
}
function orderRouteSegments(segments) {
  if (!segments || segments.length === 0) return [];

  const first = segments.find((s) => !segments.some((o) => o.end === s.start));

  const ordered = [];
  let current = first;

  while (current) {
    ordered.push(current);
    current = segments.find((s) => s.start === current.end);
  }

  return ordered;
}

function clearPreview() {
  if (previewLine) {
    map.removeLayer(previewLine);
    previewLine = null;
  }
}

function previewRoute(fltId) {
  const routeId = document.getElementById(`route-select-${fltId}`).value;
  if (!routeId) return;

  // Remove previous preview
  if (polylines[`preview_${fltId}`]) {
    map.removeLayer(polylines[`preview_${fltId}`]);
  }

  fetch(`api.php?action=get_route_coordinates&id=${routeId}`)
    .then((r) => r.json())
    .then((coords) => {
      if (!coords || coords.length < 2) return;

      const latlngs = coords.map((c) => [
        parseFloat(c.lat),
        parseFloat(c.lng ?? c.lon),
      ]);

      const poly = L.polyline(latlngs, {
        color: "orange",
        weight: 3,
        dashArray: "5,5",
      });
      poly.addTo(map);

      polylines[`preview_${fltId}`] = poly;

      map.fitBounds(poly.getBounds());
    });
}
function updateAcceleration(fltId) {
  const input = document.getElementById(`accel-${fltId}`);
  if (!input) return;

  const accel = parseFloat(input.value);
  if (isNaN(accel)) return;

  const animator = flights[fltId];
  if (!animator) return;

  animator.setAcceleration(accel);
}
//check exercise state
let syncInterval = setInterval(checkExerciseState, 2000);

function checkExerciseState() {
  fetch("api/exercise_state.php?action=get")
    .then((res) => res.json())
    .then((r) => {
      if (r.status !== "success") return;

      const state = r.data.status;
      const startTime = r.data.start_time ? new Date(r.data.start_time) : null;
      const now = new Date();

      switch (state) {
        case "running":
          // start animation if not running
          Object.values(flights).forEach((anim) => {
            if (!anim.running) anim.start();
          });
          if (startTime) {
            // Optional: calculate elapsed time
            const elapsed = (now - startTime) / 1000; // seconds
            console.log("Elapsed since start:", elapsed);
          }
          break;
        case "paused":
          Object.values(flights).forEach((anim) => anim.pause());
          break;
        case "stopped":
          Object.values(flights).forEach((anim) => anim.stop());
          break;
      }

      document.getElementById("status").innerText = state.toUpperCase();
    });
}
