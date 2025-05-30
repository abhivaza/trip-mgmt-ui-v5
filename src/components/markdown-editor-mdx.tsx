"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { CreateLink } from "@mdxeditor/editor";
import { linkPlugin } from "@mdxeditor/editor";
import { linkDialogPlugin } from "@mdxeditor/editor";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="border rounded-md">
      <MDXEditor
        markdown={value}
        onChange={onChange}
        contentEditableClassName="p-4 focus:outline-none max-h-[400px] overflow-y-auto"
        placeholder="Write your content here using markdown..."
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <CreateLink />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
