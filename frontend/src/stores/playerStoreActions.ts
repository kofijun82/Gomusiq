import { Song } from "@/types";
import { useChatStore } from "./useChatStore";
import { usePlayerStore } from "./usePlayerStore";

// Action to toggle play/pause
export const togglePlayAction = () => {
  const { isPlaying, currentSong, currentIndex, queue } = usePlayerStore.getState();
  const willStartPlaying = !isPlaying;

  const socket = useChatStore.getState().socket;
  if (socket.auth) {
    socket.emit("update_activity", {
      userId: socket.auth.userId,
      activity: willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
    });
  }

  usePlayerStore.setState({
    isPlaying: willStartPlaying,
  });
};

// Action to play the next song in the queue
export const playNextAction = () => {
  const { currentIndex, queue } = usePlayerStore.getState();
  const nextIndex = currentIndex + 1;

  if (nextIndex < queue.length) {
    const nextSong = queue[nextIndex];
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
      });
    }

    usePlayerStore.setState({
      currentSong: nextSong,
      currentIndex: nextIndex,
      isPlaying: true,
    });
  } else {
    usePlayerStore.setState({ isPlaying: false });
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: "Idle",
      });
    }
  }
};

// Action to play the previous song in the queue
export const playPreviousAction = () => {
  const { currentIndex, queue } = usePlayerStore.getState();
  const prevIndex = currentIndex - 1;

  if (prevIndex >= 0) {
    const prevSong = queue[prevIndex];
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
      });
    }

    usePlayerStore.setState({
      currentSong: prevSong,
      currentIndex: prevIndex,
      isPlaying: true,
    });
  } else {
    usePlayerStore.setState({ isPlaying: false });
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: "Idle",
      });
    }
  }
};

// Action to set the current song
export const setCurrentSongAction = (song: Song | null) => {
  if (!song) return;

  const socket = useChatStore.getState().socket;
  if (socket.auth) {
    socket.emit("update_activity", {
      userId: socket.auth.userId,
      activity: `Playing ${song.title} by ${song.artist}`,
    });
  }

  const songIndex = usePlayerStore.getState().queue.findIndex((s) => s._id === song._id);
  usePlayerStore.setState({
    currentSong: song,
    isPlaying: true,
    currentIndex: songIndex !== -1 ? songIndex : usePlayerStore.getState().currentIndex,
  });
};
