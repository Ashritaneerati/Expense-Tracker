import * as tf from '@tensorflow/tfjs';

export class ExpensePredictor {
  private model: tf.LayersModel | null = null;
  private readonly lookback = 7; // Number of days to look back for prediction

  async initialize() {
    // Create a simple LSTM model for time series prediction
    this.model = tf.sequential({
      layers: [
        tf.layers.lstm({
          units: 32,
          inputShape: [this.lookback, 1],
          returnSequences: false
        }),
        tf.layers.dense({ units: 1 })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });
  }

  async trainModel(expenses: { amount: number; date: string }[]) {
    if (!this.model || expenses.length < this.lookback) return;

    // Prepare data
    const data = expenses
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(e => e.amount);

    // Create sequences
    const sequences = [];
    const labels = [];
    
    for (let i = 0; i < data.length - this.lookback; i++) {
      sequences.push(data.slice(i, i + this.lookback));
      labels.push(data[i + this.lookback]);
    }

    if (sequences.length === 0) return;

    // Convert to tensors
    const xs = tf.tensor3d(sequences, [sequences.length, this.lookback, 1]);
    const ys = tf.tensor2d(labels, [labels.length, 1]);

    // Train the model
    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      shuffle: true
    });

    // Clean up tensors
    xs.dispose();
    ys.dispose();
  }

  async predictNextExpense(recentExpenses: { amount: number; date: string }[]) {
    if (!this.model || recentExpenses.length < this.lookback) return null;

    // Prepare input data
    const data = recentExpenses
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(e => e.amount)
      .slice(-this.lookback);

    // Make prediction
    const input = tf.tensor3d([data], [1, this.lookback, 1]);
    const prediction = this.model.predict(input) as tf.Tensor;
    const result = await prediction.data();

    // Clean up tensors
    input.dispose();
    prediction.dispose();

    return result[0];
  }

  async detectAnomaly(amount: number, recentExpenses: { amount: number; date: string }[]) {
    if (recentExpenses.length < 2) return false;

    const amounts = recentExpenses.map(e => e.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(
      amounts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / amounts.length
    );

    // Consider it an anomaly if it's more than 2 standard deviations from the mean
    return Math.abs(amount - mean) > stdDev * 2;
  }
}