import SwiftUI

/// A brief, self-dismissing confirmation that floats above the content —
/// the sort of quiet acknowledgement you'd see for "Copied" in a system app.
/// Built from `Capsule` + `.regularMaterial` so it adapts to Light/Dark and
/// respects Dynamic Type.
struct Toast: Equatable {
    let message: String
    let symbolName: String
}

private struct ToastModifier: ViewModifier {
    @Binding var toast: Toast?
    var duration: TimeInterval = 2

    func body(content: Content) -> some View {
        content.overlay(alignment: .bottom) {
            if let toast {
                Label(toast.message, systemImage: toast.symbolName)
                    .font(.subheadline.weight(.medium))
                    .labelStyle(.titleAndIcon)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(.regularMaterial, in: Capsule())
                    .overlay(Capsule().strokeBorder(.separator))
                    .shadow(color: .black.opacity(0.12), radius: 12, y: 4)
                    .padding(.bottom, 24)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                    .task(id: toast) {
                        try? await Task.sleep(for: .seconds(duration))
                        withAnimation { self.toast = nil }
                    }
            }
        }
        .animation(.snappy, value: toast)
    }
}

extension View {
    /// Presents a transient confirmation toast bound to `toast`.
    func toast(_ toast: Binding<Toast?>) -> some View {
        modifier(ToastModifier(toast: toast))
    }
}
