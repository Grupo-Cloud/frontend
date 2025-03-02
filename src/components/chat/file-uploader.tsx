import type React from "react"
import { useState, useRef } from "react"
import { FileIcon, UploadIcon, X, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  maxSize?: number // in MB
  onUploadComplete?: (files: File[]) => void
}

interface FileWithProgress {
  file: File
  id: string
  progress: number
}

const ACCEPTED_FILE_TYPES = {
  "application/pdf": "PDF",
  "text/plain": "Text",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/msword": "DOC",
  "text/markdown": "Markdown",
  "text/csv": "CSV",
} as const

export function FileUploader({ maxSize = 10, onUploadComplete, className, ...props }: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = (selectedFiles: File[]) => {
    const newFiles = selectedFiles
      .map((file) => {
        // Validate file type
        if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
          toast.error(`${file.name} is not a supported file type`)
          return null
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          toast.error(`${file.name} exceeds ${maxSize}MB limit`)
          return null
        }

        return {
          file,
          id: crypto.randomUUID(),
          progress: 0,
        }
      })
      .filter((file): file is FileWithProgress => file !== null)

    setFiles((prev) => [...prev, ...newFiles])
  }

  const uploadFiles = async () => {
    setUploading(true)

    const promise = new Promise<File[]>((resolve, reject) => {
      // Simulate upload - replace with actual upload logic
      setTimeout(() => {
        const success = Math.random() > 0.5 // Simulate random success/failure
        if (success) {
          resolve(files.map((f) => f.file))
        } else {
          reject(new Error("Upload failed"))
        }
      }, 2000)
    })

    toast.promise(promise, {
      loading: "Uploading files...",
      success: (uploadedFiles) => {
        setFiles([])
        if (onUploadComplete) {
          onUploadComplete(uploadedFiles)
        }
        return `Successfully uploaded ${uploadedFiles.length} file${uploadedFiles.length !== 1 ? "s" : ""}`
      },
      error: "Failed to upload files",
    })

    try {
      await promise
    } catch (error) {
      // Error is handled by toast.promise
    } finally {
      setUploading(false)
    }
  }

  const truncateFileName = (fileName: string, maxLength = 20) => {
    if (fileName.length <= maxLength) return fileName
    const extension = fileName.split(".").pop()
    const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."))
    const truncatedName = nameWithoutExtension.substring(0, maxLength - 3 - (extension?.length || 0))
    return `${truncatedName}...${extension}`
  }

  const handleAddMoreFiles = () => {
    inputRef.current?.click()
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors",
        className,
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
        accept={Object.keys(ACCEPTED_FILE_TYPES).join(",")}
        multiple
      />
      <div className="flex flex-col items-center justify-center gap-4">
        {files.length === 0 ? (
          <>
            <div className="rounded-full bg-muted p-4">
              <UploadIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <Button variant="link" onClick={() => inputRef.current?.click()}>
                Choose files
              </Button>
              <span className="text-muted-foreground"> or drag and drop</span>
              <p className="text-xs text-muted-foreground mt-2">PDF, DOCX, TXT, MD, CSV up to {maxSize}MB</p>
            </div>
          </>
        ) : (
          <div className="w-full space-y-4">
            {files.map(({ id, file }) => (
              <div key={id} className="flex items-center gap-2 rounded-md border bg-muted p-2">
                <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm" title={file.name}>
                    {truncateFileName(file.name)}
                  </div>
                  <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)}MB</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => setFiles((prev) => prev.filter((f) => f.id !== id))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button className="flex-1" disabled={uploading} onClick={uploadFiles}>
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin">⏳</div>
                    Uploading...
                  </div>
                ) : (
                  `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`
                )}
              </Button>
              <Button variant="outline" onClick={handleAddMoreFiles} disabled={uploading}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add More
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

