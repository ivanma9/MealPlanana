const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Recipe = new Schema({
	recipe_description: {
		type: String,
	},
	recipe_responsible: {
		type: String,
	},
	recipe_priority: {
		type: String,
	},
	recipe_completed: {
		type: Boolean,
	},
});

module.exports = mongoose.model("Recipe", Recipe);
