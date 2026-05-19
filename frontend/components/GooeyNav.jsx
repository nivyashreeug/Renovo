"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import "./GooeyNav.css";

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  currentActiveIndex,
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  // Noise helper
  const noise = (n = 1) => n / 2 - Math.random() * n;

  // Get particle positions
  const getXY = (distance, pointIndex, totalPoints) => {
    const angle =
      ((360 + noise(8)) / totalPoints) *
      pointIndex *
      (Math.PI / 180);

    return [
      distance * Math.cos(angle),
      distance * Math.sin(angle),
    ];
  };

  // Create particle config
  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);

    return {
      start: getXY(
        d[0],
        particleCount - i,
        particleCount
      ),

      end: getXY(
        d[1] + noise(7),
        particleCount - i,
        particleCount
      ),

      time: t,

      scale: 1 + noise(0.2),

      color:
        colors[
        Math.floor(Math.random() * colors.length)
        ],

      rotate:
        rotate > 0
          ? (rotate + r / 20) * 10
          : (rotate - r / 20) * 10,
    };
  };

  // Update gooey effect position
  const updateEffectPosition = (element) => {
    if (
      !containerRef.current ||
      !filterRef.current ||
      !textRef.current
    )
      return;

    const containerRect =
      containerRef.current.getBoundingClientRect();

    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };

    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);

    textRef.current.innerText = element.innerText;
  };

  // Create particles
  const makeParticles = (element) => {
    const d = particleDistances;
    const r = particleR;

    const bubbleTime =
      animationTime * 2 + timeVariance;

    element.style.setProperty(
      "--time",
      `${bubbleTime}ms`
    );

    for (let i = 0; i < particleCount; i++) {
      const t =
        animationTime * 2 +
        noise(timeVariance * 2);

      const p = createParticle(i, t, d, r);

      element.classList.remove("active");

      setTimeout(() => {
        const particle =
          document.createElement("span");

        const point =
          document.createElement("span");

        particle.classList.add("particle");
        point.classList.add("point");

        particle.style.setProperty(
          "--start-x",
          `${p.start[0]}px`
        );

        particle.style.setProperty(
          "--start-y",
          `${p.start[1]}px`
        );

        particle.style.setProperty(
          "--end-x",
          `${p.end[0]}px`
        );

        particle.style.setProperty(
          "--end-y",
          `${p.end[1]}px`
        );

        particle.style.setProperty(
          "--time",
          `${p.time}ms`
        );

        particle.style.setProperty(
          "--scale",
          `${p.scale}`
        );

        particle.style.setProperty(
          "--color",
          `var(--color-${p.color}, white)`
        );

        particle.style.setProperty(
          "--rotate",
          `${p.rotate}deg`
        );

        particle.appendChild(point);
        element.appendChild(particle);

        requestAnimationFrame(() => {
          element.classList.add("active");
        });

        setTimeout(() => {
          if (element.contains(particle)) {
            element.removeChild(particle);
          }
        }, t);
      }, 30);
    }
  };

  // Handle click
  const handleClick = (e, index) => {
    const liEl = e.currentTarget.closest("li");

    if (!liEl) return;

    if (activeIndex === index) return;

    setActiveIndex(index);

    updateEffectPosition(liEl);

    if (filterRef.current) {
      const particles =
        filterRef.current.querySelectorAll(
          ".particle"
        );

      particles.forEach((p) => {
        if (filterRef.current.contains(p)) {
          filterRef.current.removeChild(p);
        }
      });
    }

    if (textRef.current) {
      textRef.current.classList.remove("active");

      void textRef.current.offsetWidth;

      textRef.current.classList.add("active");
    }

    if (filterRef.current) {
      makeParticles(filterRef.current);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e, index);
    }
  };

  // External active index sync
  useEffect(() => {
    if (
      currentActiveIndex !== undefined &&
      currentActiveIndex !== activeIndex
    ) {
      setActiveIndex(currentActiveIndex);

      const liEl =
        navRef.current?.querySelectorAll("li")[
        currentActiveIndex
        ];

      if (liEl) {
        updateEffectPosition(liEl);

        if (filterRef.current) {
          makeParticles(filterRef.current);
        }
      }
    }
  }, [currentActiveIndex]);

  // Initial effect positioning
  useEffect(() => {
    if (
      !navRef.current ||
      !containerRef.current
    )
      return;

    const activeLi =
      navRef.current.querySelectorAll("li")[
      activeIndex
      ];

    if (activeLi) {
      updateEffectPosition(activeLi);

      if (textRef.current) {
        textRef.current.classList.add("active");
      }
    }

    const resizeObserver =
      new ResizeObserver(() => {
        const currentActiveLi =
          navRef.current?.querySelectorAll(
            "li"
          )[activeIndex];

        if (currentActiveLi) {
          updateEffectPosition(currentActiveLi);
        }
      });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <div
      className="gooey-nav-container"
      ref={containerRef}
    >
      <nav>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li
              key={index}
              className={
                activeIndex === index
                  ? "active"
                  : ""
              }
            >
              <a
                href={item.href}
                onClick={(e) =>
                  handleClick(e, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <span
        className="effect filter"
        ref={filterRef}
      />

      <span
        className="effect text"
        ref={textRef}
      />
    </div>
  );
}
export default GooeyNav;