import * as mongoose from 'mongoose';
import {model} from 'mongoose';

const gameSchema = new mongoose.Schema({
    _id: {type: String, required: true },
    user_id: {type: String, required: true},
    user_name:{type: String, required: true},
    points_added:{type: Number, required: true},
    points_total:{type: Number, required: true},
    play_time_slots:{type: [], required: true},
    created_at: {type: Date, required: true},//play_first_time
    updated_at: {type: Date, required: true},//play_last_time
});

export default model('game', gameSchema);
