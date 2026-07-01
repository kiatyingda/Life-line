import SwiftUI

/// The "History" tab: a native List of saved rewrites with swipe-to-delete.
struct HistoryView: View {
    @EnvironmentObject private var history: HistoryStore

    var body: some View {
        NavigationStack {
            Group {
                if history.items.isEmpty {
                    ContentUnavailableView(
                        "No regrets saved yet.",
                        systemImage: "tray",
                        description: Text("Rewrites you save will show up here.")
                    )
                } else {
                    List {
                        ForEach(history.items) { item in
                            NavigationLink(value: item) {
                                HistoryRow(item: item)
                            }
                        }
                        .onDelete { history.delete(at: $0) }
                    }
                }
            }
            .navigationTitle("History")
            .toolbar {
                if !history.items.isEmpty {
                    EditButton()
                }
            }
            .navigationDestination(for: Rewrite.self) { item in
                HistoryDetailView(item: item)
            }
        }
    }
}

/// One row: tone (with symbol), date, and the first line of the rewrite.
private struct HistoryRow: View {
    let item: Rewrite

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Label(item.tone.label, systemImage: item.tone.symbolName)
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(.tint)
                Spacer()
                Text(item.date, format: .dateTime.month().day().year())
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
            Text(item.firstLine)
                .font(.body)
                .foregroundStyle(.primary)
                .lineLimit(2)
        }
        .padding(.vertical, 2)
    }
}

#Preview {
    let store = HistoryStore(filename: "preview-history.json")
    store.add(Rewrite(
        original: "WHY didn't you reply?!!!",
        rewritten: "Hi, I wanted to follow up on my earlier note. Let me know if that works for you. Thanks.",
        tone: .professional
    ))
    return HistoryView().environmentObject(store)
}
