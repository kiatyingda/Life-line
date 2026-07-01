import SwiftUI

@main
struct DontSendThatApp: App {
    /// One store for the whole app, shared with both tabs via the environment.
    @StateObject private var history = HistoryStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(history)
        }
    }
}
