"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Player, ColumnConfig, AppState } from "../types";
import type { CellValue } from "../types";
import { evaluateFormula } from "../utils/statusCalculator";

// Fallback UUID generator if we don't want to install uuid package just for this
const generateId = () => crypto.randomUUID();

interface AppContextType extends AppState {
  addPlayer: (name: string) => void;
  updatePlayer: (id: string, field: string, value: CellValue) => void;
  deletePlayer: (id: string) => void;
  addColumn: (
    name: string,
    type: "data" | "formula",
    expression?: string,
  ) => void;
  updateColumn: (id: string, updates: Partial<ColumnConfig>) => void;
  deleteColumn: (id: string) => void;
  setAllData: (players: Player[], columns: ColumnConfig[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Data
const initialColumns: ColumnConfig[] = [
  { id: "matches", name: "경기 수", type: "data" },
  { id: "goals", name: "득점", type: "data" },
  { id: "assists", name: "도움", type: "data" },
  { id: "cleansheets", name: "클린 시트", type: "data" },
  { id: "wins", name: "승", type: "data" },
  { id: "draws", name: "무", type: "data" },
  { id: "losses", name: "패", type: "data" },
  { id: "mom", name: "mom", type: "data" },
  {
    id: "total",
    name: "총점",
    type: "formula",
    expression:
      "(goals * 3) + (assists * 2) + (cleansheets * 3) + (wins * 2) + (mom * 5)",
  }, // Weighted Total Score
  {
    id: "ovr",
    name: "ovr",
    type: "formula",
    expression: "fifa(total / matches)",
  }, // FIFA-like curved OVR based on Avg Score
];

const initialPlayers: Player[] = Array.from({ length: 5 }, (_, i) => ({
  id: generateId(),
  name: `Player ${i + 1}`,
  matches: 10,
  goals: Math.floor(Math.random() * 5),
  assists: Math.floor(Math.random() * 5),
  cleansheets: Math.floor(Math.random() * 3),
  wins: Math.floor(Math.random() * 5),
  draws: Math.floor(Math.random() * 3),
  losses: Math.floor(Math.random() * 2),
  mom: Math.floor(Math.random() * 2),
}));

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);

  // Recalculate formula columns whenever dependent data changes
  // Actually, we can just calculate them on render or memoize them.
  // But for performance with 50+ players, let's keep it simple first.
  // We'll calculate derived values on the fly in the component or use a memoized selector.
  // Storing them in state might be redundant but easier for export.
  // Let's decide: Export needs the values. So we should probably compute them when `players` or `columns` change.

  // Re-computing derived values helper
  const computeDerivedValues = (
    currentPlayers: Player[],
    currentCols: ColumnConfig[],
  ) => {
    return currentPlayers.map((p) => {
      const updatedP = { ...p };
      // Sort columns so formulas that depend on other formulas might need order.
      // For now, assume single pass or topological sort if needed.
      // Simple 2-pass approach to cover simple dependencies
      let pass = 0;
      while (pass < 2) {
        currentCols
          .filter((c) => c.type === "formula")
          .forEach((col) => {
            if (col.expression) {
              updatedP[col.id] = evaluateFormula(
                col.expression,
                updatedP,
                currentCols,
              );
            }
          });
        pass++;
      }
      return updatedP;
    });
  };

  useEffect(() => {
    setPlayers((prev) => computeDerivedValues(prev, columns));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount to compute initial values. Subsequent updates handled by actions.

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: generateId(),
      name,
    };
    // Initialize data columns with 0
    columns.forEach((col) => {
      if (col.type === "data") newPlayer[col.id] = 0;
    });

    const withDerived = computeDerivedValues([newPlayer], columns)[0];
    setPlayers((prev) => [...prev, withDerived]);
  };

  const updatePlayer = (id: string, field: string, value: CellValue) => {
    setPlayers((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      });
      return computeDerivedValues(updated, columns);
    });
  };

  const deletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const addColumn = (
    name: string,
    type: "data" | "formula",
    expression?: string,
  ) => {
    const newCol: ColumnConfig = {
      id: generateId(), // or sanitize(name)
      name,
      type,
      expression,
    };
    setColumns((prev) => {
      const nextCols = [...prev, newCol];
      // If data column, init players with default 0
      if (type === "data") {
        setPlayers((currPlayers) =>
          currPlayers.map((p) => ({ ...p, [newCol.id]: 0 })),
        );
      } else {
        // Recalculate if formula
        setPlayers((currPlayers) =>
          computeDerivedValues(currPlayers, nextCols),
        );
      }
      return nextCols;
    });
  };

  const updateColumn = (id: string, updates: Partial<ColumnConfig>) => {
    setColumns((prev) => {
      const nextCols = prev.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      );
      setPlayers((currPlayers) => computeDerivedValues(currPlayers, nextCols));
      return nextCols;
    });
  };

  const deleteColumn = (id: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== id));
    setPlayers((prev) =>
      prev.map((p) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _discard, ...rest } = p;
        return rest as Player; // cleanup
      }),
    );
  };

  const setAllData = (newPlayers: Player[], newColumns: ColumnConfig[]) => {
    setPlayers(newPlayers);
    setColumns(newColumns);
  };

  return (
    <AppContext.Provider
      value={{
        players,
        columns,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addColumn,
        updateColumn,
        deleteColumn,
        setAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppData must be used within AppProvider");
  return context;
};
