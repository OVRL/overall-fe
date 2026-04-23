import React from "react";
import { useAppData } from "../context/AppDataContext";
import { Trash2 } from "lucide-react";

export const PlayerTable = () => {
  const { players, columns, updatePlayer, deletePlayer } = useAppData();
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig) return players;
    return [...players].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? 0;
      const bVal = b[sortConfig.key] ?? 0;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [players, sortConfig]);

  return (
    <div className="glass-panel table-container">
      <table>
        <thead>
          <tr>
            <th
              onClick={() => handleSort("name")}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                이름
                {sortConfig?.key === "name" && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </div>
            </th>
            {columns.map((col) => (
              <th
                key={col.id}
                onClick={() => handleSort(col.id)}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  {col.name}
                  {sortConfig?.key === col.id && (
                    <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
            ))}
            <th style={{ width: "50px" }}></th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player) => (
            <tr key={player.id}>
              <td style={{ textAlign: "left", fontWeight: "bold" }}>
                <input
                  className="glass-input"
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                  }}
                  value={player.name}
                  onChange={(e) =>
                    updatePlayer(player.id, "name", e.target.value)
                  }
                />
              </td>
              {columns.map((col) => (
                <td
                  key={col.id}
                  className={col.type === "formula" ? "cell-formula" : ""}
                >
                  {col.type === "data" ? (
                    <input
                      type="number"
                      className="glass-input"
                      style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        textAlign: "center",
                      }}
                      value={player[col.id]}
                      onChange={(e) =>
                        updatePlayer(player.id, col.id, Number(e.target.value))
                      }
                    />
                  ) : (
                    <span>{player[col.id]}</span>
                  )}
                </td>
              ))}
              <td>
                <button
                  className="btn-icon"
                  onClick={() => deletePlayer(player.id)}
                  title="선수 삭제"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
