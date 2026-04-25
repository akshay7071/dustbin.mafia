import * as tf from '@tensorflow/tfjs';

class AIPredictionService {
  constructor() {
    this.model = null;
    this.isInitialized = false;
  }

  // Initialize the AI model
  async initializeModel() {
    try {
      // Create a simple neural network for fill level prediction
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [6], units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 16, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 8, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });

      // Compile the model
      this.model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError',
        metrics: ['mae']
      });

      this.isInitialized = true;
      console.log('AI Model initialized successfully');
    } catch (error) {
      console.error('Error initializing AI model:', error);
    }
  }

  // Train the model with historical data
  async trainModel(trainingData) {
    if (!this.isInitialized) {
      await this.initializeModel();
    }

    try {
      // Prepare training data
      const features = trainingData.map(data => [
        data.currentFillLevel,
        data.dayOfWeek,
        data.hourOfDay,
        data.temperature,
        data.isHoliday,
        data.isWeekend
      ]);

      const labels = trainingData.map(data => data.nextFillLevel);

      // Convert to tensors
      const xs = tf.tensor2d(features);
      const ys = tf.tensor2d(labels, [labels.length, 1]);

      // Train the model
      await this.model.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        shuffle: true
      });

      console.log('Model training completed');
    } catch (error) {
      console.error('Error training model:', error);
    }
  }

  // Predict next fill level for a bin
  async predictNextFillLevel(binData) {
    if (!this.isInitialized) {
      await this.initializeModel();
    }

    try {
      const now = new Date();
      const features = [
        binData.fillLevel || 0,
        now.getDay(), // 0-6 (Sunday-Saturday)
        now.getHours(), // 0-23
        binData.temperature || 20, // Default temperature
        binData.isHoliday ? 1 : 0,
        now.getDay() === 0 || now.getDay() === 6 ? 1 : 0 // Weekend
      ];

      // Convert to tensor and predict
      const inputTensor = tf.tensor2d([features]);
      const prediction = this.model.predict(inputTensor);
      const predictedValue = await prediction.data();

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      return predictedValue[0] * 100; // Convert to percentage
    } catch (error) {
      console.error('Error predicting fill level:', error);
      // Fallback to simple linear prediction
      return this.fallbackPrediction(binData);
    }
  }

  // Fallback prediction using simple linear regression
  fallbackPrediction(binData) {
    const currentFill = binData.fillLevel || 0;
    const hoursSinceLastUpdate = this.getHoursSinceLastUpdate(binData.lastUpdated);
    
    // Simple linear growth based on historical patterns
    const fillRate = 0.5; // 0.5% per hour average
    const predictedFill = Math.min(100, currentFill + (hoursSinceLastUpdate * fillRate));
    
    return predictedFill;
  }

  getHoursSinceLastUpdate(lastUpdated) {
    if (!lastUpdated) return 24; // Default to 24 hours
    
    const lastUpdate = new Date(lastUpdated);
    const now = new Date();
    const diffHours = (now - lastUpdate) / (1000 * 60 * 60);
    
    return Math.max(0, diffHours);
  }

  // Generate sample training data for demonstration
  generateSampleTrainingData() {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 1000; i++) {
      const randomHours = Math.random() * 168; // Up to 1 week
      const randomDay = Math.floor(Math.random() * 7);
      const randomHour = Math.floor(Math.random() * 24);
      const isHoliday = Math.random() > 0.9;
      const isWeekend = randomDay === 0 || randomDay === 6;
      
      // Simulate fill level patterns
      let baseFill = Math.random() * 50;
      if (isWeekend) baseFill *= 0.7; // Less fill on weekends
      if (isHoliday) baseFill *= 0.5; // Less fill on holidays
      if (randomHour >= 18 || randomHour <= 6) baseFill *= 0.8; // Less fill at night
      
      const currentFill = Math.min(100, baseFill + randomHours * 0.5);
      const nextFill = Math.min(100, currentFill + Math.random() * 10);
      
      data.push({
        currentFillLevel: currentFill / 100,
        dayOfWeek: randomDay,
        hourOfDay: randomHour,
        temperature: 15 + Math.random() * 20, // 15-35°C
        isHoliday: isHoliday ? 1 : 0,
        isWeekend: isWeekend ? 1 : 0,
        nextFillLevel: nextFill / 100
      });
    }
    
    return data;
  }
}

export default new AIPredictionService();
