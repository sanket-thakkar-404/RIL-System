import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  fullname: {
    type: String,
    min: 3,
    required: [true, "Full Name is Required"],
    trim: true,
  },

  department: {
    type: String,
    required: [true, "Department is Required"],
    trim: true,
  },
  requestId: {
    type: String,
    required: true,
    unique: true
  },

  items: {
    type: [
      {
        _id: false,
        productId: {
          type: String,
          required: [true, "Product Id is Required"],
          trim: true,
        },
        productName: {
          type: String,
          required: [true, "Product Name is Required"],
          trim: true,
        },
        qty: {
          type: Number,
          required: [true, "Quantity is Required"],
          min: [1, "Quantity must be at least 1"],
        },
        category: {
          type: String,
          required: [true, "category is Required"],
          trim: true,
        },
        stock: {
          type: Number,
          required: [true, "stock is Required"],
        },
        approveQty: {
          type: Number,
          default: 0,
          min: 0,
        },
        receivedQty: {
          type: Number,
          default: 0,
          min: 0,
        },
      }
    ],
    validate: {
      validator: function (value) {
        return value.length > 0;
      },
      message: "At least one item is required",
    },
  },

  description: {
    type: String,
    required: [true, "Description is Required"],
    trim: true,
  },

  status: {
    type: String,
    enum: [
      "UNDER_REVIEW",
      "APPROVED",
      "REJECTED",
      "RECEIVED",
    ],
    default: "UNDER_REVIEW",
  },
  email: {
    required: true,
    type: String
  },

  receivedAt: {
    type: Date,
    default: null,
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },

  approvedAt: {
    type: Date,
    default: null,
  },
},
  { timestamps: true }
);

const issueModel = mongoose.model("Issues", issueSchema)



export default issueModel

