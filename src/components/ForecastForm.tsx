import React, { useState } from "react";
import {
  fetchForecast,
  WaterLevelInput,
  ForecastResult,
} from "../api/fetchForecast";

export const ForecastForm: React.FC = () => {
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    const input: WaterLevelInput = {
      columns: ["Lokasi", "TimeStamp", "WaterLevel"],
      data: [
        ["Bendung Katulampa", "20/04/2025 00:00", 30],
        ["Bendung Katulampa", "20/04/2025 01:00", 30],
      ],
    };

    try {
      setLoading(true);
      const res = await fetchForecast(input);
      setResult(res);
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Button */}
      <button
        onClick={handlePredict}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Fetch Forecast"}
      </button>

      {/* Temporary Display Section */}
      {result && (
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">Forecast Output</h2>

          {/* Raw JSON (temporary debug view) */}
          <div className="text-xs bg-white p-2 border rounded mb-4 overflow-x-auto">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>

          {/* Optional: Render structured data if response format is known */}
          {Array.isArray(result.forecast) && (
            <table className="min-w-full table-auto text-sm border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border">Timestamp</th>
                  <th className="px-4 py-2 border">Predicted Level</th>
                </tr>
              </thead>
              <tbody>
                {result.forecast.map((item: any, index: number) => (
                  <tr key={index} className="bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border">{item.timestamp}</td>
                    <td className="px-4 py-2 border">{item.predictedLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
