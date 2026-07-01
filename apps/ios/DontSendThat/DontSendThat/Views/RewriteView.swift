import SwiftUI
import UIKit

/// The "Rewrite" tab: paste a heated draft, pick a tone, get something sendable.
struct RewriteView: View {
    @EnvironmentObject private var history: HistoryStore

    @State private var draft = ""
    @State private var tone: Tone = .professional
    @State private var result: Rewrite?
    @State private var isRewriting = false
    @State private var savedID: UUID?
    @State private var toast: Toast?

    @FocusState private var editorFocused: Bool

    private var trimmedDraft: String {
        draft.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private var resultIsSaved: Bool {
        result.map { $0.id == savedID } ?? false
    }

    var body: some View {
        NavigationStack {
            Form {
                messageSection
                toneSection
                actionSection
                if let result {
                    resultSection(for: result)
                }
            }
            .navigationTitle("Don't Send That")
            .scrollDismissesKeyboard(.interactively)
            .toolbar {
                ToolbarItemGroup(placement: .keyboard) {
                    Spacer()
                    Button("Done") { editorFocused = false }
                }
            }
            .toast($toast)
        }
    }

    // MARK: - Sections

    private var messageSection: some View {
        Section("Your message") {
            ZStack(alignment: .topLeading) {
                if draft.isEmpty {
                    Text("Paste a message you probably shouldn't send.")
                        .foregroundStyle(.secondary)
                        .padding(.top, 8)
                        .padding(.leading, 5)
                        .allowsHitTesting(false)
                }
                TextEditor(text: $draft)
                    .focused($editorFocused)
                    .frame(minHeight: 120)
            }
        }
    }

    private var toneSection: some View {
        Section {
            Picker("Tone", selection: $tone) {
                ForEach(Tone.allCases) { tone in
                    Label(tone.label, systemImage: tone.symbolName).tag(tone)
                }
            }
            .pickerStyle(.menu)
        } footer: {
            Text(tone.blurb)
        }
    }

    private var actionSection: some View {
        Section {
            Button(action: fix) {
                HStack {
                    Spacer()
                    if isRewriting {
                        ProgressView()
                            .controlSize(.small)
                            .tint(.white)
                        Text("Cooling it down…")
                    } else {
                        Label("Fix This Message", systemImage: "wand.and.stars")
                    }
                    Spacer()
                }
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .disabled(isRewriting)
            .listRowInsets(EdgeInsets())
            .listRowBackground(Color.clear)
        }
    }

    private func resultSection(for result: Rewrite) -> some View {
        Section("Rewritten") {
            Text(result.rewritten)
                .textSelection(.enabled)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.vertical, 2)

            HStack(spacing: 12) {
                Button {
                    copy(result.rewritten)
                } label: {
                    Label("Copy", systemImage: "doc.on.doc")
                        .frame(maxWidth: .infinity)
                }

                ShareLink(item: result.rewritten) {
                    Label("Share", systemImage: "square.and.arrow.up")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.bordered)

            HStack(spacing: 12) {
                Button {
                    save(result)
                } label: {
                    Label(resultIsSaved ? "Saved" : "Save",
                          systemImage: resultIsSaved ? "checkmark" : "tray.and.arrow.down")
                        .frame(maxWidth: .infinity)
                }
                .disabled(resultIsSaved)

                Button(role: .destructive) {
                    clear()
                } label: {
                    Label("Clear", systemImage: "trash")
                        .frame(maxWidth: .infinity)
                }
            }
            .buttonStyle(.bordered)
        }
    }

    // MARK: - Actions

    private func fix() {
        editorFocused = false
        guard !trimmedDraft.isEmpty else {
            toast = Toast(message: "Paste something first.", symbolName: "exclamationmark.bubble")
            return
        }

        isRewriting = true
        let currentDraft = draft
        let currentTone = tone

        Task {
            // Brief beat so "Cooling it down…" is felt, not just flashed.
            try? await Task.sleep(for: .milliseconds(650))
            let rewritten = Rewriter.rewrite(currentDraft, tone: currentTone)
            withAnimation {
                result = Rewrite(original: currentDraft, rewritten: rewritten, tone: currentTone)
                savedID = nil
                isRewriting = false
            }
        }
    }

    private func copy(_ text: String) {
        UIPasteboard.general.string = text
        toast = Toast(message: "Copied. Crisis avoided.", symbolName: "checkmark.circle")
    }

    private func save(_ rewrite: Rewrite) {
        history.add(rewrite)
        savedID = rewrite.id
        toast = Toast(message: "Saved to History.", symbolName: "tray.and.arrow.down")
    }

    private func clear() {
        withAnimation {
            draft = ""
            result = nil
            savedID = nil
        }
    }
}

#Preview {
    RewriteView()
        .environmentObject(HistoryStore(filename: "preview-history.json"))
}
