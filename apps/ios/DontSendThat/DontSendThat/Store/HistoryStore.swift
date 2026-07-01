import Foundation

/// Owns the saved rewrites and persists them to disk as JSON.
///
/// Newest first. Persistence lives in Application Support so it survives
/// launches but stays out of the user's document space.
@MainActor
final class HistoryStore: ObservableObject {
    @Published private(set) var items: [Rewrite] = []

    private let fileURL: URL

    init(filename: String = "history.json") {
        let base = FileManager.default
            .urls(for: .applicationSupportDirectory, in: .userDomainMask)
            .first ?? FileManager.default.temporaryDirectory
        try? FileManager.default.createDirectory(
            at: base, withIntermediateDirectories: true
        )
        self.fileURL = base.appendingPathComponent(filename)
        load()
    }

    /// Save a rewrite to the top of the list.
    func add(_ rewrite: Rewrite) {
        items.insert(rewrite, at: 0)
        persist()
    }

    /// Standard List swipe / edit deletion.
    func delete(at offsets: IndexSet) {
        items.remove(atOffsets: offsets)
        persist()
    }

    /// Delete a specific item (used from the detail screen).
    func delete(_ rewrite: Rewrite) {
        items.removeAll { $0.id == rewrite.id }
        persist()
    }

    // MARK: - Persistence

    private func load() {
        guard let data = try? Data(contentsOf: fileURL) else { return }
        if let decoded = try? JSONDecoder().decode([Rewrite].self, from: data) {
            items = decoded
        }
    }

    private func persist() {
        guard let data = try? JSONEncoder().encode(items) else { return }
        try? data.write(to: fileURL, options: .atomic)
    }
}
