import { Song } from "../models/song.model.js";
import { Purchase } from "../models/purchase.model.js";

export const getAllSongs = async (req, res, next) => {
	try {
		const userId = req.auth?.userId; // Get user ID if authenticated
		const songs = await Song.find().sort({ createdAt: -1 });

		// Attach isPurchased field
		const songsWithPurchaseStatus = await Promise.all(
			songs.map(async (song) => {
				const isPurchased =
					userId && (await Purchase.findOne({ userId, musicId: song._id, status: "success" }));
				return { ...song.toObject(), isPurchased: !!isPurchased };
			})
		);

		res.status(200).json({
			success: true,
			data: songsWithPurchaseStatus,
		});
	} catch (error) {
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		const userId = req.auth?.userId; // Get user ID if authenticated
		const songs = await Song.aggregate([
			{ $sample: { size: 6 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		// Attach isPurchased field
		const songsWithPurchaseStatus = await Promise.all(
			songs.map(async (song) => {
				const isPurchased =
					userId && (await Purchase.findOne({ userId, musicId: song._id, status: "success" }));
				return { ...song, isPurchased: !!isPurchased };
			})
		);

		res.status(200).json({
			success: true,
			data: songsWithPurchaseStatus,
		});
	} catch (error) {
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const userId = req.auth?.userId; // Get user ID if authenticated
		const songs = await Song.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		// Attach isPurchased field
		const songsWithPurchaseStatus = await Promise.all(
			songs.map(async (song) => {
				const isPurchased =
					userId && (await Purchase.findOne({ userId, musicId: song._id, status: "success" }));
				return { ...song, isPurchased: !!isPurchased };
			})
		);

		res.status(200).json({
			success: true,
			data: songsWithPurchaseStatus,
		});
	} catch (error) {
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		const userId = req.auth?.userId; // Get user ID if authenticated
		const songs = await Song.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		// Attach isPurchased field
		const songsWithPurchaseStatus = await Promise.all(
			songs.map(async (song) => {
				const isPurchased =
					userId && (await Purchase.findOne({ userId, musicId: song._id, status: "success" }));
				return { ...song, isPurchased: !!isPurchased };
			})
		);

		res.status(200).json({
			success: true,
			data: songsWithPurchaseStatus,
		});
	} catch (error) {
		next(error);
	}
};

export const playSong = async (req, res, next) => {
	try {
		const userId = req.auth?.userId; // Get user ID if authenticated
		const { id } = req.params;

		const song = await Song.findById(id);
		if (!song) {
			return res.status(404).json({ success: false, message: "Song not found" });
		}

		// Check if the user has purchased the song
		const isPurchased =
			userId && (await Purchase.findOne({ userId, musicId: id, status: "success" }));

		// Allow 20 seconds of playback if not purchased
		if (!isPurchased) {
			return res.status(403).json({
				success: false,
				message: "Access denied. Purchase the song to play fully.",
				data: { ...song.toObject(), previewOnly: true }, // Include preview flag
			});
		}

		// Full playback allowed
		res.status(200).json({
			success: true,
			message: "Playback authorized",
			data: song,
		});
	} catch (error) {
		next(error);
	}
};
