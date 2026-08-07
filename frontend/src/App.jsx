import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Home />
    </div>
  );
}