import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";
import { toast } from "react-toastify";

const PlayButton = ({ song }: { song: Song }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay, isPreview } = usePlayerStore();
  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = () => {
    if (!song.isPurchased) {
      playPreview(song);
      return;
    }

    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };

  const playPreview = (song: Song) => {
    // Display a notification about the preview
    toast.info("Playing 20-second preview. Purchase the song to unlock full playback.");
    
    // Set the current song as a preview
    setCurrentSong({ ...song, isPreview: true });

    // Automatically stop the preview after 20 seconds
    setTimeout(() => {
      if (currentSong?.id === song.id && isPreview) {
        togglePlay(); // Pause the player after preview ends
        toast.info("Preview ended. Purchase the song to continue listening.");
      }
    }, 20000); // 20 seconds
  };

  return (
    <Button
      size={"icon"}
      onClick={handlePlay}
      className={`absolute bottom-3 right-2 bg-orange-500 hover:bg-orange-400 hover:scale-105 transition-all 
        opacity-0 translate-y-2 group-hover:translate-y-0 ${isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-black" />
      ) : (
        <Play className="size-5 text-black" />
      )}
    </Button>
  );
};

export default PlayButton;
