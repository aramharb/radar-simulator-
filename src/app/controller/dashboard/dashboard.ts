import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

interface Airplane {
	id: number;
	callsign: string;
	type: string;
	altitude: number;
	speed: number;
	heading: number;
	sector: string;
	route: string;
	x: number;
	y: number;
}

interface RadarData {
	points?: string[];
	routes?: string[];
	areas?: string[];
	zones?: Record<string, string>;
	airports?: unknown;
}

declare global {
	interface Window {
		radarData?: RadarData;
		L?: unknown;
	}
}

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {
	@ViewChild('mapContainer')
	private mapContainer?: ElementRef<HTMLElement>;

	private leafletMap?: import('leaflet').Map;
	private scriptsLoaded = false;

	protected readonly airplanes: Airplane[] = [
		{
			id: 1,
			callsign: 'TAR412',
			type: 'A320',
			altitude: 330,
			speed: 456,
			heading: 92,
			sector: 'Tunis East TMA',
			route: 'DJB UL50 MABOX',
			x: 18,
			y: 26,
		},
		{
			id: 2,
			callsign: 'QTR92L',
			type: 'B788',
			altitude: 370,
			speed: 482,
			heading: 142,
			sector: 'Sfax CTR',
			route: 'NADOR UM629 SFA',
			x: 64,
			y: 49,
		},
		{
			id: 3,
			callsign: 'AFR7634',
			type: 'A220',
			altitude: 290,
			speed: 420,
			heading: 210,
			sector: 'Monastir TMA',
			route: 'TUNIS UT12 MIR',
			x: 39,
			y: 61,
		},
		{
			id: 4,
			callsign: 'UAE53K',
			type: 'B77W',
			altitude: 350,
			speed: 473,
			heading: 74,
			sector: 'South FIR Corridor',
			route: 'GAFSA UM735 BIRSA',
			x: 78,
			y: 30,
		},
	];

	protected selectedAirplaneId: number | null = null;

	protected selectAirplane(id: number): void {
		this.selectedAirplaneId = id;
	}

	protected clearSelection(): void {
		this.selectedAirplaneId = null;
	}

	protected get selectedAirplane(): Airplane | null {
		return this.airplanes.find((plane) => plane.id === this.selectedAirplaneId) ?? null;
	}

	async ngAfterViewInit(): Promise<void> {
		if (typeof window === 'undefined' || !this.mapContainer) {
			return;
		}

		try {
			const L = await import('leaflet');
			window.L = L;

			await this.ensureTemplateScriptsLoaded();
			const data = this.getRadarData();
			this.initializeMap(L, data);
		} catch (error) {
			console.error('Radar template initialization failed.', error);
		}
	}

	ngOnDestroy(): void {
		if (this.leafletMap) {
			this.leafletMap.remove();
			this.leafletMap = undefined;
		}
	}

	private async ensureTemplateScriptsLoaded(): Promise<void> {
		if (this.scriptsLoaded) {
			return;
		}

		await this.loadScript('/dashboard/data.js');
		await this.loadScript('/dashboard/js/sql.js');
		await this.loadScript('/dashboard/js/L.KML.js');
		await this.loadScript('/dashboard/js/Leaflet.TileLayer.MBTiles.js');

		this.scriptsLoaded = true;
	}

	private loadScript(src: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const existing = document.querySelector(`script[data-radar-src="${src}"]`) as
				| HTMLScriptElement
				| null;
			if (existing) {
				if (existing.dataset['loaded'] === 'true') {
					resolve();
					return;
				}

				existing.addEventListener('load', () => resolve(), { once: true });
				existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {
					once: true,
				});
				return;
			}

			const script = document.createElement('script');
			script.src = src;
			script.async = false;
			script.defer = false;
			script.dataset['radarSrc'] = src;

			script.addEventListener(
				'load',
				() => {
					script.dataset['loaded'] = 'true';
					resolve();
				},
				{ once: true },
			);

			script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {
				once: true,
			});

			document.body.appendChild(script);
		});
	}

	private getRadarData(): RadarData {
		if (!window.radarData) {
			console.error('Global radarData is not available.');
			return {};
		}

		return window.radarData;
	}

	private initializeMap(L: typeof import('leaflet'), data: RadarData): void {
		if (!this.mapContainer) {
			return;
		}

		type LeafletWithPlugins = typeof import('leaflet') & {
			KML: new (kmlDoc: XMLDocument) => import('leaflet').Layer;
			tileLayer: typeof L.tileLayer & {
				mbTiles: (url: string, options?: Record<string, unknown>) => import('leaflet').Layer;
			};
		};

		const LWithPlugins = L as LeafletWithPlugins;
		const map = L.map(this.mapContainer.nativeElement).setView([33.8869, 9.5375], 6);
		this.leafletMap = map;

		const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap',
		});

		const tnLayer = LWithPlugins.tileLayer.mbTiles('/dashboard/map/tn.mbtiles', {
			minZoom: 3,
			maxZoom: 15,
		});

		const tunisiaLayer = LWithPlugins.tileLayer.mbTiles('/dashboard/map/tunisia.mbtiles', {
			minZoom: 3,
			maxZoom: 15,
		});

		tnLayer.addTo(map);

		const baseMaps: Record<string, import('leaflet').Layer> = {
			'TN Map (MBTiles)': tnLayer,
			'Tunisia Map (MBTiles)': tunisiaLayer,
			OpenStreetMap: osmLayer,
		};

		const pointsMap = new Map<string, [number, number]>();
		const pointGroup = L.layerGroup().addTo(map);

		for (const row of data.points ?? []) {
			if (typeof row !== 'string') {
				continue;
			}

			const parts = row.split(',');
			if (parts.length < 10) {
				continue;
			}

			const name = parts[0].replace(/'/g, '');
			const lat = this.parseCoord(parts[3], parts[4], parts[5]);
			const lon = this.parseCoord(parts[6], parts[7], parts[8]);
			const type = parts[9].replace(/'/g, '');

			if (lat === null || lon === null) {
				continue;
			}

			pointsMap.set(name, [lat, lon]);

			const marker = L.circleMarker([lat, lon], {
				radius: 4,
				color: type === 'WAYPOINT' ? 'blue' : 'gray',
			});
			marker.bindPopup(`<b>${name}</b><br/>Type: ${type}`);
			marker.addTo(pointGroup);
		}

		const routeGroup = L.layerGroup().addTo(map);
		for (const row of data.routes ?? []) {
			if (typeof row !== 'string') {
				continue;
			}

			const parts = row.split(',');
			if (parts.length < 4) {
				continue;
			}

			const routeName = parts[1].replace(/'/g, '');
			const p1Name = parts[2].replace(/'/g, '');
			const p2Name = parts[3].replace(/'/g, '');
			const p1 = pointsMap.get(p1Name);
			const p2 = pointsMap.get(p2Name);

			if (!p1 || !p2) {
				continue;
			}

			const line = L.polyline([p1, p2], { color: 'red', weight: 2 });
			line.bindPopup(`<b>Route:</b> ${routeName}<br/><b>Path:</b> ${p1Name} to ${p2Name}`);
			line.addTo(routeGroup);
		}

		const areaGroup = L.layerGroup().addTo(map);
		for (const row of data.areas ?? []) {
			if (typeof row !== 'string') {
				continue;
			}

			const start = row.indexOf('[');
			const end = row.lastIndexOf(']');
			if (start === -1 || end === -1) {
				continue;
			}

			let jsonStr = row.substring(start, end + 1);
			jsonStr = jsonStr.replace(/\\"/g, '"');

			try {
				const latLngsObj = JSON.parse(jsonStr) as Array<{ lat: number; lng: number }>;
				const latLngs: [number, number][] = latLngsObj.map((point) => [point.lat, point.lng]);
				const poly = L.polygon(latLngs, { color: 'purple', fillOpacity: 0.3 });
				poly.addTo(areaGroup);
			} catch (error) {
				console.error('Area parse error', error);
			}
		}

		const overlays: Record<string, import('leaflet').Layer> = {
			Points: pointGroup,
			Routes: routeGroup,
			Areas: areaGroup,
		};

		if (data.zones) {
			const parser = new DOMParser();
			for (const [zoneName, kmlStr] of Object.entries(data.zones)) {
				try {
					const kmlDoc = parser.parseFromString(kmlStr, 'text/xml');
					const track = new LWithPlugins.KML(kmlDoc);
					const singleZoneGroup = L.layerGroup().addTo(map);
					singleZoneGroup.addLayer(track);

					const displayName = zoneName.replace(/_/g, ' ');
					overlays[`Zone: ${displayName}`] = singleZoneGroup;
				} catch (error) {
					console.error(`Zone parse error for ${zoneName}`, error);
				}
			}
		}

		const airportsGroup = L.layerGroup().addTo(map);
		if (data.airports) {
			L.geoJSON(data.airports as never, {
				pointToLayer: (_feature, latlng) =>
					L.circleMarker(latlng, {
						radius: 6,
						fillColor: '#ff7800',
						color: '#000',
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8,
					}),
				onEachFeature: (feature, layer) => {
					const airportFeature = feature as { properties?: { name?: string } };
					if (airportFeature.properties?.name) {
						layer.bindPopup(`<b>Airport:</b> ${airportFeature.properties.name}`);
					}
				},
			}).addTo(airportsGroup);

			overlays['Airports'] = airportsGroup;
		}

		L.control.layers(baseMaps, overlays).addTo(map);
	}

	private parseCoord(deg: string, min: string, sec: string): number | null {
		const degNum = Number.parseInt(deg, 10);
		const minNum = Number.parseInt(min, 10);
		const secNum = Number.parseInt(sec, 10);

		if ([degNum, minNum, secNum].some(Number.isNaN)) {
			return null;
		}

		return degNum + minNum / 60 + secNum / 3600;
	}
}