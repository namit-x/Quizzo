import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    name: String, // Image name
    data: Buffer, // Image data as Buffer
    contentType: String, // MIME type (e.g., image/png)
    userID: { type: String, require: true }
});

const Image = mongoose.model('Image', imageSchema);

export default Image;
