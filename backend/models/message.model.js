import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {  
      type: String,
      required: function() {
        return !this.attachments || this.attachments.length === 0;
      },
      trim: true
    },
    attachments: [{  
      type: String,
      default: []
    }],
    isAnonymous: {  
      type: Boolean,
      default: true
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, receiver: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;