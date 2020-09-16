import * as mongoose from 'mongoose';
import {model} from 'mongoose';



const userSchema = new mongoose.Schema({
    _id: {type: String, required: true },
    username: {type: String, required: true, unique: true, trim:true},
    last_claim_date:{type: Date, required: false},
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},
});
export default model('users', userSchema);
