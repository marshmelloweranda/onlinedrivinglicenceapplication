Instructions to run the app:

1. Create a client ID using http://localhost:8088/v1/esignet/client-mgmt/client. Use the public key generated from https://mkjwk.org/, and update the clientid in env-config.js in the frontend.
2. Add the corresponding private key to config.js in the backend.
3. Create a mock user ID using the endpoint: http://localhost:8082/v1/mock-identity-system/identity.