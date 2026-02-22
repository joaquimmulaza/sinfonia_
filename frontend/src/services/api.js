const API_URL = "http://localhost:8000/api/analyze";

export const analyzeMusic = async ({ file, language }) => {
    const formData = new FormData();
    formData.append("file", file);
    // Extract the language name (e.g., 'English', 'Portuguese') from the language object
    formData.append("target_language", language.name || language);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: formData,
            // Content-Type header is not set manually to allow the browser to set the boundary
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Analysis request failed:", error);
        throw error; // Re-throw to be handled by the UI
    }
};
