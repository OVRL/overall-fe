/// <reference types="navermaps" />
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@toss/react";

const MIN_QUERY_LENGTH_FOR_LOCAL = 3;
const DEBOUNCE_MS = 400;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}

export interface NaverAddressResult {
  address: string;
  latitude: number;
  longitude: number;
  /** 장소명(지역 검색 API 결과일 때만 있음) */
  title?: string;
}

interface UseNaverAddressSearchProps {
  onComplete: (result: NaverAddressResult) => void;
}

/** TM128 좌표를 WGS84 위·경도로 변환. naver maps 로드 후에만 사용. */
function tm128ToLatLng(
  mapx: number,
  mapy: number,
): { latitude: number; longitude: number } | null {
  if (
    !window.naver?.maps?.Point ||
    !window.naver?.maps?.TransCoord?.fromTM128ToLatLng
  ) {
    return null;
  }
  const point = new window.naver.maps.Point(mapx, mapy);
  const latLng = window.naver.maps.TransCoord.fromTM128ToLatLng(point);
  return {
    latitude: latLng.lat(),
    longitude: latLng.lng(),
  };
}

/**
 * 지역 검색 API mapx/mapy → WGS84 위·경도.
 * 신규 응답은 경·위도×1e7 정수 문자열이 많고, 구 예시는 TM128 소수 정수이다.
 */
function localSearchMapxMapyToLatLng(
  mapx: number,
  mapy: number,
): { latitude: number; longitude: number } | null {
  const ax = Math.abs(mapx);
  const ay = Math.abs(mapy);
  const maxAbs = Math.max(ax, ay);
  // 공식 XML 예시(31만대 등)는 TM128, JSON의 9자리급은 WGS84×1e7로 해석
  if (maxAbs >= 10_000_000) {
    return { longitude: mapx / 1e7, latitude: mapy / 1e7 };
  }
  return tm128ToLatLng(mapx, mapy);
}

/** 목록/중복 제거용 주소 정규화 */
function normalizeAddressKey(address: string): string {
  return address.replace(/\s+/g, " ").trim();
}

/** Geocode API 호출을 Promise로 래핑 */
function geocode(keyword: string): Promise<NaverAddressResult[]> {
  return new Promise((resolve) => {
    if (
      !window.naver?.maps?.Service?.geocode ||
      !window.naver?.maps?.Service?.Status
    ) {
      resolve([]);
      return;
    }
    window.naver.maps.Service.geocode(
      { query: keyword },
      (
        status: naver.maps.Service.Status,
        response: naver.maps.Service.GeocodeResponse,
      ) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          resolve([]);
          return;
        }
        const items = response.v2?.addresses ?? [];
        const results: NaverAddressResult[] = items.map(
          (item: naver.maps.Service.AddressItemV2) => ({
            address: item.roadAddress || item.jibunAddress,
            latitude: Number(item.y),
            longitude: Number(item.x),
          }),
        );
        resolve(results);
      },
    );
  });
}

/** 지역 검색 API 결과 item 타입 */
interface LocalSearchItem {
  title: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

/** 지역 검색 API 호출 후 NaverAddressResult[]로 정규화 */
async function fetchLocalSearch(
  keyword: string,
): Promise<NaverAddressResult[]> {
  const res = await fetch(
    `/api/search/local?query=${encodeURIComponent(keyword)}`,
  );
  if (!res.ok) return [];
  const { items } = (await res.json()) as { items: LocalSearchItem[] };
  if (!Array.isArray(items)) return [];

  const results: NaverAddressResult[] = [];
  for (const item of items) {
    const coords = localSearchMapxMapyToLatLng(
      Number(item.mapx),
      Number(item.mapy),
    );
    if (!coords) continue;
    results.push({
      address: item.roadAddress || item.address,
      latitude: coords.latitude,
      longitude: coords.longitude,
      title: item.title ? item.title.replace(/<[^>]*>/g, "").trim() : undefined,
    });
  }
  return results;
}

/**
 * 지역 검색 + Geocode 병합.
 * 같은 주소 문자열이면 Geocode 좌표로 맞춤(주소-좌표 일관), 업체명(title)은 지역 검색 유지.
 */
function mergeResults(
  local: NaverAddressResult[],
  geocodeResults: NaverAddressResult[],
): NaverAddressResult[] {
  const geoByNormalized = new Map<string, NaverAddressResult>();
  for (const r of geocodeResults) {
    const k = normalizeAddressKey(r.address);
    if (!geoByNormalized.has(k)) geoByNormalized.set(k, r);
  }

  const seen = new Set<string>();
  const out: NaverAddressResult[] = [];

  for (const r of local) {
    const addrKey = normalizeAddressKey(r.address);
    const geo = geoByNormalized.get(addrKey);
    const merged: NaverAddressResult = geo
      ? {
          ...r,
          latitude: geo.latitude,
          longitude: geo.longitude,
        }
      : r;
    const dedupKey = `${addrKey}|${merged.latitude.toFixed(
      5,
    )}|${merged.longitude.toFixed(5)}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);
    out.push(merged);
  }

  for (const r of geocodeResults) {
    const addrKey = normalizeAddressKey(r.address);
    const dedupKey = `${addrKey}|${r.latitude.toFixed(5)}|${r.longitude.toFixed(
      5,
    )}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);
    out.push(r);
  }
  return out;
}

export const useNaverAddressSearch = ({
  onComplete,
}: UseNaverAddressSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<NaverAddressResult[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<NaverAddressResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runSearch = useCallback(async (keyword: string) => {
    if (!keyword) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const useLocalSearch = keyword.length >= MIN_QUERY_LENGTH_FOR_LOCAL;

    if (!useLocalSearch) {
      const list = await geocode(keyword);
      setSearchResults(list);
      setIsLoading(false);
      return;
    }

    const [geocodeResults, localResults] = await Promise.all([
      geocode(keyword),
      fetchLocalSearch(keyword),
    ]);
    setSearchResults(mergeResults(localResults, geocodeResults));
    setIsLoading(false);
  }, []);

  const fetchAddress = useDebounce(runSearch, DEBOUNCE_MS);

  useEffect(() => {
    fetchAddress(inputValue.trim());
    return () => fetchAddress.cancel();
  }, [inputValue, fetchAddress]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.trim()) setIsLoading(true);
  };

  const handleSelect = (addressObj: NaverAddressResult) => {
    setSelectedAddress(addressObj);
  };

  const handleComplete = () => {
    if (selectedAddress) {
      onComplete({
        address: selectedAddress.address,
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
      });
    }
  };

  return {
    inputValue,
    setInputValue: handleInputChange,
    searchResults,
    selectedAddress,
    isLoading,
    handleSelect,
    handleComplete,
  };
};
