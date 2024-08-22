import dotenv from "dotenv";
import server from "./settings";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startApplication() {
  try {
    server.listen(PORT, () =>
      console.log(`Application started on port ${PORT}`)
    );
  } catch (error) {
    console.log("Error while starting: ", error);
  }
}

startApplication();
