# Mobile App API Documentation

Complete API documentation for integrating the Energy Portal with mobile applications (iOS/Android/React Native/Flutter).

## Base URL

```
Production: https://your-domain.vercel.app
Development: http://localhost:3000
```

## Authentication APIs

### 1. Login (Email & Password)

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "v1.MRjXzKmJhbGciOiJIUzI1NiIsInR5cCI6..."
  },
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

**Error Response (400):**
```json
{
  "error": "Email and password are required"
}
```

---

### 2. Sign Up (Register New User)

**Endpoint:** `POST /api/auth/signup`

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "secure-password",
  "name": "John Doe"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account created successfully. Please check your email to verify your account.",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newuser@example.com"
  }
}
```

---

### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Request:**
```json
{
  "refreshToken": "v1.MRjXzKmJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "v1.MRjXzKmJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

---

### 4. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Get Current User Profile

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## Data APIs (Require Authentication)

All data APIs require the `Authorization: Bearer {accessToken}` header.

### 6. Dashboard Overview

**Endpoint:** `GET /api/dashboard/overview`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "currentPower": 3.2,
    "solarProduction": 4.5,
    "batteryLevel": 65,
    "gridStatus": "exporting",
    "todayEnergy": {
      "consumption": 12.5,
      "production": 18.3,
      "cost": 2.45
    }
  }
}
```

---

### 7. Real-time Energy Data

**Endpoint:** `GET /api/energy/realtime`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-15T14:30:00Z",
    "solar": {
      "production": 4.5,
      "toHouse": 2.3,
      "toGrid": 1.2,
      "toBattery": 1.0
    },
    "battery": {
      "soc": 65,
      "power": 1.0,
      "capacity": 13.5
    },
    "grid": {
      "import": 0,
      "export": 1.2,
      "currentPrice": 0.28
    },
    "consumption": {
      "total": 3.2,
      "byRoom": {
        "Living Room": 0.8,
        "Kitchen": 1.2,
        "Bedroom": 0.3
      }
    }
  }
}
```

---

### 8. Devices List

**Endpoint:** `GET /api/devices`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "devices": [
    {
      "id": "solar-1",
      "name": "Solar Panels",
      "type": "solar",
      "status": "online",
      "power": 4500,
      "energy": 28.5
    },
    {
      "id": "battery-1",
      "name": "Home Battery",
      "type": "battery",
      "status": "online",
      "power": -1200,
      "energy": 8.5
    }
  ]
}
```

---

### 9. Weather Data

**Endpoint:** `GET /api/weather?lat={latitude}&lon={longitude}`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `lat`: Latitude (required)
- `lon`: Longitude (required)

**Success Response (200):**
```json
{
  "success": true,
  "weather": {
    "current": {
      "temp": 22,
      "condition": "Sunny",
      "humidity": 65,
      "windSpeed": 12
    },
    "forecast": [
      {
        "date": "2024-01-16",
        "temp_max": 25,
        "temp_min": 18,
        "condition": "Partly Cloudy"
      }
    ]
  }
}
```

---

## Mobile Integration Examples

### React Native / Expo

```javascript
// Login Example
const login = async (email, password) => {
  try {
    const response = await fetch('https://your-domain.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Store tokens securely
      await AsyncStorage.setItem('accessToken', data.session.accessToken);
      await AsyncStorage.setItem('refreshToken', data.session.refreshToken);
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Fetch Dashboard Data
const getDashboard = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  
  const response = await fetch('https://your-domain.vercel.app/api/dashboard/overview', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};
```

### Flutter / Dart

```dart
// Login Example
Future<Map<String, dynamic>> login(String email, String password) async {
  final response = await http.post(
    Uri.parse('https://your-domain.vercel.app/api/auth/login'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'email': email,
      'password': password,
    }),
  );

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    
    // Store tokens securely
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', data['session']['accessToken']);
    await prefs.setString('refreshToken', data['session']['refreshToken']);
    
    return data;
  } else {
    throw Exception('Login failed');
  }
}

// Fetch Dashboard Data
Future<Map<String, dynamic>> getDashboard() async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('accessToken');

  final response = await http.get(
    Uri.parse('https://your-domain.vercel.app/api/dashboard/overview'),
    headers: {
      'Authorization': 'Bearer $token',
    },
  );

  return jsonDecode(response.body);
}
```

### iOS (Swift)

```swift
// Login Example
func login(email: String, password: String, completion: @escaping (Result<LoginResponse, Error>) -> Void) {
    let url = URL(string: "https://your-domain.vercel.app/api/auth/login")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = ["email": email, "password": password]
    request.httpBody = try? JSONSerialization.data(withJSONObject: body)
    
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }
        
        guard let data = data else {
            completion(.failure(NSError(domain: "", code: -1)))
            return
        }
        
        do {
            let loginResponse = try JSONDecoder().decode(LoginResponse.self, from: data)
            // Store tokens in Keychain
            KeychainHelper.save(token: loginResponse.session.accessToken, key: "accessToken")
            completion(.success(loginResponse))
        } catch {
            completion(.failure(error))
        }
    }.resume()
}
```

### Android (Kotlin)

```kotlin
// Login Example
suspend fun login(email: String, password: String): LoginResponse {
    val client = OkHttpClient()
    val json = JSONObject().apply {
        put("email", email)
        put("password", password)
    }
    
    val body = json.toString().toRequestBody("application/json".toMediaType())
    val request = Request.Builder()
        .url("https://your-domain.vercel.app/api/auth/login")
        .post(body)
        .build()
    
    return withContext(Dispatchers.IO) {
        val response = client.newCall(request).execute()
        val responseData = response.body?.string()
        
        if (response.isSuccessful && responseData != null) {
            val gson = Gson()
            val loginResponse = gson.fromJson(responseData, LoginResponse::class.java)
            
            // Store tokens securely
            val sharedPref = context.getSharedPreferences("auth", Context.MODE_PRIVATE)
            sharedPref.edit().apply {
                putString("accessToken", loginResponse.session.accessToken)
                putString("refreshToken", loginResponse.session.refreshToken)
                apply()
            }
            
            loginResponse
        } else {
            throw Exception("Login failed")
        }
    }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing or invalid parameters |
| 401 | Unauthorized - Invalid credentials or expired token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Security Best Practices

1. **Store tokens securely:**
   - iOS: Use Keychain
   - Android: Use EncryptedSharedPreferences
   - React Native: Use react-native-keychain or expo-secure-store
   - Flutter: Use flutter_secure_storage

2. **Implement token refresh:**
   - Refresh access token before it expires
   - Handle 401 errors by refreshing token automatically

3. **Use HTTPS only** in production

4. **Implement proper error handling** for network failures

5. **Add request timeouts** to prevent hanging requests

---

## Rate Limiting

- Login attempts: 5 per minute per IP
- API requests: 100 per minute per user
- Exceeded limits return 429 (Too Many Requests)

---

## Support

For issues or questions:
- Email: support@your-domain.com
- Documentation: https://your-domain.com/docs
