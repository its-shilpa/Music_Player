// src/components/CarouselContainer.jsx
// A reusable carousel component that hides native browser scrollbars
// and replaces them with sleek left/right floating navigation arrows.
// It uses React refs and ResizeObservers to dynamically show or hide arrows
// depending on whether scrolling is possible in either direction.

import { useRef, useState, useEffect, Children } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselContainer({ children, paddingClass = "" }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Check scroll positions and update button visibility states
  const checkScrollLimits = () => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      // Show left arrow if scrolled past a tiny threshold
      setShowLeft(scrollLeft > 5);
      // Show right arrow if scrollable area remains on the right
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollLimits();
      el.addEventListener("scroll", checkScrollLimits);
      
      // Observe resize to adjust arrow states if viewport changes
      const resizeObserver = new ResizeObserver(() => checkScrollLimits());
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener("scroll", checkScrollLimits);
        resizeObserver.disconnect();
      };
    }
  }, [children]);

  // Smooth scroll offset logic
  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.7;
      const target = direction === "left" 
        ? el.scrollLeft - scrollAmount 
        : el.scrollLeft + scrollAmount;
      
      el.scrollTo({
        left: target,
        behavior: "smooth"
      });
    }
  };

  // If there are no children, don't render anything
  if (Children.count(children) === 0) return null;

  return (
    <div className="carousel-wrapper">
      {/* Scroll Left Button */}
      {showLeft && (
        <button 
          className="carousel-arrow left" 
          onClick={() => handleScroll("left")}
          aria-label="Scroll left"
          type="button"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
      )}
      
      {/* Scrollable Contents Window */}
      <div 
        ref={scrollRef} 
        className={`carousel-scroll-content ${paddingClass}`}
      >
        {children}
      </div>

      {/* Scroll Right Button */}
      {showRight && (
        <button 
          className="carousel-arrow right" 
          onClick={() => handleScroll("right")}
          aria-label="Scroll right"
          type="button"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
