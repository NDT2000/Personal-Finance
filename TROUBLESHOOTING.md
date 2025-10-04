# Troubleshooting Guide for Kaggle Integration

## Common Issues and Solutions

### 1. **"Unexpected token '<', "<!DOCTYPE "... is not valid JSON" Error**

This error occurs when the server returns HTML instead of JSON, usually indicating a server error.

#### **Solution:**
1. **Check if server is running:**
   ```bash
   npm run server
   ```
   The server should start on port 3001.

2. **Verify server health:**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"status":"Server is running","timestamp":"..."}`

3. **Check server logs:**
   Look for error messages in the server console.

### 2. **"File not found" Error**

The dataset file doesn't exist at the specified path.

#### **Solution:**
1. **Verify file exists:**
   ```bash
   ls datasets/sample-financial-data.csv
   ```

2. **Use correct file path:**
   - Sample dataset: `./datasets/sample-financial-data.csv`
   - Make sure the file is in the `datasets/` folder

3. **Check file permissions:**
   Ensure the file is readable by the Node.js process.

### 3. **"Cannot connect to server" Error**

The frontend cannot reach the backend server.

#### **Solution:**
1. **Start the server:**
   ```bash
   npm run server
   ```

2. **Check port availability:**
   Ensure port 3001 is not used by another process.

3. **Verify server URL:**
   The frontend should connect to `http://localhost:3001`

### 4. **"csv-parser module not found" Error**

The csv-parser dependency is missing.

#### **Solution:**
```bash
npm install csv-parser
```

### 5. **Training fails with "Insufficient data" Error**

The dataset doesn't have enough records for training.

#### **Solution:**
1. **Check dataset size:**
   Ensure the CSV has at least 5-10 records.

2. **Verify data format:**
   Check that all required columns are present.

3. **Use sample data:**
   Try training with the built-in sample data first.

## Step-by-Step Setup

### 1. **Install Dependencies:**
```bash
npm install csv-parser node-fetch
```

### 2. **Start the Server:**
```bash
npm run server
```
You should see:
```
🚀 Server running on port 3001
🔗 Connected to database
```

### 3. **Start the Frontend:**
```bash
npm run dev
```

### 4. **Test the Integration:**
1. Go to Dashboard → Model Training section
2. Click "Train with Sample Data" first
3. If successful, try "Train with Sample Dataset"

## Testing Commands

### **Test Server Endpoints:**
```bash
node test-server-endpoints.js
```

### **Test Kaggle Training:**
```bash
node test-kaggle-training.js
```

### **Test Regression Service:**
```bash
node test-regression.js
```

## Debugging Tips

### 1. **Check Browser Console:**
- Open Developer Tools (F12)
- Look for network errors in Console tab
- Check Network tab for failed requests

### 2. **Check Server Logs:**
- Look for error messages in the server console
- Check for import errors or missing dependencies

### 3. **Verify File Paths:**
- Ensure CSV files are in the correct location
- Use absolute paths if relative paths don't work

### 4. **Test Individual Components:**
```javascript
// Test dataset loading
const datasetLoader = await import('./src/services/datasetLoader.js')
const data = await datasetLoader.default.loadSampleFinancialDataset()

// Test model training
const modelTrainer = await import('./src/services/modelTrainer.js')
const result = await modelTrainer.default.trainWithSampleData()
```

## Common File Structure Issues

### **Incorrect File Structure:**
```
❌ Wrong:
Personal-Finance/
├── datasets/
│   └── sample-financial-data.csv
└── src/
    └── services/
        └── datasetLoader.js
```

### **Correct File Structure:**
```
✅ Correct:
Personal-Finance/
├── datasets/
│   └── sample-financial-data.csv
├── src/
│   └── services/
│       └── datasetLoader.js
├── server.js
└── package.json
```

## Performance Issues

### **Large Dataset Handling:**
1. **Memory Issues:**
   - Use streaming for large CSV files
   - Process data in chunks

2. **Training Time:**
   - Start with smaller datasets
   - Use fewer algorithms for testing

3. **Server Timeout:**
   - Increase timeout settings
   - Process data asynchronously

## Getting Help

### **Check Logs:**
1. **Server logs:** Look in the terminal where you ran `npm run server`
2. **Browser logs:** Check Developer Tools Console
3. **Network logs:** Check Developer Tools Network tab

### **Verify Setup:**
1. **Dependencies:** `npm list csv-parser node-fetch`
2. **Server status:** `curl http://localhost:3001/api/health`
3. **File existence:** `ls datasets/sample-financial-data.csv`

### **Reset Everything:**
```bash
# Stop server (Ctrl+C)
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run server
```

## Expected Behavior

### **Successful Training:**
1. **Status:** Changes from "idle" → "training" → "completed"
2. **Results:** Shows training metrics and model performance
3. **History:** Adds entry to training history
4. **No Errors:** No error messages displayed

### **Failed Training:**
1. **Status:** Changes from "idle" → "training" → "error"
2. **Error Message:** Clear description of what went wrong
3. **Debug Info:** Console logs show detailed error information

If you're still experiencing issues, check the server logs and browser console for specific error messages, then refer to this guide for the appropriate solution.
