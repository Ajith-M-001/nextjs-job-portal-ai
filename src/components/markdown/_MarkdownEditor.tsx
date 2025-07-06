"use client";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { cn } from "@/lib/utils";
import { BlockTypeSelect, BoldItalicUnderlineToggles, headingsPlugin, InsertTable, InsertThematicBreak, listsPlugin, ListsToggle, markdownShortcutPlugin, MDXEditor, MDXEditorMethods, MDXEditorProps, quotePlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin } from "@mdxeditor/editor";
import { Ref } from "react";

export const markdownClassNames =
    "max-w-none prose dark:prose-invert prose-neutral font-sans";

export default function InternalMarkdownEditor({
    ref,
    className,
    ...props
}: MDXEditorProps & { ref?: Ref<MDXEditorMethods> }) {
    const isDarkMode = useIsDarkMode()

    return <MDXEditor
        ref={ref}
        className={cn(markdownClassNames, isDarkMode && "dark-theme", className)}
        {...props}
        suppressHtmlProcessing
        spellCheck
        plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            tablePlugin(),
            toolbarPlugin({
                toolbarContents: () => (
                    <>
                        <BlockTypeSelect />
                        <BoldItalicUnderlineToggles />
                        <ListsToggle />
                        <InsertThematicBreak />
                        <InsertTable />
                    </>
                ),
            }),
        ]}
    />
}
