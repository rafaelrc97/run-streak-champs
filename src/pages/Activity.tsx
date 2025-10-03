import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Square, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoicmFmYXJjOTciLCJhIjoiY21nYTUycXRhMGhhbjJrcTR1OTdmOHpvOCJ9.HNdXNVw87bQ6bj-nmwjSrw";

const Activity = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activityType, setActivityType] = useState("corrida");
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pace, setPace] = useState("0:00");
  const [speed, setSpeed] = useState(0);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-46.6333, -23.5505],
      zoom: 15,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
        map.current?.setCenter(coords);
        
        new mapboxgl.Marker({ color: "#ff6b35" })
          .setLngLat(coords)
          .addTo(map.current!);
      });
    }

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
        setDistance((d) => d + 0.001);
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const newCoord: [number, number] = [position.coords.longitude, position.coords.latitude];
            setCoordinates((prev) => [...prev, newCoord]);
            
            if (map.current && coordinates.length > 0) {
              const source = map.current.getSource("route") as mapboxgl.GeoJSONSource;
              if (source) {
                source.setData({
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: [...coordinates, newCoord],
                  },
                });
              } else {
                map.current.addSource("route", {
                  type: "geojson",
                  data: {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "LineString",
                      coordinates: [...coordinates, newCoord],
                    },
                  },
                });

                map.current.addLayer({
                  id: "route",
                  type: "line",
                  source: "route",
                  layout: {
                    "line-join": "round",
                    "line-cap": "round",
                  },
                  paint: {
                    "line-color": "#ff6b35",
                    "line-width": 4,
                  },
                });
              }
            }
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, coordinates]);

  useEffect(() => {
    if (distance > 0 && time > 0) {
      const paceMinutes = time / 60 / distance;
      const minutes = Math.floor(paceMinutes);
      const seconds = Math.floor((paceMinutes - minutes) * 60);
      setPace(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      setSpeed(parseFloat((distance / (time / 3600)).toFixed(1)));
    }
  }, [distance, time]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    navigate("/summary", {
      state: {
        activityType,
        time,
        distance,
        pace,
        speed,
        coordinates,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-card border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Atividade</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        <Card className="glass-card p-4">
          <Select value={activityType} onValueChange={setActivityType} disabled={isActive}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corrida">🏃 Corrida</SelectItem>
              <SelectItem value="caminhada">🚶 Caminhada</SelectItem>
              <SelectItem value="ciclismo">🚴 Ciclismo</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <div ref={mapContainer} className="w-full h-[300px] rounded-2xl overflow-hidden" />

        <div className="grid grid-cols-2 gap-4">
          <Card className="metric-card">
            <p className="text-sm text-muted-foreground">Tempo</p>
            <p className="text-3xl font-bold">{formatTime(time)}</p>
          </Card>
          <Card className="metric-card">
            <p className="text-sm text-muted-foreground">Distância</p>
            <p className="text-3xl font-bold">{distance.toFixed(2)} km</p>
          </Card>
          <Card className="metric-card">
            <p className="text-sm text-muted-foreground">Ritmo</p>
            <p className="text-3xl font-bold">{pace} /km</p>
          </Card>
          <Card className="metric-card">
            <p className="text-sm text-muted-foreground">Velocidade</p>
            <p className="text-3xl font-bold">{speed} km/h</p>
          </Card>
        </div>

        <div className="flex gap-4">
          {!isActive ? (
            <Button onClick={handleStart} className="flex-1 py-8 text-lg" variant="gradient">
              <Play className="w-6 h-6 mr-2" />
              Iniciar
            </Button>
          ) : (
            <>
              <Button onClick={handlePause} variant="outline" className="flex-1 py-8 text-lg">
                <Pause className="w-6 h-6 mr-2" />
                {isPaused ? "Continuar" : "Pausar"}
              </Button>
              <Button onClick={handleStop} variant="destructive" className="flex-1 py-8 text-lg">
                <Square className="w-6 h-6 mr-2" />
                Finalizar
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Activity;
