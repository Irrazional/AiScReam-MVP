import { fetchForecast, WaterLevelInput } from './fetchForecast';

describe('fetchForecast', () => {
  it('should successfully fetch forecast data', async () => {
    // Sample input data
    const testInput: WaterLevelInput = {
      columns: ['timestamp', 'water_level'],
      data: [
        ['2024-03-20T12:00:00', 1.5],
        ['2024-03-20T13:00:00', 1.6],
        ['2024-03-20T14:00:00', 1.7]
      ]
    };

    try {
      const result = await fetchForecast(testInput);
      console.log('API Response:', result);
      expect(result).toBeDefined();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  });
}); 