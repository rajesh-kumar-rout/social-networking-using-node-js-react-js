export function setUpRequest(req, res, next) {
    if (!req.files) {
        req.files = {}
    }
    req.local = {}
    next()
}