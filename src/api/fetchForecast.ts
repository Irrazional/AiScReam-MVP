export interface WaterLevelInput {
  columns: string[];
  data: (string | number)[][];
}

export interface ForecastResult {
  [key: string]: any; // You can make this more specific if you know the response format
}

export async function fetchForecast(input: WaterLevelInput): Promise<ForecastResult> {
  const endpoint = "https://floodreport-uadds.eastus2.inference.ml.azure.com/score";
  const apiKey = "3OhaizlX5FRT7NFQyLA4XnE78bL1dqc7f04vGMxEl1QMCo4IXsPjJQQJ99BFAAAAAAAAAAAAINFRAZML4PYn";

  // Format data according to Azure AutoML 1.60.0 expectations
  const requestBody = {
    input_data: {
      columns: input.columns,
      index: Array.from({ length: input.data.length }, (_, i) => i),
      data: input.data
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'azureml-model-deployment': 'floodreport-uadds'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Azure ML API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Azure ML endpoint:', error);
    throw error;
  }
}
