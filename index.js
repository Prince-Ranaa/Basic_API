const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const studentModel = mongoose.model("studentsData", studentSchema);

const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const data = await studentModel.find();
  res.send(data);
});

app.post("/", async (req, res) => {
  const data = new studentModel({
    name: req.body.name,
    age: req.body.age,
  });

  const result = await data.save();
  res.json({
    message: "Data Saved",
    data: result,
  });
});

app.put("/", async (req, res) => {
  const data = await studentModel.findById(req.query.id);
  data.name = req.body.name;
  data.age = req.body.age;

  const result = await data.save();
  res.json({
    message: "Update Successfully",
    data: result,
  });
});

app.delete("/", async (req, res) => {
  const result = await studentModel.deleteOne({ _id: req.query.id });
  res.json({
    message: "Delete Successful",
    data: result,
  });
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
