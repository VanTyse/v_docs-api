//initializing express
require("express-async-errors");
const express = require("express");
const app = express();

//creating the express server using http.createServer
const { createServer } = require("http");
const server = createServer(app);

//adding socket.io to the already created server
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    // origin: ["https://vantyse-docs.netlify.app", "http://localhost:3000"],
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//other initializations
require("dotenv").config();
const mongoose = require("mongoose");
const Document = require("./models/document");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");

//connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("DB connected successfully"));

app.use(express.json());
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/documents/", documentRoutes);
app.use((err, req, res, next) => {
  console.log(err);
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  } else {
    return res.status(500).json({ message: err.message });
  }
});

//function to find or create new document in db
const findOrCreateDocument = async (documentID, userID, documentName) => {
  if (documentID == null) return;
  const document = await Document.findOne({ documentID });
  if (document) return document;
  return await Document.create({
    documentID,
    creator: userID,
    documentName,
    data: "",
  });
};

//function to check if user can edit document
const canEdit = ({ userID, creator, collaborators }) => {
  if (userID == null) return false;
  return creator.equals(userID) || collaborators.includes(userID);
};

//initialize socket connection
io.on("connection", (socket) => {
  socket.on("get-document", async (documentID, userID, documentName) => {
    const document = await findOrCreateDocument(
      documentID,
      userID,
      documentName
    );
    const { data, collaborators, creator, documentName: name } = document;
    const canUserEdit = canEdit({ userID, creator, collaborators });

    //In the future I might decide to add a condition to join so that unauthorized users can't
    // subscribe to changes in real time
    socket.join(documentID);
    socket.emit("load-document", data, canUserEdit, name);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentID).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findOneAndUpdate({ documentID }, { data });
    });
  });
});

//start server and define port to listen on
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`server connected to port ${PORT}`);
});
