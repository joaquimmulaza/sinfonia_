import React, { useState } from 'react'
import UploadView from './components/UploadView'
import LoadingState from './components/LoadingState'
import KaraokeSession from './components/KaraokeSession'
import { analyzeMusic } from './services/api'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'

function App() {
    const [view, setView] = useState('upload') // upload, loading, results
    const [data, setData] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [error, setError] = useState(null)

    const handleAnalyze = async (payload) => {
        setError(null)
        setSelectedFile(payload.file)
        setView('loading')
        try {
            const result = await analyzeMusic(payload)
            setData(result)
            setView('results')
        } catch (err) {
            console.error("Analysis failed:", err)
            setError(err.message || "Failed to analyze audio. Please try again.")
            setView('upload')
        }
    }

    const handleReset = () => {
        setView('upload')
        setData(null)
        setSelectedFile(null)
        setError(null)
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
            {/* Header */}
            <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <span className="text-primary text-2xl">♪</span> Sinfonia
                    </div>
                    {view === 'results' && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            New Analysis
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background gradients */}
                <div className="absolute inset-0 z-[-1] pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl opacity-50" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-3xl opacity-50" />
                </div>

                <div className="container max-w-screen-2xl py-6 flex-1 flex flex-col px-4 md:px-8">
                    {view === 'upload' && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-500 w-full">
                            {error && (
                                <div className="bg-destructive/10 text-destructive border border-destructive/20 w-full max-w-md p-4 rounded-xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
                                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-semibold text-sm">Failed to Analyze Audio</h4>
                                        <p className="text-sm opacity-90 leading-relaxed">{error}</p>
                                    </div>
                                </div>
                            )}
                            <UploadView onAnalyze={handleAnalyze} />
                        </div>
                    )}

                    {view === 'loading' && (
                        <div className="flex-1 flex items-center justify-center animate-in fade-in duration-500">
                            <LoadingState />
                        </div>
                    )}

                    {view === 'results' && data && (
                        <div className="flex-1 animate-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold tracking-tight">{selectedFile?.name.replace(/\.[^/.]+$/, "")}</h1>
                                <p className="text-muted-foreground">AI Analysis Result</p>
                            </div>
                            <KaraokeSession data={data} audioFile={selectedFile} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default App
