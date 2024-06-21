import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const KEYCLOAK_URL = process.env.KEYCLOAK_BASE_URL;
const KEYCLOAK_REALM_NAME = process.env.KEYCLOAK_REALM_NAME;



export const getToken = async (username, password) => {
  const tokenConfig = {
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET || "default-secret",
    grant_type: process.env.KEYCLOAK_GRANT_TYPE,
    username,
    password,
    scope: process.env.KEYCLOAK_SCOPE,
  };

  try {
    const { data } = await axios.post(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM_NAME}/protocol/openid-connect/token`,
      new URLSearchParams(tokenConfig),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Keycloak Error: ${
          error.response.data.error_description || error.message
        }`
      );
    } else {
      throw new Error(`Failed to retrieve user token: ${error.message}`);
    }
  }
};
