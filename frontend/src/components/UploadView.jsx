import React, { useState, useCallback } from 'react'
import { Upload, Music, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Listbox, Transition } from '@headlessui/react' // Using Headless UI for language selector as requested, or shadcn Select? 
// Prompt says: "um seletor de idiomas rico e acessível construído com Headless UI"
// But also "Adicione os componentes base do shadcn: ... Select".
// I will use Headless UI for the language selector to strictly follow the prompt "construído com Headless UI".
// But I also have shadcn Select available. I'll use Headless UI for this specific part as requested.

const languages = [
    { id: 'en', name: 'English' },
    { id: 'pt', name: 'Portuguese' },
    { id: 'es', name: 'Spanish' },
    { id: 'fr', name: 'French' },
    { id: 'de', name: 'German' },
    { id: 'it', name: 'Italian' },
    { id: 'ja', name: 'Japanese' },
]

export default function UploadView({ onAnalyze }) {
    const [selectedLanguage, setSelectedLanguage] = useState(languages[1]) // Default to Portuguese
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState(null)

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files.length > 0) {
            validateAndSetFile(files[0])
        }
    }, [])

    const handleFileInput = useCallback((e) => {
        const files = e.target.files
        if (files.length > 0) {
            validateAndSetFile(files[0])
        }
    }, [])

    const validateAndSetFile = (file) => {
        if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')) {
            setFile(file)
        } else {
            alert('Please upload a valid audio file (.mp3, .wav)')
        }
    }

    const handleSubmit = () => {
        if (file) {
            onAnalyze({ file, language: selectedLanguage })
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8 w-full max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Upload your Music</h2>
                <p className="text-muted-foreground">Analyze lyrics, translation, and meaning with AI.</p>
            </div>

            <div
                className={`w-full p-12 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center justify-center gap-4 group ${isDragging
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                    } ${file ? 'border-primary bg-primary/5' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    accept=".mp3,.wav,audio/*"
                    className="hidden"
                    onChange={handleFileInput}
                />

                <div className={`p-4 rounded-full transition-colors ${file ? 'bg-primary/20' : 'bg-muted group-hover:bg-background'}`}>
                    {file ? (
                        <Music className="w-8 h-8 text-primary" />
                    ) : (
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                </div>

                <div className="text-center">
                    {file ? (
                        <>
                            <p className="font-semibold text-lg">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold text-lg">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground">MP3 or WAV files</p>
                        </>
                    )}
                </div>
            </div>

            <div className="w-full max-w-xs space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Target Language
                </label>

                {/* Headless UI Listbox for custom accessible select */}
                <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
                    <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border border-input shadow-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring sm:text-sm">
                            <span className="block truncate">{selectedLanguage.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <Music className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={React.Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover text-popover-foreground py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
                                {languages.map((person, personIdx) => (
                                    <Listbox.Option
                                        key={personIdx}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {person.name}
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                        <Check className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            <Button
                size="lg"
                className="w-full max-w-xs font-semibold text-lg"
                onClick={handleSubmit}
                disabled={!file}
            >
                Analisar Música
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onAnalyze({ file: { name: "Bohemian Rhapsody.mp3", size: 5000000, type: "audio/mpeg" }, language: selectedLanguage })}
                className="text-xs text-muted-foreground hover:text-foreground"
            >
                Simulate Demo Analysis
            </Button>
        </div>
    )
}
