export function setUpRequest(req, res, next) {
    req.local = {}
    next()
}