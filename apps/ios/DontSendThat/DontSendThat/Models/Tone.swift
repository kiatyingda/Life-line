import Foundation

/// The rewrite tones offered in the picker.
///
/// Order here is the order shown in the picker, so keep it intentional:
/// the most-reached-for tones sit near the top.
enum Tone: String, CaseIterable, Identifiable, Codable {
    case professional = "Professional"
    case firm         = "Firm"
    case friendly     = "Friendly"
    case short        = "Short"
    case apologetic   = "Apologetic"
    case boundary     = "Boundary"

    var id: String { rawValue }

    /// Human label shown everywhere in the UI.
    var label: String { rawValue }

    /// SF Symbol paired with the tone in menus and list rows.
    var symbolName: String {
        switch self {
        case .professional: return "briefcase"
        case .firm:         return "hand.raised"
        case .friendly:     return "face.smiling"
        case .short:        return "bolt"
        case .apologetic:   return "heart"
        case .boundary:     return "shield.lefthalf.filled"
        }
    }

    /// One-line description shown under the picker.
    var blurb: String {
        switch self {
        case .professional: return "Polished and neutral."
        case .firm:         return "Direct, with no wiggle room."
        case .friendly:     return "Warm and easygoing."
        case .short:        return "Trimmed to the essentials."
        case .apologetic:   return "Softened with an apology."
        case .boundary:     return "A clear limit, kindly held."
        }
    }
}
