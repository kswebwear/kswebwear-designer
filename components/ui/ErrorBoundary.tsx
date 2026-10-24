"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || "An unexpected error occurred.",
    };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] 3D viewer error:", error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="flex h-full flex-col items-center justify-center gap-4 bg-ks-fog p-8 text-center">
          <AlertTriangle size={40} aria-hidden="true" />
          <div>
            <h3 className="ks-title mb-1 text-xl">3D preview unavailable</h3>
            <p className="max-w-sm text-sm text-ks-body">
              Your browser may not support WebGL. Your design will still print correctly when you place an order.
            </p>
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, errorMessage: "" })}
            className="inline-flex min-h-ks-tap items-center border-[1.5px] border-ks-ink px-5 font-bold hover:bg-ks-ink hover:text-ks-paper"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
