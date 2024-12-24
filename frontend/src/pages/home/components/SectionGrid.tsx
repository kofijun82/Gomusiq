import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { toast } from "react-toastify";

type SectionGridProps = {
	title: string;
	songs: Song[];
	isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
	if (isLoading) return <SectionGridSkeleton />;

	return (
		<div className='mb-8'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
				<Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
					Show all
				</Button>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{songs.map((song) => (
					<div
						key={song.id}
						className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
					>
						<div className='relative mb-4'>
							<div className='aspect-square rounded-md shadow-lg overflow-hidden'>
								<img
									src={song.imageUrl}
									alt={song.title}
									className='w-full h-full object-cover transition-transform duration-300 
									group-hover:scale-105'
								/>
							</div>
							<PlayButton song={song} />
						</div>
						<h3 className='font-medium mb-2 truncate'>{song.title}</h3>
						<p className='text-sm text-zinc-400 truncate'>{song.artist}</p>

						{/* Restrict Playback or Show Buy Button */}
						<div className='mt-4'>
							{!song.isPurchased ? (
								<button
									className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
									onClick={() => handlePurchase(song)}
								>
									Buy Now
								</button>
							) : (
								<span className='text-green-500 font-medium'>Purchased</span>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

// Handles purchase logic
const handlePurchase = async (song: Song) => {
	try {
		const response = await fetch("/api/payment/initialize", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: "user@example.com", // Replace with dynamic user email
				amount: song.price,
				songId: song.id,
			}),
		});

		const data = await response.json();

		if (data.success) {
			window.location.href = data.data.authorization_url; // Redirect to payment page
		} else {
			toast.error(data.message || "Failed to initialize payment.");
		}
	} catch (error) {
		console.error("Error initializing payment:", error);
		toast.error("An error occurred. Please try again.");
	}
};

export default SectionGrid;
