class ErrorHandle {
    handleError = (err, req, res, next) => {
        const message = err.message || 'Bad request';
        return res.json({
            success: false,
            message
        });
    };
};

module.exports = new ErrorHandle();