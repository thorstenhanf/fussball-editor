import Editor from './components/editor/Editor';

// Vorerst lädt App direkt den Editor, damit das Grundgerüst sofort
// visuell testbar ist. Routing (Login, Bibliothek, Detailansicht,
// Share-Seite) kommt im nächsten Schritt über react-router-dom hinzu.
export default function App() {
  return <Editor />;
}
