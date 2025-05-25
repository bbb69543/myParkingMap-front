import { useEffect, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import axios from "axios";
import "leaflet/dist/leaflet.css"; // 載入 Leaflet 預設樣式
import L from "leaflet"; // 匯入 Leaflet
import ReturnLocationBtn from "./ReturnLocationBtn";
import CarParkData from "./CarParkData";
import useLeafletMap from "./hooks/useLeafletMap"; // 引入新 Hook
import useUserLocation from "./hooks/useUserLocation";

const defaultLocation = [24.13830, 120.68690]; // 預設位置 - 台中火車站
const MAX_DISTANCE = 100000; // 允許最大距離 (100km)

const MapComponent = () => {
    const { map, isManualMove } = useLeafletMap(defaultLocation); // 使用 Hook 初始化 Leaflet 地圖
    const { userLocationRef } = useUserLocation(map, defaultLocation, isManualMove, MAX_DISTANCE);

    const [parkingLots, setParkingLots] = useState({ Data: [], UpdateTime: '' });


    useEffect(() => {
        // 向後端API要停車場資料
        const fetchParkingLotAPI = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/parkingLot");
                setParkingLots(response.data); // 更新 state
                console.log("獲取資料成功")
            } catch (error) {
                console.error("獲取停車場資料失敗:", error);
            }
        };
        // 立即執行一次
        fetchParkingLotAPI();

        // 設定定時器，每 5 分鐘請求一次
        const intervalId = setInterval(fetchParkingLotAPI, 300000);
        // 清理副作用，避免記憶體洩漏
        return () => clearInterval(intervalId);

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

        const refreshTime = parkingLots.UpdateTime;
        // 然後創建新的 markers

        const myIcon = L.icon({
            iconUrl: '/icons/marker.png',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [1, -34],
        });

        parkingLots.Data.forEach((item) => {
            const parkLat = item.CarParkPosition.PositionLat;
            const parkLon = item.CarParkPosition.PositionLon;
            const htmlString = ReactDOMServer.renderToString(<CarParkData data={item} time={refreshTime} parkLat={parkLat} parkLon={parkLon} />);
            L.marker([parkLat, parkLon], { icon: myIcon })
                .bindPopup(htmlString)
                .addTo(map);
        });
    }, [parkingLots]);

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

