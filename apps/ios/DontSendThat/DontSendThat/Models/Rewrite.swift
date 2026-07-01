import Foundation

/// A single saved rewrite: what you typed, what came back, the tone, and when.
struct Rewrite: Identifiable, Codable, Equatable, Hashable {
    let id: UUID
    let original: String
    let rewritten: String
    let tone: Tone
    let date: Date

    init(
        id: UUID = UUID(),
        original: String,
        rewritten: String,
        tone: Tone,
        date: Date = Date()
    ) {
        self.id = id
        self.original = original
        self.rewritten = rewritten
        self.tone = tone
        self.date = date
    }

    /// First non-empty line of the rewrite, used as the History row title.
    var firstLine: String {
        rewritten
            .split(whereSeparator: \.isNewline)
            .first { !$0.trimmingCharacters(in: .whitespaces).isEmpty }
            .map(String.init) ?? rewritten
    }
}
