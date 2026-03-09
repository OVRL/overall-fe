import React, { useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { Modal } from "./Modal";
import { Trash2, Settings, Plus } from "lucide-react";

export const ColumnManager = () => {
  const { columns, addColumn, deleteColumn, updateColumn } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColType, setNewColType] = useState<"data" | "formula">("data");
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editExpression, setEditExpression] = useState("");

  const handleAdd = () => {
    if (newColName.trim()) {
      addColumn(
        newColName,
        newColType,
        newColType === "formula" ? "0" : undefined,
      );
      setNewColName("");
    }
  };

  const openFormulaEditor = (colId: string, currentExpr: string = "") => {
    setEditingColId(colId);
    setEditExpression(currentExpr);
  };

  const saveFormula = () => {
    if (editingColId) {
      updateColumn(editingColId, { expression: editExpression });
      setEditingColId(null);
    }
  };

  return (
    <>
      <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
        <Settings size={16} /> 열 관리
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="열 관리"
      >
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <input
            className="glass-input"
            placeholder="새 열 이름"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            className="glass-input"
            value={newColType}
            onChange={(e) => setNewColType(e.target.value as any)}
          >
            <option value="data">데이터 필드</option>
            <option value="formula">계산식</option>
          </select>
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={16} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {columns.map((col) => (
            <div
              key={col.id}
              className="glass-panel"
              style={{
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "4px",
              }}
            >
              <div>
                <span style={{ fontWeight: 600, marginRight: "8px" }}>
                  {col.name}
                </span>
                <span
                  style={{ fontSize: "0.8em", color: "var(--text-secondary)" }}
                >
                  {col.type === "data" ? "데이터" : "계산식"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {col.type === "formula" && (
                  <button
                    className="btn-icon"
                    onClick={() => openFormulaEditor(col.id, col.expression)}
                    title="계산식 수정"
                  >
                    <span style={{ fontSize: "10px" }}>f(x)</span>
                  </button>
                )}
                <button
                  className="btn-icon"
                  onClick={() => deleteColumn(col.id)}
                  title="열 삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Formula Editor Modal */}
      <Modal
        isOpen={!!editingColId}
        onClose={() => setEditingColId(null)}
        title="계산식 수정"
      >
        <div>
          <p style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>
            열 이름을 변수로 사용하세요. 지원 연산자: +, -, *, /, (, ).
            <br />
            예시: <code>(득점 * 2) + 도움</code>
          </p>
          <textarea
            className="glass-input"
            style={{
              width: "100%",
              minHeight: "100px",
              fontFamily: "monospace",
            }}
            value={editExpression}
            onChange={(e) => setEditExpression(e.target.value)}
          />
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {/* Quick insert buttons for columns */}
            {columns
              .filter((c) => c.id !== editingColId)
              .map((c) => (
                <button
                  key={c.id}
                  className="glass-panel"
                  style={{
                    padding: "4px 8px",
                    cursor: "pointer",
                    border: "none",
                    fontSize: "0.8rem",
                  }}
                  onClick={() => setEditExpression((prev) => prev + c.id)}
                >
                  {c.name}
                </button>
              ))}
          </div>
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button className="btn-primary" onClick={saveFormula}>
              저장
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
