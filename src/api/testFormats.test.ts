import { fetchForecast, WaterLevelInput } from './fetchForecast';

describe('AzureML Input Format Test', () => {
  it('should test input formats', async () => {
    // Format 1: Simple format from ForecastForm
    const simpleInput: WaterLevelInput = {
      columns: ["Lokasi", "TimeStamp", "WaterLevel"],
      data: [
        ["Bendung Katulampa", "20/04/2025 00:00", 30],
        ["Bendung Katulampa", "20/04/2025 01:00", 30],
      ]
    };

    // Format 2: Comprehensive format
    const comprehensiveInput: WaterLevelInput = {
      columns: [
        'datetime',
        'water_level',
        'rainfall',
        'temperature',
        'humidity'
      ],
      data: [
        ['2024-03-20T12:00:00', 1.5, 0.0, 25.5, 80],
        ['2024-03-20T13:00:00', 1.6, 0.2, 26.0, 82],
        ['2024-03-20T14:00:00', 1.7, 0.1, 26.2, 81]
      ]
    };

    // Format 3: Standard AzureML format
    const standardInput: WaterLevelInput = {
      columns: ['timestamp', 'location', 'water_level'],
      data: [
        ['2024-03-20T12:00:00', 'Bendung Katulampa', 30.0],
        ['2024-03-20T13:00:00', 'Bendung Katulampa', 31.5],
      ]
    };

    console.log('\nTesting Simple Format:');
    try {
      const simpleResult = await fetchForecast(simpleInput);
      console.log('✅ Simple format succeeded:', JSON.stringify(simpleResult, null, 2));
    } catch (error: any) {
      console.log('❌ Simple format failed:', error.message);
    }

    console.log('\nTesting Comprehensive Format:');
    try {
      const comprehensiveResult = await fetchForecast(comprehensiveInput);
      console.log('✅ Comprehensive format succeeded:', JSON.stringify(comprehensiveResult, null, 2));
    } catch (error: any) {
      console.log('❌ Comprehensive format failed:', error.message);
    }

    console.log('\nTesting Standard AzureML Format:');
    try {
      const standardResult = await fetchForecast(standardInput);
      console.log('✅ Standard format succeeded:', JSON.stringify(standardResult, null, 2));
    } catch (error: any) {
      console.log('❌ Standard format failed:', error.message);
    }
  });

  it('should test AutoML time series format', async () => {
    // AutoML time series format
    const timeSeriesInput: WaterLevelInput = {
      columns: ['timeStamp', 'curah_hujan'],  // Using standard AutoML column names
      data: [
        ['2024-03-20T00:00:00.000Z', 30.0],
        ['2024-03-20T01:00:00.000Z', 31.5],
        ['2024-03-20T02:00:00.000Z', 32.0],
        ['2024-03-20T03:00:00.000Z', 32.5],
        ['2024-03-20T04:00:00.000Z', 33.0],
        ['2024-03-20T05:00:00.000Z', 33.5],
      ].sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())  // Ensure chronological order
    };

    // Try with pandas DataFrame format
    const pandasStyleInput = {
      input_data: {
        data: timeSeriesInput.data,
        columns: timeSeriesInput.columns,
        index: timeSeriesInput.data.map(row => row[0]),  // Using timestamps as index
        type: 'dataframe'
      }
    };

    console.log('\nTesting AutoML Time Series Format:');
    try {
      const result = await fetchForecast(timeSeriesInput);
      console.log('✅ Time series format succeeded:', JSON.stringify(result, null, 2));
    } catch (error: any) {
      console.log('❌ Time series format failed:', error.message);
      console.log('Request details:', JSON.stringify(pandasStyleInput, null, 2));
    }
  });

  it('should test Azure AutoML 1.60.0 format', async () => {
    const timeSeriesInput: WaterLevelInput = {
      columns: ['timestamp', 'water_level', 'rainfall', 'temperature', 'humidity'],
      data: [
        ['2024-03-20T00:00:00Z', 30.0, 0.5, 25.0, 80.0],
        ['2024-03-20T01:00:00Z', 31.5, 0.0, 24.5, 82.0],
        ['2024-03-20T02:00:00Z', 32.0, 0.0, 24.0, 83.0],
        ['2024-03-20T03:00:00Z', 32.5, 0.2, 23.5, 85.0],
        ['2024-03-20T04:00:00Z', 33.0, 0.3, 23.0, 87.0],
        ['2024-03-20T05:00:00Z', 33.5, 0.1, 22.5, 88.0]
      ]
    };

    try {
      const result = await fetchForecast(timeSeriesInput);
      console.log('Forecast result:', result);
      expect(result).toBeDefined();
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });
}); 