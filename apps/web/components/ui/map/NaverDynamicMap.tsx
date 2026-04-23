/// <reference types="navermaps" />
"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}

interface NaverDynamicMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

const NaverDynamicMap = ({
  latitude,
  longitude,
  className,
}: NaverDynamicMapProps) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null);
  const markerInstance = useRef<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapElement.current || !window.naver || !window.naver.maps) return;

    const location = new window.naver.maps.LatLng(latitude, longitude);
    const mapOptions = {
      center: location,
      zoom: 16,
    };

    // 지도 인스턴스 초기화
    if (!mapInstance.current) {
      mapInstance.current = new window.naver.maps.Map(
        mapElement.current,
        mapOptions,
      );

      // 초기 마커 표시
      markerInstance.current = new window.naver.maps.Marker({
        position: location,
        map: mapInstance.current,
      });
    } else {
      // 위치 변경 시 맵 중심 및 마커 갱신
      mapInstance.current.setCenter(location);
      if (markerInstance.current) {
        markerInstance.current.setPosition(location);
      } else {
        markerInstance.current = new window.naver.maps.Marker({
          position: location,
          map: mapInstance.current,
        });
      }
    }
  }, [latitude, longitude]);

  return (
    <div
      className={cn(
        "w-full max-w-sm aspect-square mx-auto rounded-[0.625rem] overflow-hidden bg-Fill_Tertiary",
        className,
      )}
      ref={mapElement}
    />
  );
};

export default NaverDynamicMap;
