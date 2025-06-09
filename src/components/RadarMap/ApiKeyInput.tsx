import React from "react";
import { Button } from "../ui/button";

interface ApiKeyInputProps {
  onApiKeySubmit: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const handleSubmit = () => {
    const input = document.querySelector(
      'input[placeholder="Enter OpenWeatherMap API Key"]'
    ) as HTMLInputElement;
    if (input?.value) {
      onApiKeySubmit(input.value);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-xl shadow-xl max-w-md">
        <h3 className="text-gray-900 font-semibold mb-4">
          OpenWeatherMap API Key Required
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Please enter your OpenWeatherMap API key to display the radar map. You
          can get one for free at{" "}
          <a
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            openweathermap.org
          </a>
        </p>
        <input
          type="text"
          placeholder="Enter OpenWeatherMap API Key"
          defaultValue="dcc7e2506c9716b7029e68bcfff4c121"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onApiKeySubmit((e.target as HTMLInputElement).value);
            }
          }}
        />
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Load Radar Map
        </Button>
      </div>
    </div>
  );
};
