import mongoose from "mongoose";

const detailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true },
    password: { type: String, required: true },
    age: { type: String, required: true },
    id: {type: String, require: true}
})

const Details = mongoose.model('Details', detailsSchema);

export default Details;
