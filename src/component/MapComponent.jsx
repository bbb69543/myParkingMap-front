import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css"; // 載入 Leaflet 預設樣式
import L from "leaflet"; // 匯入 Leaflet
import ReturnLocationBtn from "./ReturnLocationBtn";

const defaultLocation = [24.13830, 120.68690]; // 預設位置 - 台中火車站
const MAX_DISTANCE = 100000; // 允許最大距離 (100km)

const MapComponent = () => {
    const [map, setMap] = useState(null);
    const userCircleRef = useRef(null); // 儲存使用者位置的標記
    const userLocationRef = useRef(null); // 儲存最新的使用者位置
    const isManualMove = useRef(false); // 是否為手動移動地圖
    const [parkingLots, setParkingLots] = useState([]);

    // 向後端要停車場資料
    const fetchParkingLotAPI = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/parkingLot");
            setParkingLots(response.data); // 更新 state
        } catch (error) {
            console.error("獲取停車場資料失敗:", error);
        }
    };

    // 在組件載入時請求停車場資料
    useEffect(() => {
        fetchParkingLotAPI();
    }, []);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (!map) return;

        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userLocation = [latitude, longitude];

                    const distance = map.distance(defaultLocation, userLocation);
                    let newPosition = userLocation;
                    let popupText = "您的位置";

                    if (distance > MAX_DISTANCE) {
                        console.warn("距離過遠，使用預設位置");
                        newPosition = defaultLocation;
                        popupText = "預設位置: 台中火車站";
                    }

                    // 儲存最新的位置
                    userLocationRef.current = newPosition;

                    if (userCircleRef.current) {
                        // **更新已存在的圓圈，而不是新增**
                        console.log("更新位置:", newPosition);
                        userCircleRef.current.setLatLng(newPosition);
                    } else {
                        // **如果是第一次建立，則新增圓圈**
                        console.log("建立位置:", newPosition);
                        userCircleRef.current = L.circleMarker(newPosition, {
                            color: "rgba(0, 0, 255, 0.5)", // 邊框顏色
                            weight: 5, // 邊框粗細
                            fillColor: "rgb(75, 75, 255)", // 內部顏色
                            fillOpacity: 0.7, // 內部透明度
                            radius: 10, // 圓圈大小
                        }).addTo(map).bindPopup(popupText, { autoPan: false }).openPopup();
                        map.setView(newPosition, 19);
                    }

                    // **只有在不是手動移動時，才自動對焦**
                    if (!isManualMove.current) {
                        map.setView(newPosition, 19);
                    }
                },
                (error) => {
                    console.error("無法獲取位置:", error.message);

                    if (!userCircleRef.current) {
                        userCircleRef.current = L.circleMarker(defaultLocation, {
                            color: "rgba(0, 0, 255, 0.5)",
                            weight: 5,
                            fillColor: "rgb(75, 75, 255)",
                            fillOpacity: 0.7,
                            radius: 10,
                        }).addTo(map).bindPopup("預設位置: 台中火車站", { autoPan: false }).openPopup();
                        map.setView(defaultLocation, 19);
                    }
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 10000,
                }
            );

            return () => {
                console.log("清除 watchPosition 監聽");
                navigator.geolocation.clearWatch(watchId);
            };
        }
    }, [map]);

    // 在組件載入時請求停車場資料
    useEffect(() => {
        fetchParkingLotAPI();
    }, []);

    // 在地圖建立後，根據 parkingLots 更新 Marker
    useEffect(() => {
        if (!map) return;

        const markers = parkingLots.map((item) => {
            return L.marker([item.CarParkPosition.PositionLat, item.CarParkPosition.PositionLon])
                .bindPopup(String(item.CarParkName.Zh_tw))
                .addTo(map);
        });

        return () => {
            markers.forEach(marker => map.removeLayer(marker)); // 移除舊的 Marker，防止重疊
        };
    }, [map, parkingLots]);

    // **手動返回使用者位置**
    const handleReturnToLocation = () => {
        if (userLocationRef.current && map) {
            map.setView(userLocationRef.current, 19);
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

