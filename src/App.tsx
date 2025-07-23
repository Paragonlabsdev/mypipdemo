import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Builder from "./pages/Builder";
import NotFound from "./pages/NotFound";
import Integrations from "./pages/builder/Integrations";
import MyPips from "./pages/builder/MyPips";
import Pricing from "./pages/builder/Pricing";
import Settings from "./pages/builder/Settings";
import Affiliate from "./pages/builder/Affiliate";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/builder" element={<Builder />}>
          <Route path="integrations" element={<Integrations />} />
          <Route path="mypips" element={<MyPips />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="affiliate" element={<Affiliate />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
