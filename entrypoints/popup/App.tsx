import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

function App() {
  return (
    <div className="min-w-xs min-h-96 flex flex-col items-center justify-center">
      <p>
        Click on the WXT and React logos to learn more
      </p>
      <Switch />
      <Button className="mt-4" onClick={() => window.open("https://wxtjs.org", "_blank")}>
        WXT
      </Button>
      <Button className="mt-4" onClick={() => window.open("https://react.dev", "_blank")}>
        React
      </Button>
    </div>
  );
}

export default App;
