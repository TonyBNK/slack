import dotenv from "dotenv";
import app from "./settings";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startApplication() {
  try {
    app.listen(PORT, () => console.log(`Application started on port ${PORT}`));
  } catch (error) {
    console.log("Error while starting: ", error);
  }
}

startApplication();
