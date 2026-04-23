"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

const DEFAULT_MESSAGE =
  "지역 검색을 불러오지 못했습니다. \n 잠시 후 다시 시도해 주세요.";

export default class AddressSearchErrorBoundary extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="py-10 text-center text-Label-Tertiary whitespace-pre-line">
            {DEFAULT_MESSAGE}
          </div>
        )
      );
    }
    return this.props.children;
  }
}
