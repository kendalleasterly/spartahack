import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"

export function UploadModal() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/image_search`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        console.log("File uploaded successfully")
        // Handle successful upload (e.g., show a success message, close modal)
      } else {
        console.error("File upload failed")
        // Handle upload failure (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      // Handle upload error (e.g., show an error message)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Upload className="h-4 w-4" />
          <span className="sr-only">Upload image</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>Upload an image to search for similar hairstyles or barbers.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Picture
            </Label>
            <Input id="picture" type="file" className="col-span-3" onChange={handleFileChange} accept="image/*" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

