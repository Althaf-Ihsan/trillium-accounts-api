import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); 

export const checkAuthorization = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];
    try {
      // Validate the token using Keycloak's token introspection endpoint
      const response = await axios.post(
        `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM_NAME}/protocol/openid-connect/token/introspect`,
        new URLSearchParams({
          token,
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // Check if the token is active
      const { active } = response.data;
      if (!active) {
        return res.status(403).json({
          error: "Access denied: Invalid or insufficient permissions",
        });
      }

      // Attach the decoded token information to the request object
      req.user = response.data; // Contains token information, e.g., user roles, client_id
      next();
    } catch (error) {
      console.error("Token validation error:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  };
};
