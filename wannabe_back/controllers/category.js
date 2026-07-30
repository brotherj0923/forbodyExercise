const { Category , Food, Exercise} = require('../models');
const { withOptimizedImgs } = require('../utils/optimizedAsset');

exports.get_category = async (req, res, next) => {
    try {
        const category = await Category.findOne({
            where : {id : req.params.id},
            include: [
                {
                    model: req.params.id==1 ? Exercise : Food,
                }
            ]
        })
        const payload = category && typeof category.toJSON === 'function' ? category.toJSON() : category;
        if (payload?.Exercises) {
            payload.Exercises = withOptimizedImgs(payload.Exercises);
        }

        res.json({
            code : 200,
            payload
        })
    } catch (err) {
        console.error(err);
        next(err)
    }
}
