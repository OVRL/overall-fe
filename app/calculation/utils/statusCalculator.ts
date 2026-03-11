import { evaluate } from "mathjs";
import type { Player, ColumnConfig } from "../types";

/**
 * Evaluates a formula expression for a given player.
 * @param expression The mathjs expression string (e.g., "Goals * 2 + Assists")
 * @param player The player object containing data
 * @param columns The list of all columns (to map names to IDs if needed, though we'll use names for now for simplicity)
 * @returns The calculated number or an error string
 */
// Custom FIFA-like OVR calculation function
// Maps a "Performance Score" to a 0-99 OVR with a rigorous curve.
// Sigmoid-like logic:
// - Base: ~40 (Even playing bad gives you something)
// - Average Good Performance (e.g., 10 pts) -> ~75
// - Great Performance (e.g., 20 pts) -> ~90
// - God-tier (e.g., 30+ pts) -> asymptotically approaches 99
const calculateOVR = (performanceScore: number) => {
  // Parameters for the curve
  const minOvr = 40;
  const maxOvr = 99;

  // Logistic function: L / (1 + e^(-k(x - x0)))
  // We adjust it to mapping [0, Infinity] -> [minOvr, maxOvr]
  // Let's use a simpler "Diminishing Returns" formula:
  // OVR = Max - (Max - Min) * Exp(-Score / Sensitivity)

  const sensitivity = 15; // Higher means harder to reach max.
  // 10 pts -> exp(-10/15) = 0.51 -> 40 + 59*(1-0.51) = 40 + 29 = 69
  // 20 pts -> exp(-20/15) = 0.26 -> 40 + 59*(1-0.26) = 40 + 43 = 83
  // 30 pts -> exp(-30/15) = 0.135 -> 40 + 59*(1-0.135) = 40 + 51 = 91
  // 40 pts -> exp(-40/15) = 0.07 -> 40 + 59*(0.93) = 95

  // Ensure score is non-negative for this formula
  const safeScore = Math.max(0, performanceScore);

  const result =
    maxOvr - (maxOvr - minOvr) * Math.exp(-safeScore / sensitivity);
  return Math.round(result);
};

export const evaluateFormula = (
  expression: string,
  player: Player,
  columns: ColumnConfig[],
): number | string => {
  try {
    // Create a scope with column names as keys and player values as values
    const scope: Record<string, any> = {};

    columns.forEach((col) => {
      // Use column name as key, but handle spaces/special chars if necessary
      // For simplicity in the formula, we'll assume users use the exact column name
      // or we might want to sanitize names for the scope.
      // Let's rely on exact names for now, maybe stripping spaces if we want to be fancy later.
      const value = player[col.id];
      // Configure ensure inputs are numbers for math
      const numValue = Number(value);
      scope[col.name] = isNaN(numValue) ? 0 : numValue;
      scope[col.id] = isNaN(numValue) ? 0 : numValue; // Also map ID for robustness
    });

    // Add custom OVR function to scope
    // User can use "fifa(score)" in their formula
    scope.fifa = calculateOVR;

    // Evaluate
    const result = evaluate(expression, scope);

    // Format result (e.g., round to 2 decimals)
    if (typeof result === "number") {
      return Math.round(result * 100) / 100;
    }
    return result;
  } catch (error) {
    console.warn(
      `Error evaluating expression "${expression}" for player ${player.name}:`,
      error,
    );
    return "Error";
  }
};
