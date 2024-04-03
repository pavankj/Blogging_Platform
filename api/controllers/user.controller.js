import User from "../models/user.model.js";



//get all users
export const getAllUsers = async (req, res, next) => {
    try {
        // Use a regular expression with $not to exclude emails containing "@admin"
        const users = await User.find({
            email: { $not: /@admin/ }
        });

        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};


export const updateUser = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Find the user by email to get the current 'disabled' state
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the 'disabled' value and save the updated document
        user.disabled = !user.disabled;
        await user.save();

        // Fetch and return all users after the update
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};


//subscribe to a section

export const subscribe = async (req, res, next) => {
    const {topic, userName} = req.body;
    try {
        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        //check if that section is already subscribed to
        if (user.subscriptions.includes(topic)) {
            return res.status(400).json({message: 'Already subscribed to this topic'});
        }
        user.subscriptions.push(topic);
        await user.save();
        return res.status(200).json(user);
        
    } catch (error) {
        next(error);
    }
}

//unsubscribe from a section
export const unsubscribe = async (req, res, next) => {
    const {topic, userName} = req.body;
    try {
        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        user.subscriptions = user.subscriptions.filter(sub => sub !== topic);
        await user.save();
        return res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}


//check if user is subscribed to a section
export const checkSubscription = async (req, res, next) => {
    const {topic, userName} = req.body;
    try {
        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const isSubscribed = user.subscriptions.includes(topic);
        return res.status(200).json({ isSubscribed: isSubscribed });
    } catch (error) {
        next(error);
    }
}


