import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { countStorage } from "../lib/storage/count";
import { LoaderCircle } from "@/components/animate-ui/icons/loader-circle";

function App() {
  // const count = await countStorage.getValue();
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const fetchCount = async () => {
    // const count = await countStorage.getValue();
    // setCounter(count.count);

    // };
    // fetchCount();

    countStorage.getValue().then((count) => {
      setCounter(count.count);
      setLoading(false);
    });
  }, []);

  const handleCounterIncrement = async () => {
    // const newCount = counter + 1;
    // setCounter(newCount);
    // await countStorage.setValue({ count: newCount });
    setCounter((prevCount) => {
      const newCount = prevCount + 1;

      void countStorage.setValue({ count: newCount });

      return newCount;
    });
  };

  return (
    <div className="min-w-xs min-h-96 flex flex-col items-center justify-center">
      <p>Click on the WXT and React logos to learn more</p>
      <Switch />
      <Button
        className="mt-4"
        onClick={() => window.open("https://wxtjs.org", "_blank")}
      >
        WXT
      </Button>
      <Button
        className="mt-4"
        onClick={() => window.open("https://react.dev", "_blank")}
      >
        React
      </Button>
      {/* <Button className="mt-4" onClick={handleCounterIncrement}>
        Increment Counter: {counter}
      </Button> */}
      <Button className="mt-4" onClick={handleCounterIncrement}>
        Increment Counter:{" "}
        {loading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : counter}
      </Button>
    </div>
  );
}

export default App;
