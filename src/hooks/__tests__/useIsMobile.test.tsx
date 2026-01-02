import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../useIsMobile";

describe("useIsMobile", () => {
  const originalInnerWidth = window.innerWidth;
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  let resizeListeners: Array<() => void> = [];

  beforeEach(() => {
    resizeListeners = [];
    
    // Mock window.addEventListener
    window.addEventListener = vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "resize" && typeof listener === "function") {
        resizeListeners.push(listener as () => void);
      }
    }) as typeof window.addEventListener;

    // Mock window.removeEventListener
    window.removeEventListener = vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === "resize" && typeof listener === "function") {
        resizeListeners = resizeListeners.filter((l) => l !== listener);
      }
    }) as typeof window.removeEventListener;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  const triggerResize = () => {
    resizeListeners.forEach((listener) => listener());
  };

  describe("default breakpoint (768px)", () => {
    it("should return true when window width is less than 768px", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 767,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
    });

    it("should return false when window width is 768px or more", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);
    });

    it("should return false when window width is greater than 768px", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);
    });
  });

  describe("custom breakpoint", () => {
    it("should use custom breakpoint when provided", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1000,
      });

      const { result } = renderHook(() => useIsMobile(1200));

      expect(result.current).toBe(true);
    });

    it("should return false when width equals custom breakpoint", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const { result } = renderHook(() => useIsMobile(1200));

      expect(result.current).toBe(false);
    });
  });

  describe("resize handling", () => {
    it("should update when window is resized to mobile", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);

      // Resize to mobile
      act(() => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 500,
        });
        triggerResize();
      });

      expect(result.current).toBe(true);
    });

    it("should update when window is resized to desktop", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);

      // Resize to desktop
      act(() => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 1024,
        });
        triggerResize();
      });

      expect(result.current).toBe(false);
    });

    it("should handle multiple resize events", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);

      // Resize to mobile
      act(() => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 500,
        });
        triggerResize();
      });

      expect(result.current).toBe(true);

      // Resize back to desktop
      act(() => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 1024,
        });
        triggerResize();
      });

      expect(result.current).toBe(false);
    });

    it("should not update when resize stays within same category", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);

      // Resize but still mobile
      act(() => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 600,
        });
        triggerResize();
      });

      expect(result.current).toBe(true);
    });

    it("should add resize event listener on mount", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      renderHook(() => useIsMobile());

      expect(window.addEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    it("should remove resize event listener on unmount", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      const { unmount } = renderHook(() => useIsMobile());

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });
  });

  describe("breakpoint changes", () => {
    it("should update when breakpoint prop changes", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1000,
      });

      const { result, rerender } = renderHook(
        ({ breakpoint }) => useIsMobile(breakpoint),
        {
          initialProps: { breakpoint: 1200 },
        }
      );

      expect(result.current).toBe(true); // 1000 < 1200

      // Change breakpoint to 900
      rerender({ breakpoint: 900 });

      expect(result.current).toBe(false); // 1000 >= 900
    });

    it("should re-register event listener when breakpoint changes", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1000,
      });

      const { rerender, unmount } = renderHook(
        ({ breakpoint }) => useIsMobile(breakpoint),
        {
          initialProps: { breakpoint: 768 },
        }
      );

      const initialCallCount = (window.addEventListener as ReturnType<typeof vi.fn>).mock.calls.length;

      rerender({ breakpoint: 1200 });

      // Should have added a new listener (old one cleaned up, new one added)
      expect(window.addEventListener).toHaveBeenCalledTimes(initialCallCount + 1);

      unmount();

      // Should have removed listener
      expect(window.removeEventListener).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle very small window width", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 320,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
    });

    it("should handle very large window width", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 2560,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);
    });

    it("should handle breakpoint of 0", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 100,
      });

      const { result } = renderHook(() => useIsMobile(0));

      expect(result.current).toBe(false);
    });

    it("should handle breakpoint exactly at window width", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });

      const { result } = renderHook(() => useIsMobile(768));

      expect(result.current).toBe(false);
    });

    it("should handle negative breakpoint", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 100,
      });

      const { result } = renderHook(() => useIsMobile(-100));

      expect(result.current).toBe(false); // 100 >= -100
    });
  });
});

