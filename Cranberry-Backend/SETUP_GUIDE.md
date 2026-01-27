# Cranberry Marketplace Backend - Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Java 17 or higher** - [Download](https://adoptium.net/)
- **Maven 3.8+** - [Download](https://maven.apache.org/download.cgi)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Ollama** - [Download](https://ollama.ai/)

## Quick Start

### 1. Clone & Setup Environment

```bash
cd /path/to/Cranberry-Backend

# Copy environment variables
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your configurations:

```env
# Database Configuration
DB_USERNAME=root
DB_PASSWORD=your_database_password

# JWT Configuration (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRATION=86400000

# Razorpay Configuration
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# AI Configuration (Ollama Local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### 3. Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE cranberry_db;

# Verify
SHOW DATABASES;

# Exit
exit;
```

### 4. Setup Ollama (Local AI)

```bash
# Install Ollama from https://ollama.ai
# For macOS:
brew install ollama

# For Linux:
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the llama3.2 model
ollama pull llama3.2

# Verify Ollama is running
curl http://localhost:11434/api/tags
```

**Expected Output:**
```json
{
  "models": [
    {
      "name": "llama3.2:latest",
      ...
    }
  ]
}
```

### 5. Build & Run the Backend

```bash
# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

**Expected Output:**
```
...
Started CranberryApplication in X.XXX seconds
```

The backend will be running at: `http://localhost:8080`

## Verification

### Check Backend Health

```bash
# Test basic endpoint
curl http://localhost:8080/api/products

# Test AI health
curl http://localhost:8080/api/ai/health
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "ollama_available": true,
    "status": "healthy",
    "message": "Ollama is running and accessible"
  }
}
```

### Test Registration

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Project Structure

```
Cranberry-Backend/
├── src/
│   └── main/
│       ├── java/com/cranberry/marketplace/
│       │   ├── CranberryApplication.java
│       │   ├── ai/                    # AI Integration (Ollama)
│       │   │   ├── AiController.java
│       │   │   ├── AiProviderClient.java
│       │   │   └── RecommendationService.java
│       │   ├── config/                # Configuration
│       │   │   ├── CorsConfig.java
│       │   │   ├── OllamaConfig.java
│       │   │   ├── SecurityConfig.java
│       │   │   └── JwtConfig.java
│       │   ├── controller/            # REST Controllers
│       │   │   ├── AuthController.java
│       │   │   ├── ProductController.java
│       │   │   ├── OrderController.java
│       │   │   ├── PaymentController.java
│       │   │   └── VendorController.java
│       │   ├── dto/                   # Data Transfer Objects
│       │   ├── exception/             # Exception Handling
│       │   ├── model/                 # JPA Entities
│       │   ├── repository/            # Data Repositories
│       │   ├── security/              # JWT Security
│       │   └── service/               # Business Logic
│       └── resources/
│           ├── application.yml
│           ├── application-dev.yml
│           └── application-prod.yml
├── pom.xml
├── .env.example
├── .env
├── README.md
└── API_DOCUMENTATION.md
```

## Configuration Files

### application.yml

Main configuration file that uses environment variables:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cranberry_db
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

ai:
  provider: ollama
  ollama:
    baseUrl: ${OLLAMA_BASE_URL:http://localhost:11434}
    model: ${OLLAMA_MODEL:llama3.2}
    timeout: 60000

jwt:
  secret: ${JWT_SECRET:default-secret}
  expiration: ${JWT_EXPIRATION:86400000}

razorpay:
  key: ${RAZORPAY_KEY:your_key}
  secret: ${RAZORPAY_SECRET:your_secret}
```

## Common Issues & Solutions

### Issue 1: Database Connection Failed

**Error:** `Communications link failure`

**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list  # macOS

# Start MySQL
sudo systemctl start mysql  # Linux
brew services start mysql  # macOS

# Verify credentials in .env
DB_USERNAME=root
DB_PASSWORD=your_actual_password
```

### Issue 2: Ollama Not Available

**Error:** `Ollama is not available`

**Solution:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start Ollama
ollama serve

# Pull the model if not present
ollama pull llama3.2

# Verify model is available
ollama list
```

### Issue 3: Port 8080 Already in Use

**Error:** `Port 8080 is already in use`

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8081
```

### Issue 4: JWT Token Invalid

**Error:** `Invalid or expired token`

**Solution:**
- Ensure JWT_SECRET is at least 32 characters
- Token expires after 24 hours by default
- Check Authorization header format: `Bearer <token>`

### Issue 5: CORS Errors

**Error:** `No 'Access-Control-Allow-Origin' header`

**Solution:**
- Frontend URL is whitelisted in `CorsConfig.java`
- Default allowed origins: localhost:3000, localhost:5173
- Add your frontend URL if different

## Development Tips

### Hot Reload

For development, use Spring DevTools:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### View Logs

```bash
# Follow logs in real-time
tail -f logs/spring-boot-logger.log

# Or view in terminal
mvn spring-boot:run
```

### Database Debugging

```bash
# Connect to MySQL
mysql -u root -p cranberry_db

# View tables
SHOW TABLES;

# Check users
SELECT * FROM users;

# Check products
SELECT * FROM product;
```

## API Testing

### Using cURL

```bash
# Health check
curl http://localhost:8080/api/ai/health

# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'
```

### Using Postman

1. Import the API endpoints from `API_DOCUMENTATION.md`
2. Set base URL: `http://localhost:8080/api`
3. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer <your_token>`

## Production Deployment

### 1. Build JAR

```bash
mvn clean package -DskipTests
```

The JAR will be in `target/marketplace-0.0.1-SNAPSHOT.jar`

### 2. Run JAR

```bash
java -jar target/marketplace-0.0.1-SNAPSHOT.jar
```

### 3. Environment Configuration

For production:
- Use `application-prod.yml`
- Set strong JWT_SECRET
- Configure production database
- Enable HTTPS
- Set appropriate CORS origins

```bash
java -jar -Dspring.profiles.active=prod target/marketplace-0.0.1-SNAPSHOT.jar
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Restrict CORS to your frontend domain
- [ ] Keep dependencies updated
- [ ] Never commit .env file
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Implement proper logging
- [ ] Regular security audits

## Performance Optimization

### Database Indexing

```sql
-- Add indexes for better query performance
CREATE INDEX idx_product_category ON product(category);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_user ON orders(user_id);
```

### Ollama Performance

- Keep Ollama model loaded in memory
- Use faster models for quick responses (llama3.2 is good)
- Consider caching AI responses for common queries

## Support & Documentation

- **API Documentation**: See `API_DOCUMENTATION.md`
- **README**: See `README.md`
- **GitHub Issues**: Report bugs and feature requests

## Next Steps

1. ✅ Backend is running on `http://localhost:8080`
2. ✅ Ollama AI is configured locally
3. ✅ Database is set up
4. 🔄 Integrate with your frontend
5. 🔄 Add seed data for testing
6. 🔄 Configure Razorpay for payments
7. 🔄 Deploy to production

## Frontend Integration

Your backend is now ready for frontend integration! 

Key endpoints for frontend:
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/products` - Get all products
- `/api/orders` - Create/view orders
- `/api/payments/create/{orderId}` - Initiate payment
- `/api/ai/search` - AI-powered search
- `/api/ai/recommend/{userId}` - Get recommendations

See `API_DOCUMENTATION.md` for complete API reference with examples.

---

**Note**: This backend uses Ollama running locally, NOT cloud APIs. Make sure Ollama is installed and running on your machine.
