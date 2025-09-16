import React from "react";
import "./StatsDialog.css";
import { IconInfoCircle } from "@tabler/icons-react";

/**
 * StatsDialog - A reusable component for displaying performance and debug information
 * @param {Object} stats - Statistics object to display
 * @param {boolean} isVisible - Whether the dialog is visible
 * @param {Function} onToggle - Callback to toggle dialog visibility
 * @param {Array} customSections - Additional sections to display [{ title, items: [{ label, value }] }]
 * @param {Array} actions - Action buttons [{ label, onClick, className }]
 * @param {Object} style - Additional styles for the dialog
 * @param {string} position - Position of the dialog ('bottom-right', 'bottom-left', 'top-right', 'top-left')
 */
const StatsDialog = ({
  stats = {},
  isVisible = false,
  onToggle,
  customSections = [],
  actions = [],
  style = {},
  position = "bottom-right",
  title = "Stats",
}) => {
  const formatValue = (value) => {
    if (typeof value === "number") {
      // Format numbers nicely
      if (value % 1 === 0) return value.toLocaleString();
      return value.toFixed(2);
    }
    return value?.toString() || "N/A";
  };

  const getPerformanceClass = (label, value) => {
    if (typeof value !== "number") return "";

    switch (label) {
      case "FPS":
        if (value >= 55) return "good";
        if (value >= 30) return "warning";
        return "critical";
      case "Frame Time":
      case "Render Time":
      case "Query Time":
        if (value <= 16) return "good";
        if (value <= 33) return "warning";
        return "critical";
      default:
        return "";
    }
  };

  const renderStatsSection = (sectionTitle, items) => (
    <div key={sectionTitle} className="stats-section">
      <h4 className="stats-section-title">{sectionTitle}</h4>
      {items.map(({ label, value, unit = "" }) => (
        <div key={label} className="stats-item">
          <span className="stats-label">{label}:</span>
          <span className={`stats-value ${getPerformanceClass(label, value)}`}>
            {formatValue(value)}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );

  const defaultSections = [
    {
      title: "Performance",
      items: [
        { label: "FPS", value: stats.fps },
        // { label: "Frame Time", value: stats.frameTime, unit: "ms" },
        { label: "Render Time", value: stats.renderTime, unit: "ms" },
        // { label: "Query Time", value: stats.queryTime, unit: "ms" },
      ].filter((item) => item.value !== undefined),
    },
    {
      title: "Quadtree",
      items: [
        { label: "Total Items", value: stats.totalItems },
        { label: "Visible Items", value: stats.visibleItems },
        // { label: "Visible Nodes", value: stats.quadtreeNodes },
        // { label: "Build Time", value: stats.quadtreeBuildTime, unit: "ms" },
      ].filter((item) => item.value !== undefined),
    },
    {
      title: "Viewport",
      items: [
        { label: "Position", value: stats.viewport },
        { label: "Zoom", value: stats.zoom, unit: "x" },
      ].filter((item) => item.value !== undefined),
    },
  ].filter((section) => section.items.length > 0);

  const allSections = [...defaultSections, ...customSections];

  return (
    <div
      className={`stats-dialog ${position} ${isVisible ? "visible" : ""}`}
      style={style}
    >
      <button
        className="stats-toggle"
        onClick={onToggle}
        aria-label="Toggle stats"
        title={isVisible ? "Hide stats" : "Show performance stats"}
      >
        {isVisible ? (
          <span className="toggle-icon close">✕</span>
        ) : (
          <span className="toggle-icon open">
            <IconInfoCircle />
          </span>
        )}
      </button>
      {isVisible && (
        <div className="stats-content">
          <h3 className="stats-title">{title}</h3>

          {allSections.map((section) =>
            renderStatsSection(section.title, section.items)
          )}

          {actions.length > 0 && (
            <div className="stats-actions">
              {actions.map(({ label, onClick, className = "" }, index) => (
                <button
                  key={index}
                  className={`stats-action-button ${className}`}
                  onClick={onClick}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsDialog;
