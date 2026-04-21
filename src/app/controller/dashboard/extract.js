const fs = require('fs');

const sqlPath = 'c:\\Users\\aram\\OneDrive\\Bureau\\radar\\extract_radar\\db\\radar_map_routes_zones.sql';
const sql = fs.readFileSync(sqlPath, 'utf16le');

const pointsData = [];
const routesData = [];
const areasData = [];

// More robust logic considering newline characters in the statement
const insertPointsMatch = sql.match(/INSERT INTO \`points\` VALUES (.*?);/s);
if (insertPointsMatch) {
    const raw = insertPointsMatch[1];
    const matches = raw.match(/\(([^)]+)\)/g);
    if (matches) {
        matches.forEach(m => pointsData.push(m.slice(1, -1)));
    }
}

const insertRoutesMatch = sql.match(/INSERT INTO \`routes\` VALUES (.*?);/s);
if (insertRoutesMatch) {
    const raw = insertRoutesMatch[1];
    const matches = raw.match(/\(([^)]+)\)/g);
    if (matches) {
        matches.forEach(m => routesData.push(m.slice(1, -1)));
    }
}

const insertAreasMatch = sql.match(/INSERT INTO \`areas\` VALUES (.*?);/s);
if (insertAreasMatch) {
    const raw = insertAreasMatch[1];
    const matches = raw.match(/\(([^)]+)\)/g);
    if (matches) {
        matches.forEach(m => areasData.push(m.slice(1, -1)));
    }
}

const path = require('path');
const kmlDir = 'c:\\Users\\aram\\OneDrive\\Bureau\\radar\\extract_radar\\zones\\kml';
const zonesData = {};
try {
    const kmlFiles = fs.readdirSync(kmlDir).filter(f => f.toLowerCase().endsWith('.kml'));
    kmlFiles.forEach(file => {
        const fullPath = path.join(kmlDir, file);
        const kmlStr = fs.readFileSync(fullPath, 'utf8');
        zonesData[path.parse(file).name] = kmlStr;
    });
} catch(err) {
    console.error("Failed to read KML zones:", err);
}

let airportsData = null;
try {
    const airportsPath = 'c:\\Users\\aram\\OneDrive\\Bureau\\radar\\extract_radar\\zones\\airports_zones.geojson';
    const geojsonStr = fs.readFileSync(airportsPath, 'utf8');
    airportsData = JSON.parse(geojsonStr);
} catch(err) {
    console.error("Failed to read airports geojson:", err);
}

let firData = null;
try {
    const firPath = 'c:\\Users\\aram\\OneDrive\\Bureau\\radar\\extract_radar\\zones\\FIR.geojson';
    const geojsonStr = fs.readFileSync(firPath, 'utf8');
    firData = JSON.parse(geojsonStr);
} catch(err) {
    console.error("Failed to read FIR geojson:", err);
}

fs.writeFileSync('c:\\Users\\aram\\OneDrive\\Bureau\\test_map\\data.js', 'const radarData = ' + JSON.stringify({
    points: pointsData,
    routes: routesData,
    areas: areasData,
    zones: zonesData,
    airports: airportsData,
    fir: firData
}, null, 2) + ';');

console.log(`Extracted points, routes, areas, zones, airports and fir into data.js.`);


