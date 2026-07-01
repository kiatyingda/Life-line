import SwiftUI
import UIKit

/// Detail screen for a saved rewrite: the rewritten text, the original it came
/// from, plus Copy and Share. Reached by tapping a History row.
struct HistoryDetailView: View {
    @EnvironmentObject private var history: HistoryStore
    @Environment(\.dismiss) private var dismiss

    let item: Rewrite

    @State private var toast: Toast?

    var body: some View {
        Form {
            Section {
                LabeledContent {
                    Label(item.tone.label, systemImage: item.tone.symbolName)
                        .foregroundStyle(.tint)
                } label: {
                    Text("Tone")
                }
                LabeledContent("Saved") {
                    Text(item.date, format: .dateTime.month().day().year().hour().minute())
                }
            }

            Section("Rewritten") {
                Text(item.rewritten)
                    .textSelection(.enabled)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.vertical, 2)
            }

            Section("Original") {
                Text(item.original)
                    .textSelection(.enabled)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.vertical, 2)
            }

            Section {
                Button {
                    UIPasteboard.general.string = item.rewritten
                    toast = Toast(message: "Copied. Crisis avoided.", symbolName: "checkmark.circle")
                } label: {
                    Label("Copy", systemImage: "doc.on.doc")
                        .frame(maxWidth: .infinity)
                }

                ShareLink(item: item.rewritten) {
                    Label("Share", systemImage: "square.and.arrow.up")
                        .frame(maxWidth: .infinity)
                }
            }
        }
        .navigationTitle(item.tone.label)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button(role: .destructive) {
                    history.delete(item)
                    dismiss()
                } label: {
                    Image(systemName: "trash")
                }
            }
        }
        .toast($toast)
    }
}

#Preview {
    NavigationStack {
        HistoryDetailView(item: Rewrite(
            original: "WHY didn't you reply?!!!",
            rewritten: "Hi, I wanted to follow up on my earlier note. Let me know if that works for you. Thanks.",
            tone: .professional
        ))
        .environmentObject(HistoryStore(filename: "preview-history.json"))
    }
}
