function matchNeofetchValues(output) {
    const RegEx = /(.+): (.+)/gi

    const final = []
    const o = output.match(RegEx)
    if (!o) return []
    for (const key of o) {
        final.push({
            name: key.split(": ")[0],
            value: key.split(": ")[1]

        })
    }

    return final
}

module.exports.matchNeofetchValues = matchNeofetchValues