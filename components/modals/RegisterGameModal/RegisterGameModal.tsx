"use client";

import { useCallback, useId, useReducer } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import AuthTextField from "@/components/login/AuthTextField";
import ModalLayout from "../ModalLayout";
import useModal from "@/hooks/useModal";
import calendar from "@/public/icons/calendar.svg";
import FormSection from "./FormSection";
import SegmentToggle from "./SegmentToggle";
import UniformOption from "./UniformOption";
import type { UniformType } from "./UniformOption";
import {
  GAME_TYPE,
  UNIFORM,
  QUARTER_COUNT_OPTIONS,
  QUARTER_DURATION_OPTIONS,
  VOTE_DEADLINE_OPTIONS,
} from "./constants";

type GameType = keyof typeof GAME_TYPE;

interface RegisterGameState {
  gameType: GameType;
  opponentName: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venue: string;
  quarterCount: string;
  quarterDuration: string;
  voteDeadline: string;
  uniform: UniformType;
  memo: string;
}

const initialState: RegisterGameState = {
  gameType: "MATCH",
  opponentName: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  venue: "",
  quarterCount: "4",
  quarterDuration: "25",
  voteDeadline: "1_DAY_BEFORE",
  uniform: "AWAY",
  memo: "",
};

type Action =
  | { type: "SET_FIELD"; field: keyof RegisterGameState; value: string }
  | { type: "RESET" };

function registerGameReducer(
  state: RegisterGameState,
  action: Action,
): RegisterGameState {
  if (action.type === "RESET") return initialState;
  if (action.type === "SET_FIELD") {
    if (action.field === "gameType" || action.field === "uniform") {
      return {
        ...state,
        [action.field]: action.value as GameType & UniformType,
      };
    }
    return { ...state, [action.field]: action.value };
  }
  return state;
}

const gameTypeOptions = [
  { value: "MATCH" as const, label: GAME_TYPE.MATCH },
  { value: "INTERNAL" as const, label: GAME_TYPE.INTERNAL },
];

function RegisterGameModal() {
  const { hideModal } = useModal();
  const [state, dispatch] = useReducer(registerGameReducer, initialState);
  const id = useId();

  const setField = useCallback(
    (field: keyof RegisterGameState, value: string) => {
      dispatch({ type: "SET_FIELD", field, value });
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: API 연동 시 payload 전송
      hideModal();
    },
    [hideModal],
  );

  const handleCancel = useCallback(() => {
    dispatch({ type: "RESET" });
    hideModal();
  }, [hideModal]);

  return (
    <ModalLayout
      title="경기 등록"
      onClose={() => dispatch({ type: "RESET" })}
      wrapperClassName="w-full md:w-full max-w-[90vw] md:max-w-112 lg:max-w-125"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-8 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin"
      >
        <FormSection label="경기 성격">
          <SegmentToggle
            options={gameTypeOptions}
            value={state.gameType}
            onChange={(v) => setField("gameType", v)}
          />
        </FormSection>

        <AuthTextField
          label="상대팀"
          value={state.opponentName}
          onChange={(e) => setField("opponentName", e.target.value)}
          placeholder="상대팀 이름을 입력해주세요."
          onClear={() => setField("opponentName", "")}
        />

        <FormSection label="일정">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Icon
                src={calendar}
                width={20}
                height={20}
                className="text-Fill_Tertiary"
              />
              <input
                type="date"
                id={`${id}-start-date`}
                value={state.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
                className="flex-1 min-w-0 h-12 px-3 py-2 bg-Fill_Quatiary rounded-[0.625rem] text-sm text-Label-Primary outline-none border border-transparent focus:border-Fill_AccentPrimary"
              />
              <input
                type="time"
                id={`${id}-start-time`}
                value={state.startTime}
                onChange={(e) => setField("startTime", e.target.value)}
                className="w-24 h-12 px-3 py-2 bg-Fill_Quatiary rounded-[0.625rem] text-sm text-Label-Primary outline-none border border-transparent focus:border-Fill_AccentPrimary"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Icon
                src={calendar}
                width={20}
                height={20}
                className="text-Fill_Tertiary"
              />
              <input
                type="date"
                id={`${id}-end-date`}
                value={state.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
                className="flex-1 min-w-0 h-12 px-3 py-2 bg-Fill_Quatiary rounded-[0.625rem] text-sm text-Label-Primary outline-none border border-transparent focus:border-Fill_AccentPrimary"
              />
              <input
                type="time"
                id={`${id}-end-time`}
                value={state.endTime}
                onChange={(e) => setField("endTime", e.target.value)}
                className="w-24 h-12 px-3 py-2 bg-Fill_Quatiary rounded-[0.625rem] text-sm text-Label-Primary outline-none border border-transparent focus:border-Fill_AccentPrimary"
              />
            </div>
          </div>
        </FormSection>

        <FormSection label="경기 장소">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-Fill_Tertiary pointer-events-none">
              📍
            </span>
            <input
              type="text"
              id={`${id}-venue`}
              value={state.venue}
              onChange={(e) => setField("venue", e.target.value)}
              placeholder="경기 장소를 입력하세요"
              className="w-full h-12 pl-9 pr-4 py-3 bg-Fill_Quatiary border border-transparent rounded-[0.625rem] text-sm text-Label-Primary placeholder:text-Label-Tertiary outline-none focus:border-Fill_AccentPrimary transition-colors"
            />
          </div>
        </FormSection>

        <FormSection label="쿼터">
          <div className="flex gap-2">
            <Dropdown
              options={QUARTER_COUNT_OPTIONS}
              value={state.quarterCount}
              onChange={(v) => setField("quarterCount", v)}
              placeholder="쿼터 수"
            />
            <Dropdown
              options={QUARTER_DURATION_OPTIONS}
              value={state.quarterDuration}
              onChange={(v) => setField("quarterDuration", v)}
              placeholder="시간"
            />
          </div>
        </FormSection>

        <FormSection label="투표 마감 일정">
          <Dropdown
            options={VOTE_DEADLINE_OPTIONS}
            value={state.voteDeadline}
            onChange={(v) => setField("voteDeadline", v)}
            placeholder="선택해주세요"
          />
        </FormSection>

        <FormSection label="유니폼">
          <div className="flex gap-2">
            <UniformOption
              type="HOME"
              label={UNIFORM.HOME}
              isSelected={state.uniform === "HOME"}
              onSelect={() => setField("uniform", "HOME")}
            />
            <UniformOption
              type="AWAY"
              label={UNIFORM.AWAY}
              isSelected={state.uniform === "AWAY"}
              onSelect={() => setField("uniform", "AWAY")}
            />
          </div>
        </FormSection>

        <FormSection label="메모">
          <textarea
            id={`${id}-memo`}
            value={state.memo}
            onChange={(e) => setField("memo", e.target.value)}
            placeholder="추가 메모사항을 입력하세요"
            rows={3}
            className="w-full px-4 py-3 bg-Fill_Quatiary border border-transparent rounded-[0.625rem] text-sm text-Label-Primary placeholder:text-Label-Tertiary outline-none focus:border-Fill_AccentPrimary transition-colors resize-none"
          />
        </FormSection>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="xl"
            className="flex-1"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button type="submit" variant="primary" size="xl" className="flex-1">
            등록
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
}

export default RegisterGameModal;
