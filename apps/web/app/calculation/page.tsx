"use client";

import { AppProvider, useAppData } from "./context/AppDataContext";
import { PlayerTable } from "./components/PlayerTable";
import { ColumnManager } from "./components/ColumnManager";
import { ExcelIO } from "./components/ExcelIO";
import { Plus } from "lucide-react";
import "./App.css";

const Dashboard = () => {
  const { addPlayer } = useAppData();

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            OVR Calculator
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Player Statistics & Formula Engine
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <ExcelIO />
          <ColumnManager />
          <button
            className="btn-primary"
            onClick={() => addPlayer("New Player")}
          >
            <Plus size={16} style={{ marginRight: "4px" }} />
            Add Player
          </button>
        </div>
      </header>

      <main>
        <PlayerTable />
      </main>
    </div>
  );
};

export default function CalculationPage() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
