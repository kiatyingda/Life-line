import SwiftUI

/// Root of the app: a two-tab TabView — Rewrite and History.
struct ContentView: View {
    var body: some View {
        TabView {
            RewriteView()
                .tabItem {
                    Label("Rewrite", systemImage: "wand.and.stars")
                }

            HistoryView()
                .tabItem {
                    Label("History", systemImage: "clock.arrow.circlepath")
                }
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(HistoryStore(filename: "preview-history.json"))
}
