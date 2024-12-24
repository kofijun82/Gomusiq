import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import axios from "axios";
import { toast } from "react-toastify";

const HomePage = () => {
    const {
        fetchFeaturedSongs,
        fetchMadeForYouSongs,
        fetchTrendingSongs,
        isLoading,
        madeForYouSongs,
        featuredSongs,
        trendingSongs,
    } = useMusicStore();

    const { initializeQueue } = usePlayerStore();
    const [purchasedSongs, setPurchasedSongs] = useState<string[]>([]);

    useEffect(() => {
        fetchFeaturedSongs();
        fetchMadeForYouSongs();
        fetchTrendingSongs();
    }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

    useEffect(() => {
        if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
            const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
            initializeQueue(allSongs);
        }
    }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

    // Fetch Purchased Songs
    useEffect(() => {
        const fetchPurchasedSongs = async () => {
            try {
                const response = await axios.get("/api/user/purchases");
                setPurchasedSongs(response.data.songs || []);
            } catch (error) {
                console.error("Error fetching purchased songs:", error);
                toast.error("Failed to load purchased songs.");
            }
        };

        fetchPurchasedSongs();
    }, []);

    const handlePlay = (songId: string, audioElement: HTMLAudioElement) => {
        if (!purchasedSongs.includes(songId)) {
            // Restrict playback to 20 seconds
            audioElement.currentTime = 0;
            audioElement.play();
            toast.info("You can play only 20 seconds of this song. Purchase to unlock full access!");

            setTimeout(() => {
                audioElement.pause();
            }, 20000); // Pause after 20 seconds
        } else {
            // Allow full playback for purchased songs
            audioElement.play();
        }
    };

    const handlePay = async (song: { id: string; title: string; price: number }) => {
        try {
            const userEmail = "kofijun82@gmail.com"; // Replace with actual user's email
            const response = await axios.post("/api/payment/initialize", {
                email: userEmail,
                amount: song.price, // Song price in kobo (if using NGN)
                songId: song.id, // Pass song ID for backend reference
            });

            // Redirect user to Paystack payment page
            window.location.href = response.data.data.authorization_url;
        } catch (error) {
            console.error("Payment initialization error:", error);
            toast.error("Failed to initialize payment.");
        }
    };

    return (
        <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-6">Good afternoon</h1>
                    <FeaturedSection />

                    <div className="space-y-8">
                        {/* Made For You Section */}
                        <SectionGrid
                            title="Made For You"
                            songs={madeForYouSongs.map((song) => ({
                                ...song,
                                action: () =>
                                    purchasedSongs.includes(song.id) ? null : (
                                        <button
                                            onClick={() => handlePay(song)}

                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Buy Now
                                        </button>
                                    ),
                                onPlay: (audioElement: HTMLAudioElement) => handlePlay(song.id, audioElement),
                            }))}
                            isLoading={isLoading}
                        />

                        {/* Trending Section */}
                        <SectionGrid
                            title="Trending"
                            songs={trendingSongs.map((song) => ({
                                ...song,
                                action: () =>
                                    purchasedSongs.includes(song.id) ? null : (
                                        <button
                                            onClick={() => handlePay(song)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Buy Now
                                        </button>
                                    ),
                                onPlay: (audioElement: HTMLAudioElement) => handlePlay(song.id, audioElement),
                            }))}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </ScrollArea>
        </main>
    );
};

export default HomePage;
