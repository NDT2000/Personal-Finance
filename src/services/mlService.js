// JavaScript-based ML service for expense categorization
// No Python dependencies - pure JavaScript implementation

class MLService {
  constructor() {
    // Define expense categories
    this.categories = [
      'housing', 'food', 'transportation', 'utilities', 
      'healthcare', 'entertainment', 'shopping', 'other'
    ];
    
    // Create keyword patterns for each category
    this.patterns = {
      housing: [
        'rent', 'mortgage', 'apartment', 'house', 'landlord', 'lease',
        'property', 'real estate', 'housing', 'accommodation', 'home',
        'condo', 'townhouse', 'duplex', 'studio'
      ],
      food: [
        'restaurant', 'food', 'grocery', 'supermarket', 'dining', 'cafe',
        'coffee', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger',
        'mcdonalds', 'starbucks', 'subway', 'kfc', 'dominos', 'chipotle',
        'panda express', 'taco bell', 'wendys', 'burger king', 'pizza hut',
        'sushi', 'chinese', 'mexican', 'italian', 'thai', 'indian'
      ],
      transportation: [
        'gas', 'fuel', 'gasoline', 'uber', 'lyft', 'taxi', 'bus',
        'train', 'metro', 'subway', 'parking', 'toll', 'car',
        'vehicle', 'transport', 'commute', 'ride', 'airline', 'flight',
        'rental car', 'zipcar', 'bike', 'scooter', 'public transport'
      ],
      utilities: [
        'electric', 'electricity', 'water', 'internet', 'phone',
        'cable', 'utility', 'power', 'gas bill', 'wifi',
        'telecom', 'broadband', 'mobile', 'cell phone', 'landline',
        'sewer', 'trash', 'garbage', 'heating', 'cooling'
      ],
      healthcare: [
        'doctor', 'hospital', 'medical', 'pharmacy', 'drug',
        'medicine', 'health', 'clinic', 'dentist', 'therapy',
        'insurance', 'prescription', 'cvs', 'walgreens', 'rite aid',
        'urgent care', 'emergency', 'surgery', 'xray', 'lab'
      ],
      entertainment: [
        'movie', 'cinema', 'netflix', 'spotify', 'subscription',
        'game', 'entertainment', 'theater', 'concert', 'show',
        'amazon prime', 'hulu', 'disney', 'youtube', 'twitch',
        'gaming', 'sports', 'fitness', 'gym', 'yoga'
      ],
      shopping: [
        'amazon', 'walmart', 'target', 'store', 'shop', 'mall',
        'clothes', 'fashion', 'retail', 'purchase', 'buy',
        'ebay', 'etsy', 'online', 'shopping', 'costco', 'sams club',
        'best buy', 'home depot', 'lowes', 'nike', 'adidas'
      ]
    };
    
    // Initialize with synthetic training data
    this.trainingData = this.generateSyntheticData();
  }
  
  // Generate synthetic training data
  generateSyntheticData() {
    const syntheticData = [
      // Housing examples
      { description: 'Monthly rent payment', category: 'housing' },
      { description: 'Mortgage payment', category: 'housing' },
      { description: 'Apartment rent', category: 'housing' },
      { description: 'Property tax', category: 'housing' },
      { description: 'Home insurance', category: 'housing' },
      { description: 'Landlord payment', category: 'housing' },
      { description: 'Housing association fee', category: 'housing' },
      
      // Food examples
      { description: 'Grocery shopping at Walmart', category: 'food' },
      { description: 'Dinner at restaurant', category: 'food' },
      { description: 'Coffee at Starbucks', category: 'food' },
      { description: 'Lunch at McDonald\'s', category: 'food' },
      { description: 'Pizza delivery', category: 'food' },
      { description: 'Breakfast at diner', category: 'food' },
      { description: 'Supermarket groceries', category: 'food' },
      { description: 'Chipotle burrito', category: 'food' },
      { description: 'Subway sandwich', category: 'food' },
      
      // Transportation examples
      { description: 'Gas station fill up', category: 'transportation' },
      { description: 'Uber ride to airport', category: 'transportation' },
      { description: 'Parking fee', category: 'transportation' },
      { description: 'Bus ticket', category: 'transportation' },
      { description: 'Train fare', category: 'transportation' },
      { description: 'Car maintenance', category: 'transportation' },
      { description: 'Lyft ride', category: 'transportation' },
      { description: 'Airline ticket', category: 'transportation' },
      
      // Utilities examples
      { description: 'Electric bill', category: 'utilities' },
      { description: 'Internet service', category: 'utilities' },
      { description: 'Phone bill', category: 'utilities' },
      { description: 'Water bill', category: 'utilities' },
      { description: 'Cable TV', category: 'utilities' },
      { description: 'Gas utility bill', category: 'utilities' },
      { description: 'Mobile phone plan', category: 'utilities' },
      
      // Healthcare examples
      { description: 'Doctor visit', category: 'healthcare' },
      { description: 'Pharmacy prescription', category: 'healthcare' },
      { description: 'Dental checkup', category: 'healthcare' },
      { description: 'Medical insurance', category: 'healthcare' },
      { description: 'Hospital bill', category: 'healthcare' },
      { description: 'CVS pharmacy', category: 'healthcare' },
      { description: 'Walgreens prescription', category: 'healthcare' },
      
      // Entertainment examples
      { description: 'Netflix subscription', category: 'entertainment' },
      { description: 'Movie tickets', category: 'entertainment' },
      { description: 'Spotify premium', category: 'entertainment' },
      { description: 'Video game purchase', category: 'entertainment' },
      { description: 'Concert tickets', category: 'entertainment' },
      { description: 'Amazon Prime subscription', category: 'entertainment' },
      { description: 'Gym membership', category: 'entertainment' },
      { description: 'Theater show', category: 'entertainment' },
      
      // Shopping examples
      { description: 'Amazon purchase', category: 'shopping' },
      { description: 'Clothing at Target', category: 'shopping' },
      { description: 'Online shopping', category: 'shopping' },
      { description: 'Electronics store', category: 'shopping' },
      { description: 'Bookstore', category: 'shopping' },
      { description: 'Costco membership', category: 'shopping' },
      { description: 'Best Buy electronics', category: 'shopping' },
      { description: 'Nike shoes', category: 'shopping' }
    ];
    
    return syntheticData;
  }
  
  // Calculate TF-IDF-like score for each category
  calculateTFIDF(description, category) {
    const words = description.toLowerCase().split(/\s+/);
    const categoryPatterns = this.patterns[category] || [];
    
    let score = 0;
    let totalWords = words.length;
    
    // Count pattern matches
    words.forEach(word => {
      categoryPatterns.forEach(pattern => {
        if (word.includes(pattern) || pattern.includes(word)) {
          score += 1;
        }
      });
    });
    
    return totalWords > 0 ? score / totalWords : 0;
  }
  
  // Predict category with confidence score
  predictCategory(description) {
    const scores = {};
    let maxScore = 0;
    let predictedCategory = 'other';
    
    this.categories.forEach(category => {
      const score = this.calculateTFIDF(description, category);
      scores[category] = score;
      
      if (score > maxScore) {
        maxScore = score;
        predictedCategory = category;
      }
    });
    
    // Calculate confidence (normalize between 0 and 1)
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const confidence = totalScore > 0 ? maxScore / totalScore : 0.1;
    
    return {
      category: predictedCategory,
      confidence: Math.min(confidence, 0.95), // Cap at 95%
      scores: scores
    };
  }
  
  // Batch prediction for multiple descriptions
  predictBatch(descriptions) {
    return descriptions.map(desc => this.predictCategory(desc));
  }
  
  // Get confidence threshold for manual review
  needsManualReview(confidence) {
    return confidence < 0.7; // 70% threshold
  }
  
  // Add new training data
  addTrainingData(description, category) {
    this.trainingData.push({ description, category });
  }
  
  // Get model performance metrics
  getModelInfo() {
    return {
      categories: this.categories,
      trainingDataSize: this.trainingData.length,
      patterns: Object.keys(this.patterns).length,
      version: '1.0.0',
      confidenceThreshold: 0.7
    };
  }
  
  // Test the model with sample data
  testModel() {
    const testCases = [
      'Coffee at Starbucks',
      'Gas station fill up',
      'Netflix subscription',
      'Grocery shopping at Walmart',
      'Doctor visit',
      'Amazon purchase',
      'Electric bill payment',
      'Uber ride to airport'
    ];
    
    console.log('🧪 Testing ML Model:');
    testCases.forEach(description => {
      const prediction = this.predictCategory(description);
      console.log(`${description}: ${prediction.category} (${Math.round(prediction.confidence * 100)}%)`);
    });
    
    return testCases.map(desc => this.predictCategory(desc));
  }
}

// Export singleton instance
export default new MLService();
