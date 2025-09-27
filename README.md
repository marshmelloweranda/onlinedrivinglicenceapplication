Instructions to run the app:

1. Create a client ID using http://localhost:8088/v1/esignet/client-mgmt/client. Use the public key generated from https://mkjwk.org/, and update the clientid in env-config.js in the frontend.
2. Add the corresponding private key to config.js in the backend.
3. Create a mock user ID using the endpoint: http://localhost:8082/v1/mock-identity-system/identity.


payment paylod

//initiate payment

curl -X POST http://localhost:8888/api/initiate-payment \
  -H "Content-Type: application/json" \
  -d '{
    "userInfo": {
      "sub": "s8-VG8_0sbZMmhKXB7qHS8L9yzlwTD2wvuY08p6kZsM",
      "nic": "199012345V",
      "name": "Siddharth K Mansour"
    },
    "medicalCertificate": {
      "certificateId": "MC-12345"
    },
    "selectedCategories": ["A1", "B"],
    "paymentDetails": {
      "totalAmount": 4000
    }
  }'

// confirm-payment

curl -X POST http://localhost:8888/api/confirm-payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentReferenceId": "PAY-1758711796824",
    "paymentSuccess": true,
    "transactionId": "TXN-123456"
  }'

