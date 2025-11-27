#!/bin/bash

# Test script for Signup and Login API endpoints

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "Testing Energy Portal Auth API"
echo "=========================================="
echo ""

# Test 1: Test Supabase Connection
echo "1. Testing Supabase Connection..."
curl -s "$BASE_URL/api/auth/test" | jq '.'
echo ""
echo ""

# Test 2: Signup
echo "2. Testing Signup..."
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890"
  }')

echo "$SIGNUP_RESPONSE" | jq '.'
echo ""
echo ""

# Extract email from response for login test
TEST_EMAIL="test@example.com"
TEST_PASSWORD="testpassword123"

# Wait a moment
sleep 2

# Test 3: Login
echo "3. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "$LOGIN_RESPONSE" | jq '.'
echo ""
echo ""

# Test 4: Login with wrong password
echo "4. Testing Login with wrong password..."
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }' | jq '.'
echo ""
echo ""

echo "=========================================="
echo "Tests completed!"
echo "=========================================="

