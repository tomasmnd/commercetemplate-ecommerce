import env from "../.env"
import mongoose, {connect} from "mongoose";

/*
switch (config.PERSISTENCE) {
    case 'MONGO':
        const connection = mongoose.connect(env.MONGO_URL);
        const {default:CartsMongo} = await import('../')
        //...

        carts = CartsMongo;
        //...
    break;
}
*/