export interface Song {
	id: string;  // Changed from _id to id
	title: string;
	artist: string;
	albumId: string | null;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	createdAt: string;
	updatedAt: string;
	isPurchased: boolean;
	isPreview?: boolean;
	price: number;
  }
  
  export interface Album {
	id: string;  // Changed from _id to id
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
	songs: Song[];
  }
  
  export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
  }
  
  export interface Message {
	id: string;  // Changed from _id to id
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
  }
  
  export interface User {
	id: string;  // Changed from _id to id
	clerkId: string;
	fullName: string;
	imageUrl: string;
  }
  