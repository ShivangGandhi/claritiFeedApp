import { FeedItem } from "../models/FeedItem";
import axios from "axios";

const PAGE_SIZE = 10;
const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

export const fetchFeed = async (page: number): Promise<FeedItem[]> => {
    const start = (page - 1) * PAGE_SIZE;

    try {
        const response = await axios.get(BASE_URL);
        const posts = response.data.slice(start, start + PAGE_SIZE);

        return posts.map((post: any) => ({
            id: post.id,
            title: post.title,
            description: post.body,
            imageUrl: `https://picsum.photos/seed/${post.id}/400/300` // Placeholder images
        }));
    } catch (error) {
        console.error("Error fetching JSONPlaceholder data:", error);
        return [];
    }
};
