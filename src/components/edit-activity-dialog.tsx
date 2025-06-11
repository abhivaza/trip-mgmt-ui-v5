"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MarkdownEditor } from "@/components/markdown-editor-mdx";
import { Sparkles } from "lucide-react";
import { Input } from "./ui/input";

interface EditActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editName: string;
  editContent: string;
  setEditContent: (content: string) => void;
  onSave: () => Promise<void>;
  onGenerateAI: () => Promise<void>;
  isGenerating: boolean;
  specialRequest?: string;
  setSpecialRequest?: (request: string) => void;
}

export const EditActivityDialog = ({
  isOpen,
  onClose,
  editName,
  editContent,
  setEditContent,
  onSave,
  onGenerateAI,
  isGenerating,
  specialRequest,
  setSpecialRequest,
}: EditActivityDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center bg-white rounded-lg shadow-md">
            <Input
              type="text"
              placeholder={
                specialRequest ||
                "Provide instructions to customize. e.g. Make it more kid friendly"
              }
              value={specialRequest}
              onChange={(e) => setSpecialRequest?.(e.target.value)}
              className="grow border-none focus:ring-0"
            />
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className="ml-2"
            >
              {!isGenerating && <Sparkles className="h-4 w-4" />}
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>

          <div className="space-y-2">
            <MarkdownEditor value={editContent} onChange={setEditContent} />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
