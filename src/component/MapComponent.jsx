import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css"; // 載入 Leaflet 預設樣式
import L from "leaflet"; // 匯入 Leaflet
import ReturnLocationBtn from "./ReturnLocationBtn";
import useLeafletMap from "./hooks/useLeafletMap"; // 引入新 Hook
import useUserLocation from "./hooks/useUserLocation";

const defaultLocation = [24.13830, 120.68690]; // 預設位置 - 台中火車站
const MAX_DISTANCE = 100000; // 允許最大距離 (100km)

const MapComponent = () => {
    const { map, isManualMove } = useLeafletMap(defaultLocation); // 使用 Hook 初始化 Leaflet 地圖
    const { userLocationRef } = useUserLocation(map, defaultLocation, isManualMove, MAX_DISTANCE);

    const [parkingLots, setParkingLots] = useState([]);


    useEffect(() => {
        // 向後端API要停車場資料
        const fetchParkingLotAPI = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/parkingLot");
                setParkingLots(response.data); // 更新 state
            } catch (error) {
                console.error("獲取停車場資料失敗:", error);
            }
        };
    
        fetchParkingLotAPI();
    }, []);

    // 在地圖建立後，根據 parkingLots 更新 Marker
    useEffect(() => {
        if (!map) return;
    
        // 首先移除舊的 markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    
        // 然後創建新的 markers
        parkingLots.forEach((item) => {
            L.marker([item.CarParkPosition.PositionLat, item.CarParkPosition.PositionLon])
                .bindPopup(String(item.CarParkName.Zh_tw))
                .addTo(map);
        });
    }, [map, parkingLots]);

    // **手動返回使用者位置**
    const handleReturnToLocation = () => {
        if (userLocationRef.current && map) {
            map.setView(userLocationRef.current, 16);
            isManualMove.current = false; // 重新啟用自動跟隨
        }
    };

    return (
        <div id="container">
            {/* 返回使用者位置按鈕 */}
            <ReturnLocationBtn handleReturnToLocation={handleReturnToLocation} />
            <div id="map"></div>
        </div>
    );
};

export default MapComponent;

