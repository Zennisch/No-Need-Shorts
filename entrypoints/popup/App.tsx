import { Label } from "@/components/ui/label";
import youtubeIcon from "@/assets/youtubeIcon.png";
import { Switch } from "@/components/ui/switch";
import { restrictionStorage } from "../lib/storage/restriction";

const App = () => {
  const [youtubeRestriction, setYoutubeRestriction] = useState(false);

  useEffect(() => {
    restrictionStorage.getValue().then((value) => {
      if (value) {
        setYoutubeRestriction(value.youtube);
      }
    });
  }, []);

  const handleYoutubeSwitchChange = async () => {
    const restriction = await restrictionStorage.getValue();
    const newValue = !youtubeRestriction;
    void restrictionStorage.setValue({ ...restriction, youtube: newValue });
    setYoutubeRestriction(newValue);

    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab && tab.id && tab.url?.includes("youtube.com")) {
      await browser.tabs.reload(tab.id);
    }
  };

  return (
    <div className="w-80 h-96 flex items-center justify-center bg-gray-200">
      <div className="w-[calc(100%-1.25rem)] min-h-[calc(100%-1.25rem)] bg-white rounded-md flex flex-col items-center justify-start gap-2 px-2 py-2">
        <div className="w-full h-8 flex items-center justify-center rounded-md">
          <Label className="text-xl">No Need Shorts</Label>
        </div>
        <div className="w-full h-24 flex flex-row gap-2">
          <div className="w-1/2 h-full flex items-center justify-center">
            <img
              src={youtubeIcon}
              alt="YouTube Icon"
              className="w-full h-1/2 object-contain"
            />
          </div>
          <div className="w-1/2 h-full flex justify-around items-center">
            <Switch
              checked={youtubeRestriction}
              onCheckedChange={handleYoutubeSwitchChange}
            ></Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
