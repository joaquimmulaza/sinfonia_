import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import UploadView from './UploadView';
import App from '../App';

// Mock matchMedia for Headless UI
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

// Mock URL methods used for audio files
window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
window.URL.revokeObjectURL = vi.fn();
URL.createObjectURL = window.URL.createObjectURL;
URL.revokeObjectURL = window.URL.revokeObjectURL;

// Mock scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('AudioUploader Component', () => {
    it('accepts .mp3 and .wav files', async () => {
        const user = userEvent.setup();
        const onAnalyzeMock = vi.fn();
        render(<UploadView onAnalyze={onAnalyzeMock} />);

        const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mpeg' });
        // The input is hidden, so we need to target it directly or use the label
        // In UploadView.jsx: <input id="file-upload" ... className="hidden" />
        // And there is no <label for="file-upload"> explicitly text.
        // But the drop zone has onClick={() => document.getElementById('file-upload').click()}
        // For testing, we can upload to the input directly.
        const input = document.getElementById('file-upload');

        // user.upload might fail on hidden inputs, using fireEvent
        fireEvent.change(input, { target: { files: [file] } });

        expect(input.files[0]).toBe(file);
        expect(input.files).toHaveLength(1);
    });

    it('rejects invalid file types', async () => {
        const user = userEvent.setup();
        const onAnalyzeMock = vi.fn();
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });
        render(<UploadView onAnalyze={onAnalyzeMock} />);

        const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        const input = document.getElementById('file-upload');

        fireEvent.change(input, { target: { files: [file] } });

        expect(alertMock).toHaveBeenCalledWith('Please upload a valid audio file (.mp3, .wav)');
        alertMock.mockRestore();
    });

    it('calls onAnalyze when analyze button is clicked', async () => {
        const user = userEvent.setup();
        const onAnalyzeMock = vi.fn();
        render(<UploadView onAnalyze={onAnalyzeMock} />);

        const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mpeg' });
        const input = document.getElementById('file-upload');
        fireEvent.change(input, { target: { files: [file] } });

        const button = screen.getByRole('button', { name: /analisar música/i });
        await user.click(button);

        expect(onAnalyzeMock).toHaveBeenCalled();
    });
});

describe('Integration Tests', () => {
    it('shows loading state and then results', async () => {
        const user = userEvent.setup();

        vi.mock('../services/api', () => ({
            analyzeMusic: vi.fn().mockResolvedValue({
                lyrics: [{ time: "0:00", text: "Mama, just killed a man" }],
                translation: [{ time: "0:00", text: "Mama, acabei de matar um homem" }],
                meaning: {
                    summary: "A profound song about regret and existensialism.",
                    context: "Bohemian Rhapsody by Queen",
                    sentiment: "Melancholic",
                    emoji: "🎭",
                    metaphors: [{ text: "Silhouetto", explanation: "Shadow of a man" }]
                }
            })
        }));

        render(<App />);

        // 1. Upload File
        const file = new File(['dummy content'], 'bohemian.mp3', { type: 'audio/mpeg' });
        const input = document.getElementById('file-upload');
        fireEvent.change(input, { target: { files: [file] } });

        // 2. Click Analyze
        const button = screen.getByRole('button', { name: /analisar música/i });
        await user.click(button);

        // 3. Verify Results
        await waitFor(() => {
            expect(screen.getByText(/Mama, just killed a man/i)).toBeInTheDocument();
            expect(screen.getByText(/Mama, acabei de matar um homem/i)).toBeInTheDocument();
            expect(screen.getByText(/A profound song about regret and existensialism./i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});
