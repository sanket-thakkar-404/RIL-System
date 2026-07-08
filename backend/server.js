import app from "./src/app.js"
import http from "http"
import config from "./src/config/dotenv.config.js"
import connectDB from "./src/config/database.config.js"

connectDB()

const server = http.createServer(app)



server.listen(config.PORT, () => {
  console.log(`server is running in the Port :`, config.PORT)
})

