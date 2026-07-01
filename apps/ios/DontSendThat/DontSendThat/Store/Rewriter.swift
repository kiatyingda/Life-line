import Foundation

/// Turns a heated draft into something you can actually send.
///
/// This is an on-device, deterministic rewriter — no network, no account,
/// nothing leaves the phone. It normalises the text (de-yells it, calms the
/// punctuation, tidies whitespace) and then wraps the core message in a light
/// frame that matches the chosen tone. It is intentionally simple; the shape
/// of the API (`rewrite(_:tone:)`) is the seam where a smarter model could
/// drop in later.
enum Rewriter {

    /// Produce a tone-adjusted rewrite of `message`.
    static func rewrite(_ message: String, tone: Tone) -> String {
        let core = normalize(message)
        guard !core.isEmpty else { return "" }

        switch tone {
        case .professional:
            return """
            Hi,

            \(core) Let me know if that works for you.

            Thanks.
            """
        case .firm:
            return """
            I want to be clear about this: \(core) I'd appreciate it being handled accordingly.
            """
        case .friendly:
            return """
            Hey! \(core) No rush at all — just wanted to flag it. 🙂
            """
        case .short:
            return core
        case .apologetic:
            return """
            Sorry to bring this up — I know it's not ideal. \(core) Thanks for understanding.
            """
        case .boundary:
            return """
            I've thought about this, and I need to be honest: \(core) I hope that's okay, and I'm saying it with care.
            """
        }
    }

    // MARK: - Normalisation

    /// Calm the raw draft down: collapse whitespace, un-shout ALL-CAPS words,
    /// tame repeated punctuation, and make sure it ends on a full stop.
    private static func normalize(_ raw: String) -> String {
        var text = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return "" }

        // Collapse runs of whitespace (including newlines) into single spaces.
        text = text.split(whereSeparator: { $0.isWhitespace })
            .joined(separator: " ")

        // Un-shout: lowercase words that are entirely uppercase letters and
        // longer than one character (keeps acronyms like "OK" tolerable but
        // takes the edge off "STOP" / "NOW").
        text = text.split(separator: " ").map { word -> String in
            let letters = word.filter(\.isLetter)
            if letters.count > 1 && letters.allSatisfy({ $0.isUppercase }) {
                return word.lowercased()
            }
            return String(word)
        }.joined(separator: " ")

        // Tame repeated terminal punctuation: "!!!" / "???" → single mark.
        text = collapseRepeats(in: text, of: "!")
        text = collapseRepeats(in: text, of: "?")

        // Exclamation marks read as heat — soften a lone one to a period.
        text = text.replacingOccurrences(of: "!", with: ".")

        // Ensure sentence-final punctuation.
        if let last = text.last, !".?".contains(last) {
            text.append(".")
        }

        // Capitalise the first character.
        if let first = text.first {
            text.replaceSubrange(text.startIndex...text.startIndex,
                                 with: String(first).uppercased())
        }

        return text
    }

    /// Collapse runs of a character (e.g. "!!!") down to a single instance.
    private static func collapseRepeats(in text: String, of char: Character) -> String {
        var result = ""
        var previous: Character?
        for c in text {
            if c == char && previous == char { continue }
            result.append(c)
            previous = c
        }
        return result
    }
}
