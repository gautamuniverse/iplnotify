import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/],
  },
  password: { type: String, required: true },
  subscriptions: [String], // IPL team names as subscription
  tokens: [ //for storing the jwt tokens 
    {
      type: String,
      ref: "User",
      timestamps: true,
    },  
  ],
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'user']
  } 
});

export const UserModel = mongoose.model("User", userSchema);
