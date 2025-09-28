import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChangeEventHandler, createRef } from "react";

interface IconPickerProps {
  formData: {[key: string]: any}
  setFormData: (data: any) => void
}
export default function IconPicker({ formData, setFormData }: IconPickerProps) {
  const inputRef = createRef<HTMLInputElement>()
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, icon: e.target.files?.[0] })
  }
  const onClick = () => {
    inputRef.current?.click()
  }
  
  return (
    <>
      <Label>Icon (Emoji)</Label>
      <div className="flex items-center">
        <Button onClick={onClick} className="mt-2">
          Pilih Icon
        </Button>
        <input
          ref={inputRef}
          type="file"
          onChange={onChange}
          className="hidden"
          accept=".svg"
        />
        <p className="text-sm pl-4">
          {formData.icon?.name ?? "Tidak ada icon yang dipilih"}
        </p>
      </div>
    </>
  )
}
