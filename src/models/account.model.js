const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "account must be associated with a user"],
            index: true,
        },
        status: {
            enum: {
                values: ["ACTIVE", "FROZEN", "CLOSED"],
                message: "status must be either active, frozen or closed",
            },
        },
        currency: {
            type: String,
            required: [true, "currency is mising"],
            default: "BDT",
        },
    },
    {
        timestamps: true,
    },
);

accountSchema.index({ user: 1, status: 1 });

const accountModel = mongoose.model("accounts", accountSchema);
module.exports = accountModel;
