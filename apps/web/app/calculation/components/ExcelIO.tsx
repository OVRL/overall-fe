import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { useAppData } from "../context/AppDataContext";
import { Download, Upload } from "lucide-react";

export const ExcelIO = () => {
  const { players, columns, setAllData, addPlayer } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    // Flatten data for export
    const exportData = players.map((p) => {
      const row: any = { Name: p.name };
      columns.forEach((col) => {
        row[col.name] = p[col.id];
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Players");
    XLSX.writeFile(wb, "player_stats.xlsx");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      if (data.length > 0) {
        // Create a map of column names to IDs for easy lookup
        // e.g. "경기 수" -> "matches"
        const colMap: Record<string, string> = {};
        columns.forEach((col) => {
          colMap[col.name] = col.id;
        });

        const importedPlayers: any[] = [];

        data.forEach((row: any) => {
          // Find name. Support "Name", "name", "선수", or default
          const nameData =
            row["Name"] || row["name"] || row["선수"] || row["Player"];
          if (!nameData) return; // Skip rows without name

          const playerObj: any = {
            // If player exists, we'll merge later, but for now create a structure
            // We need a temporary ID or we'll match by name
            name: String(nameData),
          };

          // Map row data to internal IDs
          Object.keys(row).forEach((key) => {
            const targetColId = colMap[key];
            if (targetColId) {
              playerObj[targetColId] = row[key];
            }
          });
          importedPlayers.push(playerObj);
        });

        // User request: Replace existing data (specifically to remove initial dummy data)
        const newPlayers = importedPlayers.map((imp) => ({
          id: crypto.randomUUID(),
          ...imp,
          // Ensure all data columns have at least 0 if missing
          ...columns.reduce((acc, col) => {
            if (col.type === "data" && imp[col.id] === undefined) {
              acc[col.id] = 0;
            }
            return acc;
          }, {} as any),
        }));

        // Update state - REPLACING existing players with imported ones
        setAllData(newPlayers, columns);

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
        alert(
          `Successfully imported ${newPlayers.length} players! (Previous data replaced)`,
        );
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        className="btn-primary"
        onClick={handleExport}
        style={{ display: "flex", gap: "4px" }}
      >
        <Download size={16} /> Export Excel
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        style={{ display: "none" }}
        accept=".xlsx, .xls"
        onChange={handleImport}
      />
      {/* 
            <button className="btn-primary" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', gap: '4px', background: 'var(--bg-tertiary)' }}>
                <Upload size={16} /> Import Excel
            </button> 
            */
      /* Import logic is complex with dynamic columns. Keeping it disabled or simple for now until explicitly asked to refine.
              The user asked for import/export. I'll uncomment and allow basic import but maybe just console log or basic match.
           */}
      <button
        className="btn-primary"
        onClick={() => fileInputRef.current?.click()}
        style={{
          display: "flex",
          gap: "4px",
          background: "var(--bg-tertiary)",
        }}
      >
        <Upload size={16} /> Import Excel
      </button>
    </div>
  );
};
