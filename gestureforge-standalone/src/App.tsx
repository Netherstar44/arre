import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Editor from "@/pages/Editor";
import AnchorViewer from "@/pages/AnchorViewer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Editor} />
      <Route path="/anchor" component={AnchorViewer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <Router />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
