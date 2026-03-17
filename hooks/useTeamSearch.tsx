"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@toss/react";
import { fetchQuery } from "relay-runtime";
import useModal from "@/hooks/useModal";
import { getClientEnvironment } from "@/lib/relay/environment";
import {
  observableToPromise,
  type RelayObservableLike,
} from "@/lib/relay/observableToPromise";
import { FindTeamsByNameQuery } from "@/lib/relay/queries/findTeamsByNameQuery";
import type { findTeamsByNameQuery$data } from "@/__generated__/findTeamsByNameQuery.graphql";

/** 팀 검색 결과 한 건 (등록 팀) */
export interface TeamSearchItem {
  id: number;
  name: string;
  emblem: string | null;
}

/** 외부팀 선택 시 (서비스 미등록 팀) */
export interface ExternalTeamItem {
  id: null;
  name: string;
  emblem: string;
}

export type TeamSearchResult = TeamSearchItem | ExternalTeamItem;

export function isExternalTeam(
  item: TeamSearchResult,
): item is ExternalTeamItem {
  return item.id === null;
}

const DEFAULT_EMBLEM_PATH = "/icons/teamemblum_default.svg";

interface UseTeamSearchProps {
  onComplete: (result: TeamSearchResult) => void;
}

export function useTeamSearch({ onComplete }: UseTeamSearchProps) {
  const { hideModal } = useModal();
  const [inputValue, setInputValue] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<TeamSearchItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamSearchResult | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);

  const debouncedUpdate = useDebounce((value: string) => {
    setDebouncedKeyword(value.trim());
  }, 700);

  useEffect(() => {
    debouncedUpdate(inputValue);
  }, [inputValue, debouncedUpdate]);

  useEffect(() => {
    let isMounted = true;

    const performSearch = async () => {
      if (!debouncedKeyword) {
        if (isMounted) setSearchResults([]);
        return;
      }

      if (isMounted) setIsSearching(true);

      try {
        const environment = getClientEnvironment();
        const observable = fetchQuery(
          environment,
          FindTeamsByNameQuery,
          { name: debouncedKeyword },
          { fetchPolicy: "network-only" },
        );
        const data = await observableToPromise<
          findTeamsByNameQuery$data
        >(observable as unknown as RelayObservableLike<findTeamsByNameQuery$data>);

        if (!isMounted) return;

        const items = data?.findTeamsByName?.items ?? [];
        const teams: TeamSearchItem[] = items.map((item) => ({
          id: Number(item.id),
          name: item.name ?? "",
          emblem: item.emblem ?? null,
        }));
        setSearchResults(teams);
      } catch {
        if (isMounted) setSearchResults([]);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    performSearch();
    return () => {
      isMounted = false;
    };
  }, [debouncedKeyword]);

  const handleSelect = useCallback((team: TeamSearchResult) => {
    setSelectedTeam(team);
  }, []);

  const handleComplete = useCallback(() => {
    if (selectedTeam) {
      onComplete(selectedTeam);
      hideModal();
    }
  }, [selectedTeam, onComplete, hideModal]);

  /** 입력한 이름으로 외부팀 항목 (용병으로 추가와 동일 패턴) */
  const externalTeam: ExternalTeamItem | null = inputValue.trim()
    ? {
        id: null,
        name: inputValue.trim(),
        emblem: DEFAULT_EMBLEM_PATH,
      }
    : null;

  const isLoading = isSearching || inputValue !== debouncedKeyword;

  return {
    inputValue,
    setInputValue,
    debouncedKeyword,
    searchResults,
    selectedTeam,
    externalTeam,
    isSearching: isLoading,
    handleSelect,
    handleComplete,
    hideModal,
  };
}
