import { Label } from "@/components/ui/label";
import youtubeIcon from "@/assets/youtubeIcon.png";
import facebookIcon from "@/assets/facebookIcon.png";
import { restrictionStorage } from "../lib/storage/restriction";

const App = () => {
  const [youtubeRestriction, setYoutubeRestriction] = useState(false);
  const [facebookRestriction, setFacebookRestriction] = useState(false);

  useEffect(() => {
    restrictionStorage.getValue().then((value) => {
      if (value) {
        setYoutubeRestriction(value.youtube);
        setFacebookRestriction(value.facebook);
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

  const handleFacebookSwitchChange = async () => {
    const restriction = await restrictionStorage.getValue();
    const newValue = !facebookRestriction;
    void restrictionStorage.setValue({ ...restriction, facebook: newValue });
    setFacebookRestriction(newValue);

    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab && tab.id && tab.url?.includes("facebook.com")) {
      await browser.tabs.reload(tab.id);
    }
  };

  const items = [
    {
      id: "youtube",
      name: "YouTube",
      color: "text-red-500",
      icon: youtubeIcon,
      restriction: youtubeRestriction,
      onChange: handleYoutubeSwitchChange,
    },
    {
      id: "facebook",
      name: "Facebook",
      color: "text-blue-500",
      icon: facebookIcon,
      restriction: facebookRestriction,
      onChange: handleFacebookSwitchChange,
    },
  ];

  const renderItems = () => {
    return items.map((item) => (
      <div key={item.id} className="w-full h-24 flex flex-row">
        <div
          className="w-1/2 h-full flex items-center justify-center"
          onClick={item.onChange}
        >
          <img
            src={item.icon}
            alt={`${item.name} Icon`}
            className={`w-full h-1/2 object-contain cursor-pointer transition-all duration-300 ${item.restriction ? "" : "grayscale"}`}
          />
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center items-center">
          <Label className={`text-xl ${item.color}`}>{item.name}</Label>
          <Label className="text-md text-zinc-800">
            Restriction {item.restriction ? "ON" : "OFF"}
          </Label>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-56 pt-4 flex flex-col items-center justify-start gap-4 bg-linear-to-r from-cyan-500 to-blue-500">
      <div className="w-full h-8 flex items-center justify-center">
        <Label className="text-2xl text-zinc-100">No Need Shorts</Label>
      </div>
      <div className="w-full h-full bg-white rounded-t-xl flex flex-col items-center justify-start">
        {renderItems()}
      </div>
    </div>
  );
};

export default App;
