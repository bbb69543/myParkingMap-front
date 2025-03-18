import { useEffect, useState, useRef } from "react";
import L from "leaflet"; // 匯入 Leaflet

// const defaultLocation = [24.1383, 120.6869]; // 預設位置 - 台中火車站

const useLeafletMap = (defaultLocation) => {
  const [map, setMap] = useState(null);
  const isManualMove = useRef(false); // 是否為手動移動地圖

  useEffect(() => {
    if (!defaultLocation) return;

    const newMap = L.map("map").setView(defaultLocation, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(newMap);

    // 監聽地圖手動移動
    newMap.on("movestart", () => {
      isManualMove.current = true; // 設定為手動移動
    });

    setMap(newMap);

    return () => {
      newMap.remove(); // 清理地圖，防止記憶體洩漏
    };
  }, [defaultLocation]);

  return { map, isManualMove };
};

export default useLeafletMap;
