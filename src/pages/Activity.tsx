import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, Pause, Square, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculateDistance, isGoodAccuracy, isSignificantMovement, requestGPSPermission, watchGPSPosition } from "@/lib/gps";
import { Split } from "@/types/activity";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Activity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  
  const [activityType, setActivityType] = useState<string>("corrida");
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pace, setPace] = useState("0:00");
  const [speed, setSpeed] = useState(0);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  
  // GPS states
  const [gpsPermission, setGpsPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(0);
  const [lastPosition, setLastPosition] = useState<GeolocationPosition | null>(null);
  const watchId = useRef<number | null>(null);
  
  // Sprint training (Treino de Tiro) states
  const [splits, setSplits] = useState<Split[]>([]);
  const [currentSplit, setCurrentSplit] = useState(1);
  const [splitStartTime, setSplitStartTime] = useState(0);
  const [splitStartDistance, setSplitStartDistance] = useState(0);
  const [splitStartCoordIndex, setSplitStartCoordIndex] = useState(0);

  // Request GPS permission and initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMapAndGPS = async () => {
      try {
        // Request GPS permission
        const position = await requestGPSPermission();
        setGpsPermission('granted');
        setGpsAccuracy(position.coords.accuracy);
        setLastPosition(position);

        // Initialize map centered on user location
        mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY20zem5memZyMHo3bTJqcHkzcnZkZnc0ZSJ9.IyULTyr_AtWaffpZdelPpw';
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15,
        });

        map.current.addControl(new mapboxgl.NavigationControl());

        // Add user marker
        userMarker.current = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([position.coords.longitude, position.coords.latitude])
          .addTo(map.current);

        toast({
          title: "GPS Ativado",
          description: "Localização obtida com sucesso!",
        });
      } catch (error) {
        setGpsPermission('denied');
        toast({
          title: "Erro de GPS",
          description: error instanceof Error ? error.message : "Não foi possível acessar sua localização",
          variant: "destructive",
        });
      }
    };

    initializeMapAndGPS();

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      map.current?.remove();
    };
  }, []);

  // Start GPS tracking when activity starts
  useEffect(() => {
    if (isActive && !isPaused && gpsPermission === 'granted') {
      // Timer for elapsed time
      const timer = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);

      // Start watching GPS position
      const id = watchGPSPosition(
        (position) => {
          // Update GPS accuracy
          setGpsAccuracy(position.coords.accuracy);

          // Check if accuracy is good enough
          if (!isGoodAccuracy(position.coords.accuracy)) {
            return;
          }

          // Update user marker position
          if (userMarker.current && map.current) {
            userMarker.current.setLngLat([position.coords.longitude, position.coords.latitude]);
            map.current.setCenter([position.coords.longitude, position.coords.latitude]);
          }

          // Calculate distance from last position
          if (lastPosition) {
            const distanceKm = calculateDistance(
              lastPosition.coords.latitude,
              lastPosition.coords.longitude,
              position.coords.latitude,
              position.coords.longitude
            );

            // Only update if movement is significant
            if (isSignificantMovement(distanceKm)) {
              setDistance((prev) => prev + distanceKm);
              
              const newCoords: [number, number] = [position.coords.longitude, position.coords.latitude];
              setCoordinates((prev) => {
                const updated = [...prev, newCoords];
                
                // Update route on map
                if (map.current) {
                  const sourceId = activityType === 'treino-tiro' ? `route-split-${currentSplit}` : 'route';
                  
                  if (map.current.getSource(sourceId)) {
                    (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
                      type: 'Feature',
                      properties: {},
                      geometry: {
                        type: 'LineString',
                        coordinates: activityType === 'treino-tiro' 
                          ? updated.slice(splitStartCoordIndex)
                          : updated,
                      },
                    });
                  } else {
                    map.current.addSource(sourceId, {
                      type: 'geojson',
                      data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                          type: 'LineString',
                          coordinates: activityType === 'treino-tiro' 
                            ? updated.slice(splitStartCoordIndex)
                            : updated,
                        },
                      },
                    });

                    // Color for sprint training splits
                    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
                    const color = activityType === 'treino-tiro' 
                      ? colors[(currentSplit - 1) % colors.length]
                      : '#3b82f6';

                    map.current.addLayer({
                      id: `${sourceId}-line`,
                      type: 'line',
                      source: sourceId,
                      paint: {
                        'line-color': color,
                        'line-width': 4,
                      },
                    });
                  }
                }
                
                return updated;
              });
            }
          }

          setLastPosition(position);
        },
        (error) => {
          toast({
            title: "Erro de GPS",
            description: error,
            variant: "destructive",
          });
        }
      );

      watchId.current = id;

      return () => {
        clearInterval(timer);
        if (watchId.current !== null) {
          navigator.geolocation.clearWatch(watchId.current);
        }
      };
    }
  }, [isActive, isPaused, gpsPermission, lastPosition, activityType, currentSplit, splitStartCoordIndex]);

  // Calculate pace and speed based on real movement
  useEffect(() => {
    if (distance > 0 && time > 0) {
      const speedKmH = (distance / (time / 3600));
      setSpeed(parseFloat(speedKmH.toFixed(1)));

      const paceMinKm = (time / 60) / distance;
      const min = Math.floor(paceMinKm);
      const sec = Math.floor((paceMinKm - min) * 60);
      setPace(`${min}:${sec.toString().padStart(2, "0")}`);
    } else {
      setSpeed(0);
      setPace("0:00");
    }
  }, [distance, time]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (gpsPermission !== 'granted') {
      toast({
        title: "GPS Necessário",
        description: "Por favor, permita o acesso à sua localização",
        variant: "destructive",
      });
      return;
    }
    setIsActive(true);
    setIsPaused(false);
    setSplitStartTime(0);
    setSplitStartDistance(0);
    setSplitStartCoordIndex(0);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleMarkSplit = () => {
    const splitDuration = time - splitStartTime;
    const splitDistance = distance - splitStartDistance;
    const splitCoordinates = coordinates.slice(splitStartCoordIndex);

    if (splitDistance < 0.01) {
      toast({
        title: "Movimento Insuficiente",
        description: "Mova-se um pouco mais antes de finalizar o tiro",
        variant: "destructive",
      });
      return;
    }

    const avgSpeed = splitDistance > 0 && splitDuration > 0 ? (splitDistance / (splitDuration / 3600)) : 0;
    const paceMinKm = splitDistance > 0 && splitDuration > 0 ? (splitDuration / 60) / splitDistance : 0;
    const min = Math.floor(paceMinKm);
    const sec = Math.floor((paceMinKm - min) * 60);

    const newSplit: Split = {
      number: currentSplit,
      duration: splitDuration,
      distance: splitDistance,
      avgSpeed: parseFloat(avgSpeed.toFixed(1)),
      pace: `${min}:${sec.toString().padStart(2, "0")}`,
      coordinates: splitCoordinates,
      startTime: splitStartTime,
    };

    setSplits((prev) => [...prev, newSplit]);
    setCurrentSplit((prev) => prev + 1);
    setSplitStartTime(time);
    setSplitStartDistance(distance);
    setSplitStartCoordIndex(coordinates.length);

    toast({
      title: `Tiro ${currentSplit} Finalizado!`,
      description: `${splitDistance.toFixed(2)}km em ${formatTime(splitDuration)} (${avgSpeed.toFixed(1)}km/h)`,
    });
  };

  const handleStop = () => {
    // Stop GPS tracking
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }

    navigate("/summary", {
      state: {
        activityType,
        time,
        distance,
        pace,
        speed,
        coordinates,
        splits: activityType === 'treino-tiro' ? splits : undefined,
      },
    });
  };

  const currentSplitDistance = distance - splitStartDistance;
  const currentSplitTime = time - splitStartTime;

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-card border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Nova Atividade</h1>
          
          {/* GPS Status Indicator */}
          <div className="ml-auto">
            <Card className="glass-card p-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                gpsPermission === 'granted' && gpsAccuracy < 20 ? 'bg-green-500' :
                gpsPermission === 'granted' && gpsAccuracy < 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <MapPin className="w-3 h-3" />
              <span className="text-xs">
                {gpsPermission === 'granted' 
                  ? `±${gpsAccuracy.toFixed(0)}m` 
                  : gpsPermission === 'denied'
                  ? 'Negado'
                  : 'Aguardando'}
              </span>
            </Card>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {gpsPermission === 'denied' && (
          <Alert variant="destructive">
            <AlertDescription>
              Permissão de GPS negada. Por favor, habilite a localização nas configurações do seu navegador para usar esta funcionalidade.
            </AlertDescription>
          </Alert>
        )}

        <Card className="glass-card p-4">
          <label className="text-sm font-medium mb-2 block">Tipo de Atividade</label>
          <Select value={activityType} onValueChange={setActivityType} disabled={isActive}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corrida">🏃 Corrida</SelectItem>
              <SelectItem value="caminhada">🚶 Caminhada</SelectItem>
              <SelectItem value="ciclismo">🚴 Ciclismo</SelectItem>
              <SelectItem value="treino-tiro">🏃‍♂️💨 Treino de Tiro</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <div ref={mapContainer} className="w-full h-[300px] rounded-lg" />

        {activityType === 'treino-tiro' && isActive ? (
          <Card className="glass-card p-6 space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold gradient-text">
                Tiro #{currentSplit}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="metric-card">
                <p className="text-sm text-muted-foreground">Tempo do Tiro</p>
                <p className="text-3xl font-bold">{formatTime(currentSplitTime)}</p>
              </Card>
              <Card className="metric-card">
                <p className="text-sm text-muted-foreground">Distância do Tiro</p>
                <p className="text-3xl font-bold">{currentSplitDistance.toFixed(2)} km</p>
              </Card>
              <Card className="metric-card">
                <p className="text-sm text-muted-foreground">Tempo Total</p>
                <p className="text-3xl font-bold">{formatTime(time)}</p>
              </Card>
              <Card className="metric-card">
                <p className="text-sm text-muted-foreground">Distância Total</p>
                <p className="text-3xl font-bold">{distance.toFixed(2)} km</p>
              </Card>
            </div>

            {!isPaused && (
              <Button 
                onClick={handleMarkSplit}
                className="w-full"
                variant="default"
              >
                Finalizar Tiro {currentSplit} e Iniciar Tiro {currentSplit + 1}
              </Button>
            )}

            {splits.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-semibold">Tiros Concluídos:</p>
                <div className="space-y-1">
                  {splits.map((split) => (
                    <div key={split.number} className="flex justify-between text-sm bg-muted/20 p-2 rounded">
                      <span className="font-medium">Tiro {split.number}</span>
                      <span className="text-muted-foreground">
                        {split.distance.toFixed(2)}km em {formatTime(split.duration)} ({split.avgSpeed.toFixed(1)}km/h)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ) : (
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
              <p className="text-3xl font-bold">{speed.toFixed(1)} km/h</p>
            </Card>
          </div>
        )}

        <div className="flex gap-4">
          {!isActive ? (
            <Button onClick={handleStart} className="flex-1 py-6 text-lg" variant="gradient">
              <Play className="w-6 h-6 mr-2" />
              Iniciar
            </Button>
          ) : (
            <>
              <Button onClick={handlePause} variant="outline" className="flex-1 py-6 text-lg">
                <Pause className="w-6 h-6 mr-2" />
                {isPaused ? "Continuar" : "Pausar"}
              </Button>
              <Button onClick={handleStop} variant="destructive" className="flex-1 py-6 text-lg">
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
