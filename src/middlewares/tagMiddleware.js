const sanitizeTagNameValue = (value) => {
    if (typeof value !== 'string') return value

    const normalized = value.trim().toLowerCase()
    if (normalized === '') return normalized

    return normalized.split(/\s+/).join('-')
}

const sanitizeTagName = (req, res, next) => {
    if (req.body?.tagName != null) {
        req.body.tagName = sanitizeTagNameValue(req.body.tagName)
    }

    if (req.params?.tagName != null) {
        const raw = decodeURIComponent(req.params.tagName)
        req.params.tagName = sanitizeTagNameValue(raw)
    }

    next()
}

module.exports = { sanitizeTagName, sanitizeTagNameValue }
