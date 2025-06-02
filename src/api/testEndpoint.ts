import { fetchForecast, WaterLevelInput } from './fetchForecast';

async function testEndpoint() {
  // Format 1: Simple format from ForecastForm
  const simpleInput: WaterLevelInput = {
    columns: ["Lokasi", "TimeStamp", "WaterLevel"],
    data: [
      ["Bendung Katulampa", "20/04/2025 00:00", 30],
      ["Bendung Katulampa", "20/04/2025 01:00", 30],
    ]
  };

  // Format 2: Comprehensive format from test file
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

  console.log('Testing Simple Format:');
  try {
    const simpleResult = await fetchForecast(simpleInput);
    console.log('✅ Simple format succeeded:', JSON.stringify(simpleResult, null, 2));
  } catch (error) {
    console.log('❌ Simple format failed:', error.message);
  }

  console.log('\nTesting Comprehensive Format:');
  try {
    const comprehensiveResult = await fetchForecast(comprehensiveInput);
    console.log('✅ Comprehensive format succeeded:', JSON.stringify(comprehensiveResult, null, 2));
  } catch (error) {
    console.log('❌ Comprehensive format failed:', error.message);
  }
}

// Run the test
testEndpoint().catch(console.error); 