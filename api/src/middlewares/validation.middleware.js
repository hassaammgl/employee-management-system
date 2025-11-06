import { AppError } from "../utils/AppError.js";

export const validateRequest = (schema, isUrl = false) => (req, res, next) => {
    try {
        if (isUrl) {
            const { error } = schema.validate(req.params);
            if (error) {
                return next(new AppError(error.details[0].message, 400));
            }
            next();
        } else {
            const { error } = schema.validate(req.body);
            if (error) {
                return next(new AppError(error.details[0].message, 400));
            }
            next();
        }
    } catch (err) {
        next(err);
    }
}
