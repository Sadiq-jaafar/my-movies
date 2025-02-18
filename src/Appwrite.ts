import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID: string = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID: string = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID: string = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const databases = new Databases(client);

// Define the expected structure for a Movie object
interface Movie {
    id: number;
    poster_path?: string;
}

// Define the expected structure for an Appwrite document
// interface SearchDocument {
//     $id: string;
//     searchTerm: string;
//     count: number;
//     movie_id: number;
//     poster_url?: string | null;
// }

// Function to update search count in Appwrite database
export const updateSearchCount = async (searchTerm: string, movie: Movie): Promise<void> => {
    try {
        // Check for existing search term
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal('searchTerm', searchTerm)]
        );

        if (result.documents.length > 0) {
            // Update existing document
            const doc = result.documents[0];
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    count: doc.count + 1,
                }
            );
        } else {
            // Create new document
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null
                }
            );
        }
    } catch (error) {
        console.error("Appwrite error:", error);
        throw error; // Re-throw error for handling in calling function
    }
};

export const getTrendingMovies = async () => {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.limit(5), 
                Query.orderDesc("count") 
            ]
        );
        return result.documents;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return []; 
    }
};

