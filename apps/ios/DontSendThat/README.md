# Don't Send That — iOS

A small, native SwiftUI utility for rewriting a heated draft into something you
can actually send. Built to feel like something Apple could ship: system
controls, system fonts, SF Symbols, Light/Dark and Dynamic Type support, and
nothing over-designed.

## Open & run

```
open apps/ios/DontSendThat/DontSendThat.xcodeproj
```

Select the **DontSendThat** scheme and an iOS 17+ simulator, then Run.
Requires **Xcode 16+** (the project uses file-system-synchronized groups, so
new files added to the `DontSendThat/` folder are picked up automatically — no
project surgery needed).

There is no account, no network, and no onboarding. Rewriting happens entirely
on-device.

## Structure

```
DontSendThat/
  DontSendThatApp.swift      @main App; owns the shared HistoryStore
  Models/
    Tone.swift               Tone enum: label, SF Symbol, one-line blurb
    Rewrite.swift            A saved rewrite (original, rewritten, tone, date)
  Store/
    Rewriter.swift           On-device, deterministic tone rewriter
    HistoryStore.swift       ObservableObject; JSON persistence
  Support/
    Toast.swift              Transient "Copied" style confirmation
  Views/
    ContentView.swift        Two-tab TabView (Rewrite / History)
    RewriteView.swift        Rewrite tab — Form + TextEditor + Picker + result
    HistoryView.swift        History tab — List with swipe-to-delete
    HistoryDetailView.swift  Native detail screen for a saved rewrite
  Assets.xcassets/           AppIcon slot + adaptive AccentColor
```

## How it maps to the design requirements

- **Native only.** `NavigationStack`, `TabView`, `Form`, `List`, `TextEditor`,
  `Button`, `Picker` (`.menu`), `ShareLink`, `EditButton`,
  `ContentUnavailableView`, and native sheets/toolbars. No custom design system,
  no web-style cards, no gradients.
- **Two tabs:** Rewrite and History.
- **Rewrite tab:** title "Don't Send That", grouped `Form` with a `TextEditor`
  input, a tone `Picker`, a prominent "Fix This Message" button, and a grouped
  result section with Copy / Share / Save / Clear.
- **History tab:** native `List`; each row shows tone, date, and the first line
  of the rewrite. Rows push a native detail screen; swipe-to-delete and Edit
  both work.
- **Tones:** Professional, Firm, Friendly, Short, Apologetic, Boundary.
- **Empty states:** "Paste a message you probably shouldn't send." (input
  placeholder) and "No regrets saved yet." (`ContentUnavailableView`).
- **Microcopy:** "Cooling it down…" (loading), "Copied. Crisis avoided."
  (copy confirmation), "Paste something first." (empty input).
- **Adaptivity:** system colors/materials give automatic Light/Dark; all text is
  system font and scales with Dynamic Type.

## Note on the rewriter

`Rewriter.rewrite(_:tone:)` is a deterministic on-device transform (it calms the
punctuation, un-shouts ALL-CAPS, tidies whitespace, then frames the message for
the tone). It's intentionally simple and is the natural seam to swap in a
smarter model later without touching the UI.
