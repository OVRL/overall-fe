/// <reference types="navermaps" />
import { useState, useEffect } from "react";
import { useDebounce } from "@toss/react";

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
}

interface UseNaverAddressSearchProps {
  onComplete: (result: NaverAddressResult) => void;
}

export const useNaverAddressSearch = ({
  onComplete,
}: UseNaverAddressSearchProps) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<NaverAddressResult[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<NaverAddressResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddress = useDebounce((keyword: string) => {
    if (!keyword) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    // 네이버 맵 스크립트 로드 대기 검사
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      console.error("Naver Maps API is not loaded.");
      setIsLoading(false);
      return;
    }

    window.naver.maps.Service.geocode(
      {
        query: keyword,
      },
      (
        status: naver.maps.Service.Status,
        response: naver.maps.Service.GeocodeResponse,
      ) => {
        setIsLoading(false);
        if (status !== window.naver.maps.Service.Status.OK) {
          console.warn("Naver geocode failed or returned an error status.");
          setSearchResults([]);
          return;
        }

        const result = response.v2; // Search results container
        const items = result.addresses; // Array of results

        const parsedResults: NaverAddressResult[] = items.map(
          (item: naver.maps.Service.AddressItemV2) => ({
            address: item.roadAddress || item.jibunAddress, // 도로명 우선, 없으면 지번
            latitude: Number(item.y),
            longitude: Number(item.x),
          }),
        );

        setSearchResults(parsedResults);
      },
    );
  }, 700);

  useEffect(() => {
    fetchAddress(inputValue.trim());

    // cleanup
    return () => {
      fetchAddress.cancel();
    };
  }, [inputValue, fetchAddress]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.trim()) {
      setIsLoading(true);
    }
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
