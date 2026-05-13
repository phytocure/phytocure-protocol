import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/contexts/WalletContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Distributors from "@/pages/Distributors";
import DistributorDetail from "@/pages/DistributorDetail";
import Prescriptions from "@/pages/Prescriptions";
import NewPrescription from "@/pages/NewPrescription";
import ResearchHub from "@/pages/ResearchHub";
import NewResearch from "@/pages/NewResearch";
import ResearchDetail from "@/pages/ResearchDetail";
import AIAnalysis from "@/pages/AIAnalysis";
import Transactions from "@/pages/Transactions";
import About from "@/pages/About";
import Laboratory from "@/pages/Laboratory";
import Thesis from "@/pages/Thesis";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import MedicalDisclaimer from "@/pages/MedicalDisclaimer";
import CookiePolicy from "@/pages/CookiePolicy";
import Docs from "@/pages/Docs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Public routes */}
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/distributors" component={Distributors} />
      <Route path="/distributors/:id" component={DistributorDetail} />
      <Route path="/research" component={ResearchHub} />
      <Route path="/research/:id" component={ResearchDetail} />
      {/* Protected: require wallet */}
      <Route path="/app">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/prescriptions">
        {() => <ProtectedRoute component={Prescriptions} />}
      </Route>
      <Route path="/prescriptions/new">
        {() => <ProtectedRoute component={NewPrescription} />}
      </Route>
      <Route path="/research/new">
        {() => <ProtectedRoute component={NewResearch} />}
      </Route>
      <Route path="/ai">
        {() => <ProtectedRoute component={AIAnalysis} />}
      </Route>
      <Route path="/transactions">
        {() => <ProtectedRoute component={Transactions} />}
      </Route>
      <Route path="/about" component={About} />
      <Route path="/laboratory" component={Laboratory} />
      <Route path="/thesis" component={Thesis} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/disclaimer" component={MedicalDisclaimer} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route path="/docs" component={Docs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
