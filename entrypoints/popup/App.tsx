import { Label } from "@/components/ui/label";
import youtubeIcon from "@/assets/youtubeIcon.png";
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
    <div className="w-56 pt-4 flex flex-col items-center justify-start gap-4 bg-linear-to-b from-cyan-500 to-blue-500">
      <div className="w-full h-8 flex items-center justify-center">
        <Label className="text-2xl text-zinc-100">No Need Shorts</Label>
      </div>
      <div className="w-full h-full bg-white rounded-t-xl flex flex-col items-center justify-start">
        <div className="w-full h-24 flex flex-row">
          <div className="w-1/2 h-full flex items-center justify-center" onClick={handleYoutubeSwitchChange}>
            <img
              src={youtubeIcon}
              alt="YouTube Icon"
              className={`w-full h-1/2 object-contain cursor-pointer transition-all duration-300 ${youtubeRestriction ? "" : "grayscale"}`}
            />
          </div>
          <div className="w-1/2 h-full flex flex-col justify-center items-center">
            <Label className="text-xl text-red-500">YouTube</Label>
            <Label className="text-md text-zinc-800">Restriction {youtubeRestriction ? "ON" : "OFF"}</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
