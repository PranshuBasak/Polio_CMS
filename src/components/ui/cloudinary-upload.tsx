import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash2, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

interface CloudinaryUploadWidgetResults {
  event?: string
  info?: string | { secure_url: string }
}

interface CloudinaryUploadProps {
  value: string | string[]
  onChange: (value: string | string[]) => void
  disabled?: boolean
  multiple?: boolean
  resourceType?: "image" | "auto" | "raw"
}

export default function CloudinaryUpload({
  value,
  onChange,
  disabled,
  multiple = false,
  resourceType = "image",
}: CloudinaryUploadProps) {
  const urls = Array.isArray(value) ? value : value ? [value] : []

  const onUpload = useCallback(
    (result: CloudinaryUploadWidgetResults) => {
      if (result.event !== "success" || typeof result.info !== "object") return

      const url = (result.info as { secure_url: string }).secure_url

      if (multiple) {
        onChange([...urls, url])
      } else {
        onChange(url)
      }
    },
    [multiple, onChange, urls]
  )

  const onRemove = useCallback(
    (indexToRemove: number) => {
      if (multiple) {
        onChange(urls.filter((_, i) => i !== indexToRemove))
      } else {
        onChange("")
      }
    },
    [multiple, onChange, urls]
  )

  const isPdf = (url: string) => url.toLowerCase().endsWith(".pdf")

  return (
    <div className="space-y-4">
      <div className={cn("flex items-center gap-4 flex-wrap", urls.length > 0 && "mb-4")}>
        {urls.map((url, index) => (
          <div key={`${url}-${index}`} className="relative w-[200px] h-[200px] rounded-md overflow-hidden group border border-border bg-muted flex items-center justify-center">
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(index)}
                variant="destructive"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {isPdf(url) || resourceType === "raw" ? (
              <div className="flex flex-col items-center p-4 text-center">
                <FileText className="w-12 h-12 mb-2 text-muted-foreground" />
                <span className="text-xs text-muted-foreground break-all line-clamp-3">
                  {url.split('/').pop()}
                </span>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-2 text-xs text-primary hover:underline z-20"
                >
                  Preview PDF
                </a>
              </div>
            ) : (
              <Image 
                  fill 
                  className="object-cover" 
                  alt="Uploaded Image" 
                  src={url} 
                  unoptimized
              />
            )}
          </div>
        ))}
      </div>
      
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={onUpload}
        options={{
          multiple,
          maxFiles: multiple ? 10 : 1,
          resourceType: resourceType,
          sources: ["local", "url", "camera"], 
        }}
      >
        {({ open }) => {
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="outline"
              onClick={() => open()}
              className="flex items-center gap-2"
            >
              <ImagePlus className="h-4 w-4" />
              {multiple ? "Upload Files" : "Upload File"}
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}
