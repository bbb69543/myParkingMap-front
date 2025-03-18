import { useEffect, useState, useRef } from "react";
import L from "leaflet"; // 匯入 Leaflet

const useUserLocation = (map, defaultLocation, isManualMove, maxDistance) => {
  const userLocationRef = useRef(null); // 儲存最新位置

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

          if (distance > maxDistance) {
            console.warn("距離過遠，使用預設位置");
            newPosition = defaultLocation;
            popupText = "預設位置: 台中火車站";
          }

          // 儲存最新的位置
          userLocationRef.current = newPosition;

          // 更新地圖上的使用者位置標記
          let userMarker = map.userMarker;
          if (userMarker) {
            // **更新已存在的圓圈，而不是新增**
            console.log("更新位置:", newPosition);
            userMarker.setLatLng(newPosition);
          } else {
            // **如果是第一次建立，則新增圓圈**
            console.log("建立位置:", newPosition);
            map.userMarker = L.circleMarker(newPosition, {
              color: "rgba(0, 0, 255, 0.5)",
              weight: 5,
              fillColor: "rgb(75, 75, 255)",
              fillOpacity: 0.7,
              radius: 10,
            })
              .addTo(map)
              .bindPopup(popupText, { autoPan: false })
              .openPopup();
            map.setView(newPosition, 16);
          }

          // **只有在不是手動移動時，才自動對焦**
          if (!isManualMove.current) {
            map.setView(newPosition, 16);
          }
        },
        (error) => {
          console.error("無法獲取位置:", error.message);

          if (!map.userMarker) {
            map.userMarker = L.circleMarker(defaultLocation, {
              color: "rgba(0, 0, 255, 0.5)",
              weight: 5,
              fillColor: "rgb(75, 75, 255)",
              fillOpacity: 0.7,
              radius: 10,
            })
              .addTo(map)
              .bindPopup("預設位置: 台中火車站", { autoPan: false })
              .openPopup();
            map.setView(defaultLocation, 16);
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

  return { userLocationRef };
};

export default useUserLocation;
