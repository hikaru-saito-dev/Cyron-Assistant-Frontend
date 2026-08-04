"use client";

import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import React from "react";

import { cn } from "../../lib/utils";

/* Candy-stripe diagonal pattern — injected once via <style> */
const candyCss = `
.stats-candy-bg {
  background-color: rgba(255, 255, 255, 0.03);
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 25%,
    transparent 25.5%,
    transparent 50%,
    rgba(255, 255, 255, 0.08) 50.5%,
    rgba(255, 255, 255, 0.08) 75%,
    transparent 75.5%,
    transparent
  );
  background-size: 10px 10px;
}
`;

const Stats = () => {
  return (
    <section
      className="stats-section py-32"
      style={{ backgroundColor: "#000", backgroundImage: "none" }}
    >
      <style>{candyCss}</style>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        {/* Header */}
        <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.15,
            }}
          >
            We don't believe in talk we Deliver Results
          </h1>
          <p
            style={{
              marginTop: "1rem",
              color: "#94a3b8",
              fontSize: "1.05rem",
              lineHeight: 1.6,
            }}
          >
            See how Cyron's AI-first ticket system stacks up against traditional Discord bots — grounded answers, faster resolutions, happier users.
          </p>
        </div>

        {/* Bar chart area */}
        <div
          style={{
            position: "relative",
            maxWidth: "56rem",
            height: "28rem",
            margin: "5rem auto 0",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {[
            { value: 35, label: "competitor 1", delay: 0.2, isAccent: false },
            { value: 25, label: "competitor 2", delay: 0.4, isAccent: false },
            { value: 99, label: "Cyron", delay: 0.6, isAccent: true, showToolTip: true },
            { value: 37, label: "competitor 4", delay: 0.8, isAccent: false },
          ].map((props, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                type: "spring",
                damping: 10,
              }}
              style={{ height: "100%", width: "100%", position: "relative" }}
            >
              <BarChart {...props} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Stats };

/* ────────────────────── BarChart ────────────────────── */

const BarChart = ({
  value,
  label,
  isAccent = false,
  showToolTip = false,
  delay = 0,
}: {
  value: number;
  label: string;
  isAccent?: boolean;
  showToolTip?: boolean;
  delay?: number;
}) => {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Outer candy-stripe container */}
      <div
        className="stats-candy-bg"
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          borderRadius: "40px",
          backgroundColor: "rgba(30, 41, 59, 0.35)",
          backgroundImage: undefined, // let class handle it
        }}
      >
        {/* Filled bar */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          whileInView={{ opacity: 1, height: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring", damping: 20, delay }}
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderRadius: "40px",
            backgroundColor: isAccent ? "#0433FF" : "rgba(255, 255, 255, 0.15)",
            padding: "0.75rem",
            color: "#fff",
          }}
        >
          {/* Percentage pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "3.5rem",
              width: "100%",
              borderRadius: "9999px",
              backgroundColor: isAccent
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.15)",
              fontVariantNumeric: "tabular-nums",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            <NumberFlow value={value} suffix="%" />
          </div>
        </motion.div>
      </div>

      {/* Tooltip (only for accent bar) */}
      {showToolTip && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          whileInView={{ opacity: 1, height: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring", damping: 15, delay }}
          style={{ position: "absolute", bottom: 0, width: "100%" }}
        >
          {/* Connector dot exactly at the top center of the bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "0.75rem",
              height: "0.75rem",
              borderRadius: "50%",
              border: "2px solid #fff",
              backgroundColor: "#0433FF",
              zIndex: 10,
            }}
          />

          {/* Tooltip bubble positioned perfectly above the dot */}
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            whileInView={{ opacity: 1, y: 0, x: "-50%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", damping: 15, delay: delay + 0.3 }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 0.15rem)", // distance above the bar
              left: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 20,
            }}
          >
            {/* Tooltip bubble */}
            <div
              style={{
                backgroundColor: "#0433FF",
                color: "#fff",
                padding: "0.25rem 0.75rem",
                borderRadius: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              Accuracy
            </div>
            {/* Arrow */}
            <svg
              style={{
                color: "#0433FF",
                marginTop: "-1px", // seamlessly attach to bubble
              }}
              width="10"
              height="7"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.83855 8.41381C4.43827 9.45255 5.93756 9.45255 6.53728 8.41381L9.65582 3.01233C10.2555 1.97359 9.50589 0.675159 8.30646 0.675159H2.06937C0.869935 0.675159 0.120287 1.97359 0.720006 3.01233L3.83855 8.41381Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Label */}
      <p
        style={{
          textAlign: "center",
          marginTop: "0.5rem",
          color: "rgba(148, 163, 184, 0.8)",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </p>
    </div>
  );
};
