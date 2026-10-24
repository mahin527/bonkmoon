// async function-এর error নিজে থেকে next()-এ পাঠায়, তাই প্রতি controller-এ try/catch লাগে না
module.exports.asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
