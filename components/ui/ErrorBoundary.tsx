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
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-xl p-8 text-center gap-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
          <div>
            <h3 className="font-sora font-semibold text-gray-800 text-lg mb-1">
              3D Preview Unavailable
            </h3>
            <p className="text-gray-500 text-sm">
              Your browser may not support WebGL. Your design will still print correctly when you place an order.
            </p>
          </div>
          {/* Fallback flat t-shirt SVG */}
          <svg
            viewBox="0 0 120 100"
            className="w-32 h-28 text-gray-300"
            fill="currentColor"
          >
            <path d="M30 10 L10 30 L25 35 L25 90 L95 90 L95 35 L110 30 L90 10 L75 20 Q60 28 45 20 Z" />
          </svg>
          <button
            onClick={() => this.setState({ hasError: false, errorMessage: "" })}
            className="text-sm text-brand-red underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
